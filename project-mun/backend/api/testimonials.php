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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT * FROM testimonials ORDER BY display_order ASC, id ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($testimonials);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['name']) || !isset($data['content'])) {
        http_response_code(400);
        echo json_encode(["error" => "Name and content are required"]);
        exit;
    }
    
    try {
        $name = htmlspecialchars(strip_tags($data['name']));
        $role = isset($data['role']) ? htmlspecialchars(strip_tags($data['role'])) : '';
        $content = htmlspecialchars(strip_tags($data['content']));
        $rating = isset($data['rating']) ? intval($data['rating']) : 5;
        $image_url = isset($data['image_url']) ? htmlspecialchars(strip_tags($data['image_url'])) : '';
        $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $query = "INSERT INTO testimonials (name, role, content, rating, image_url, is_active, display_order) 
                  VALUES (:name, :role, :content, :rating, :image_url, :is_active, :display_order)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":content", $content);
        $stmt->bindParam(":rating", $rating);
        $stmt->bindParam(":image_url", $image_url);
        $stmt->bindParam(":is_active", $is_active, PDO::PARAM_BOOL);
        $stmt->bindParam(":display_order", $display_order);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Testimonial created successfully", "id" => $conn->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create testimonial"]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Testimonial ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        $name = isset($data['name']) ? htmlspecialchars(strip_tags($data['name'])) : '';
        $role = isset($data['role']) ? htmlspecialchars(strip_tags($data['role'])) : '';
        $content = isset($data['content']) ? htmlspecialchars(strip_tags($data['content'])) : '';
        $rating = isset($data['rating']) ? intval($data['rating']) : 5;
        $image_url = isset($data['image_url']) ? htmlspecialchars(strip_tags($data['image_url'])) : '';
        $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $queryParts = [];
        $params = [':id' => $id];
        
        if (isset($data['name'])) {
            $queryParts[] = "name = :name";
            $params[':name'] = $name;
        }
        if (isset($data['role'])) {
            $queryParts[] = "role = :role";
            $params[':role'] = $role;
        }
        if (isset($data['content'])) {
            $queryParts[] = "content = :content";
            $params[':content'] = $content;
        }
        if (isset($data['rating'])) {
            $queryParts[] = "rating = :rating";
            $params[':rating'] = $rating;
        }
        if (isset($data['image_url'])) {
            $queryParts[] = "image_url = :image_url";
            $params[':image_url'] = $image_url;
        }
        if (isset($data['is_active'])) {
            $queryParts[] = "is_active = :is_active";
            $params[':is_active'] = $is_active;
        }
        if (isset($data['display_order'])) {
            $queryParts[] = "display_order = :display_order";
            $params[':display_order'] = $display_order;
        }
        
        if (empty($queryParts)) {
            http_response_code(400);
            echo json_encode(["error" => "No fields to update"]);
            exit;
        }
        
        $query = "UPDATE testimonials SET " . implode(', ', $queryParts) . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode(["message" => "Testimonial updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update testimonial"]);
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
        echo json_encode(["error" => "Testimonial ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        
        $query = "DELETE FROM testimonials WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Testimonial deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete testimonial"]);
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
