<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to handle file upload
function handleFileUpload($file, $existingImage = null) {
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) return $existingImage;
    
    $uploadDir = __DIR__ . '/../../uploads/team/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Delete old image if exists
        if ($existingImage) {
            $oldPath = $uploadDir . basename($existingImage);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
        return 'uploads/team/' . $filename;
    }
    
    return $existingImage;
}

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->query("SELECT * FROM team_members ORDER BY display_order ASC, id ASC");
            $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format social links for frontend compatibility
            foreach ($members as &$member) {
                $member ['socials'] = [
                    'linkedin' => $member['linkedin'] ?? '#',
                    'github' => $member['github'] ?? '#',
                    'email' => $member['email'] ?? '#'
                ];
                // Add full URL for images
                if ($member['image_url']) {
                    $member['image_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-mun/' . $member['image_url'];
                }
            }

            echo json_encode($members);
            break;

        case 'POST':
            // Check if it's a PUT override
            $isPut = isset($_POST['_method']) && $_POST['_method'] === 'PUT';
            
            if ($isPut) {
                // UPDATE existing member
                $id = $_POST['id'] ?? null;
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'ID required']);
                    break;
                }
                
                // Get existing image
                $stmt = $db->prepare("SELECT image_url FROM team_members WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Handle image upload
                $imageUrl = $existing['image_url'] ?? null;
                if (!empty($_FILES['image'])) {
                    $imageUrl = handleFileUpload($_FILES['image'], $existing['image_url'] ?? null);
                }
                
                $stmt = $db->prepare("UPDATE team_members SET name = :name, role = :role, description = :description, initials = :initials, linkedin = :linkedin, github = :github, email = :email, image_url = :image_url WHERE id = :id");
                $stmt->execute([
                    ':id' => $id,
                    ':name' => $_POST['name'] ?? '',
                    ':role' => $_POST['role'] ?? '',
                    ':description' => $_POST['description'] ?? '',
                    ':initials' => $_POST['initials'] ?? '',
                    ':linkedin' => $_POST['linkedin'] ?? '#',
                    ':github' => $_POST['github'] ?? '#',
                    ':email' => $_POST['email'] ?? '',
                    ':image_url' => $imageUrl
                ]);
                
                echo json_encode(['success' => true, 'image_url' => $imageUrl]);
            } else {
                // CREATE new member
                $imageUrl = null;
                if (!empty($_FILES['image'])) {
                    $imageUrl = handleFileUpload($_FILES['image']);
                }
                
                $stmt = $db->prepare("INSERT INTO team_members (name, role, description, initials, linkedin, github, email, image_url, display_order) VALUES (:name, :role, :description, :initials, :linkedin, :github, :email, :image_url, :display_order)");
                $stmt->execute([
                    ':name' => $_POST['name'] ?? '',
                    ':role' => $_POST['role'] ?? '',
                    ':description' => $_POST['description'] ?? '',
                    ':initials' => $_POST['initials'] ?? '',
                    ':linkedin' => $_POST['linkedin'] ?? '#',
                    ':github' => $_POST['github'] ?? '#',
                    ':email' => $_POST['email'] ?? '',
                    ':image_url' => $imageUrl,
                    ':display_order' => $_POST['display_order'] ?? 0
                ]);
                
                echo json_encode(['success' => true, 'id' => $db->lastInsertId(), 'image_url' => $imageUrl]);
            }
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID required']);
                break;
            }
            
            // Get image before deleting
            $stmt = $db->prepare("SELECT image_url FROM team_members WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $member = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Delete image file
            if ($member && $member['image_url']) {
                $uploadDir = __DIR__ . '/../../';
                $imagePath = $uploadDir . $member['image_url'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            $stmt = $db->prepare("DELETE FROM team_members WHERE id = :id");
            $stmt->execute([':id' => $id]);
            
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    // If table doesn't exist, return empty array for GET
    if ($method === 'GET' && strpos($e->getMessage(), "doesn't exist") !== false) {
        echo json_encode([]);
        exit;
    }

    http_response_code(500);
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
    