<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM projects ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($projects as &$project) {
        if ($project['image_filename']) {
            $project['image_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-mun/backend/uploads/' . $project['image_filename'];
        }
        if ($project['video_filename']) {
            $project['video_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-mun/backend/uploads/' . $project['video_filename'];
        }
        if ($project['video_two_filename']) {
            $project['video_two_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-mun/backend/uploads/' . $project['video_two_filename'];
        }
    }
    
    echo json_encode($projects);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isUpdate = isset($_POST['_method']) && $_POST['_method'] === 'PUT';
    
    $title = htmlspecialchars(strip_tags($_POST['title']));
    $description = htmlspecialchars(strip_tags($_POST['description']));
    $category = htmlspecialchars(strip_tags($_POST['category']));
    $project_url = isset($_POST['project_url']) ? htmlspecialchars(strip_tags($_POST['project_url'])) : '';
    $video_url = isset($_POST['video_url']) ? htmlspecialchars(strip_tags($_POST['video_url'])) : '';
    $video_two_url = isset($_POST['video_two_url']) ? htmlspecialchars(strip_tags($_POST['video_two_url'])) : '';
    
    $imageFilenames = [];
    $imagePaths = [];
    $videoFilenames = [];
    $videoPaths = [];
    
    if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
        $imageCount = count($_FILES['images']['name']);
        for ($i = 0; $i < $imageCount; $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['images']['tmp_name'][$i];
                $fileName = $_FILES['images']['name'][$i];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif', 'webp');
                
                if (in_array($fileExtension, $allowedExtensions)) {
                    $newFileName = md5(time() . $fileName . $i) . '.' . $fileExtension;
                    $destPath = $uploadDir . $newFileName;
                    
                    if (move_uploaded_file($fileTmpPath, $destPath)) {
                        $imageFilenames[] = $newFileName;
                        $imagePaths[] = $destPath;
                    }
                }
            }
        }
    }
    
    // Handle multiple videos upload
    if (isset($_FILES['videos']) && is_array($_FILES['videos']['name'])) {
        $videoCount = count($_FILES['videos']['name']);
        for ($i = 0; $i < $videoCount; $i++) {
            if ($_FILES['videos']['error'][$i] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['videos']['tmp_name'][$i];
                $fileName = $_FILES['videos']['name'][$i];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                $allowedExtensions = array('mp4', 'webm', 'ogg', 'mov');
                
                if (in_array($fileExtension, $allowedExtensions)) {
                    $newFileName = md5(time() . $fileName . $i) . '.' . $fileExtension;
                    $destPath = $uploadDir . $newFileName;
                    
                    if (move_uploaded_file($fileTmpPath, $destPath)) {
                        $videoFilenames[] = $newFileName;
                        $videoPaths[] = $destPath;
                    }
                }
            }
        }
    }
    
    // Handle legacy single image field
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif', 'webp');
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $destPath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $imageFilenames[] = $newFileName;
                $imagePaths[] = $destPath;
            }
        }
    }
    
    // Handle multiple videos
    if (isset($_FILES['videos']) && is_array($_FILES['videos']['name'])) {
        $videoCount = count($_FILES['videos']['name']);
        for ($i = 0; $i < $videoCount; $i++) {
            if ($_FILES['videos']['error'][$i] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['videos']['tmp_name'][$i];
                $fileName = $_FILES['videos']['name'][$i];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                $allowedExtensions = array('mp4', 'webm', 'ogg', 'mov');
                
                if (in_array($fileExtension, $allowedExtensions)) {
                    $newFileName = md5(time() . $fileName . $i) . '.' . $fileExtension;
                    $destPath = $uploadDir . $newFileName;
                    
                    if (move_uploaded_file($fileTmpPath, $destPath)) {
                        $videoFilenames[] = $newFileName;
                        $videoPaths[] = $destPath;
                    }
                }
            }
        }
    }
    
    // Handle legacy single video field
    if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['video']['tmp_name'];
        $fileName = $_FILES['video']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $allowedExtensions = array('mp4', 'webm', 'ogg', 'mov');
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $destPath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $videoFilenames[] = $newFileName;
                $videoPaths[] = $destPath;
            }
        }
    }
    
    // Convert arrays to single values for database compatibility
    if (!empty($imageFilenames)) {
        $imageFilename = $imageFilenames[0];
        $imagePath = $imagePaths[0];
    }
    
    if (!empty($videoFilenames)) {
        $videoFilename = $videoFilenames[0];
        $videoPath = $videoPaths[0];
        if (count($videoFilenames) > 1) {
            $videoTwoFilename = $videoFilenames[1];
            $videoTwoPath = $videoPaths[1];
        }
    }

    try {
        if ($isUpdate) {
            $id = intval($_POST['id']);
            
            $queryParts = [
                "title = :title",
                "description = :description",
                "category = :category",
                "project_url = :project_url"
            ];
            
            $params = [
                ':id' => $id,
                ':title' => $title,
                ':description' => $description,
                ':category' => $category,
                ':project_url' => $project_url
            ];
            
            if ($imageFilename) {
                $queryParts[] = "image_filename = :image_filename";
                $queryParts[] = "image_path = :image_path";
                $params[':image_filename'] = $imageFilename;
                $params[':image_path'] = $imagePath;
            }
            
            if ($videoFilename) {
                $queryParts[] = "video_filename = :video_filename";
                $queryParts[] = "video_path = :video_path";
                $params[':video_filename'] = $videoFilename;
                $params[':video_path'] = $videoPath;
            }
            
            if ($videoTwoFilename) {
                $queryParts[] = "video_two_filename = :video_two_filename";
                $queryParts[] = "video_two_path = :video_two_path";
                $params[':video_two_filename'] = $videoTwoFilename;
                $params[':video_two_path'] = $videoTwoPath;
            }
            
            $query = "UPDATE projects SET " . implode(', ', $queryParts) . " WHERE id = :id";
            $stmt = $conn->prepare($query);
            
            if ($stmt->execute($params)) {
                echo json_encode(["message" => "Project updated successfully", "id" => $id]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update project"]);
            }
        } else {
            $query = "INSERT INTO projects (title, description, category, project_url, image_filename, image_path, video_filename, video_path, video_two_filename, video_two_path) 
                      VALUES (:title, :description, :category, :project_url, :image_filename, :image_path, :video_filename, :video_path, :video_two_filename, :video_two_path)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":category", $category);
            $stmt->bindParam(":project_url", $project_url);
            $stmt->bindParam(":image_filename", $imageFilename);
            $stmt->bindParam(":image_path", $imagePath);
            $stmt->bindParam(":video_filename", $videoFilename);
            $stmt->bindParam(":video_path", $videoPath);
            $stmt->bindParam(":video_two_filename", $videoTwoFilename);
            $stmt->bindParam(":video_two_path", $videoTwoPath);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Project created successfully", "id" => $conn->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to create project"]);
            }
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Project ID is required"]);
        exit;
    }

    $id = intval($data['id']);

    try {
        // Get image filename first to delete file
        $stmt = $conn->prepare("SELECT image_filename FROM projects WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($project && $project['image_filename']) {
            $filePath = $uploadDir . $project['image_filename'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        $query = "DELETE FROM projects WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Project deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete project"]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>