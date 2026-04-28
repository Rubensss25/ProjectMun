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
        $query = "SELECT * FROM skills WHERE is_active = TRUE ORDER BY display_order ASC, id ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($skills);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['name']) || !isset($data['category'])) {
        http_response_code(400);
        echo json_encode(["error" => "Name and category are required"]);
        exit;
    }
    
    try {
        $name = htmlspecialchars(strip_tags($data['name']));
        $category = htmlspecialchars(strip_tags($data['category']));
        $color = isset($data['color']) ? htmlspecialchars(strip_tags($data['color'])) : '#3B82F6';
        $proficiency = isset($data['proficiency']) ? intval($data['proficiency']) : 80;
        $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $query = "INSERT INTO skills (name, category, color, proficiency, is_active, display_order) 
                  VALUES (:name, :category, :color, :proficiency, :is_active, :display_order)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":color", $color);
        $stmt->bindParam(":proficiency", $proficiency);
        $stmt->bindParam(":is_active", $is_active, PDO::PARAM_BOOL);
        $stmt->bindParam(":display_order", $display_order);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Skill created successfully", "id" => $conn->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create skill"]);
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
        echo json_encode(["error" => "Skill ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        $name = isset($data['name']) ? htmlspecialchars(strip_tags($data['name'])) : '';
        $category = isset($data['category']) ? htmlspecialchars(strip_tags($data['category'])) : '';
        $color = isset($data['color']) ? htmlspecialchars(strip_tags($data['color'])) : '#3B82F6';
        $proficiency = isset($data['proficiency']) ? intval($data['proficiency']) : 80;
        $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $queryParts = [];
        $params = [':id' => $id];
        
        if (isset($data['name'])) {
            $queryParts[] = "name = :name";
            $params[':name'] = $name;
        }
        if (isset($data['category'])) {
            $queryParts[] = "category = :category";
            $params[':category'] = $category;
        }
        if (isset($data['color'])) {
            $queryParts[] = "color = :color";
            $params[':color'] = $color;
        }
        if (isset($data['proficiency'])) {
            $queryParts[] = "proficiency = :proficiency";
            $params[':proficiency'] = $proficiency;
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
        
        $query = "UPDATE skills SET " . implode(', ', $queryParts) . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode(["message" => "Skill updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update skill"]);
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
        echo json_encode(["error" => "Skill ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        
        $query = "DELETE FROM skills WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Skill deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete skill"]);
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
