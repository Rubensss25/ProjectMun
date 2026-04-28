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
    
    $uploadDir = __DIR__ . '/../../uploads/hero/';
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
        return 'uploads/hero/' . $filename;
    }
    
    return $existingImage;
}

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->query("SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC");
            $slides = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Add full URL for images
            foreach ($slides as &$slide) {
                if ($slide['image_url']) {
                    $slide['image_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-mun/' . $slide['image_url'];
                }
                $slide['is_active'] = (bool)$slide['is_active'];
            }

            echo json_encode($slides);
            break;

        case 'POST':
            // Check if it's a PUT override
            $isPut = isset($_POST['_method']) && $_POST['_method'] === 'PUT';
            
            if ($isPut) {
                // UPDATE existing slide
                $id = $_POST['id'] ?? null;
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'ID required']);
                    break;
                }
                
                // Get existing image
                $stmt = $db->prepare("SELECT image_url FROM hero_slides WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Handle image upload
                $imageUrl = $existing['image_url'] ?? null;
                if (!empty($_FILES['image'])) {
                    $imageUrl = handleFileUpload($_FILES['image'], $existing['image_url'] ?? null);
                }
                
                $stmt = $db->prepare("UPDATE hero_slides SET title = :title, subtitle = :subtitle, description = :description, button_text = :button_text, button_link = :button_link, image_url = :image_url, display_order = :display_order, is_active = :is_active WHERE id = :id");
                $stmt->execute([
                    ':id' => $id,
                    ':title' => $_POST['title'] ?? '',
                    ':subtitle' => $_POST['subtitle'] ?? '',
                    ':description' => $_POST['description'] ?? '',
                    ':button_text' => $_POST['button_text'] ?? 'Learn More',
                    ':button_link' => $_POST['button_link'] ?? '#portfolio',
                    ':image_url' => $imageUrl,
                    ':display_order' => $_POST['display_order'] ?? 0,
                    ':is_active' => $_POST['is_active'] ?? 1
                ]);
                
                echo json_encode(['success' => true, 'image_url' => $imageUrl]);
            } else {
                // CREATE new slide
                $imageUrl = null;
                if (!empty($_FILES['image'])) {
                    $imageUrl = handleFileUpload($_FILES['image']);
                }
                
                $stmt = $db->prepare("INSERT INTO hero_slides (title, subtitle, description, button_text, button_link, image_url, display_order, is_active) VALUES (:title, :subtitle, :description, :button_text, :button_link, :image_url, :display_order, :is_active)");
                $stmt->execute([
                    ':title' => $_POST['title'] ?? '',
                    ':subtitle' => $_POST['subtitle'] ?? '',
                    ':description' => $_POST['description'] ?? '',
                    ':button_text' => $_POST['button_text'] ?? 'Learn More',
                    ':button_link' => $_POST['button_link'] ?? '#portfolio',
                    ':image_url' => $imageUrl,
                    ':display_order' => $_POST['display_order'] ?? 0,
                    ':is_active' => $_POST['is_active'] ?? 1
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
            $stmt = $db->prepare("SELECT image_url FROM hero_slides WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $slide = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Delete image file
            if ($slide && $slide['image_url']) {
                $uploadDir = __DIR__ . '/../../';
                $imagePath = $uploadDir . $slide['image_url'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            $stmt = $db->prepare("DELETE FROM hero_slides WHERE id = :id");
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
