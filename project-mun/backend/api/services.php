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
        $query = "SELECT * FROM services ORDER BY display_order ASC, id ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Parse features from JSON string to array
        foreach ($services as &$service) {
            if (isset($service['features']) && $service['features']) {
                $service['features'] = json_decode($service['features'], true) ?: [];
            } else {
                $service['features'] = [];
            }
        }
        
        echo json_encode($services);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['title']) || !isset($data['description'])) {
        http_response_code(400);
        echo json_encode(["error" => "Title and description are required"]);
        exit;
    }
    
    try {
        $title = htmlspecialchars(strip_tags($data['title']));
        $description = htmlspecialchars(strip_tags($data['description']));
        $icon = isset($data['icon']) ? htmlspecialchars(strip_tags($data['icon'])) : 'Code';
        $color = isset($data['color']) ? htmlspecialchars(strip_tags($data['color'])) : 'blue';
        $features = isset($data['features']) ? json_encode($data['features']) : json_encode([]);
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $query = "INSERT INTO services (title, description, icon, color, features, display_order) 
                  VALUES (:title, :description, :icon, :color, :features, :display_order)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":title", $title);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":icon", $icon);
        $stmt->bindParam(":color", $color);
        $stmt->bindParam(":features", $features);
        $stmt->bindParam(":display_order", $display_order);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Service created successfully", "id" => $conn->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create service"]);
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
        echo json_encode(["error" => "Service ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        $title = isset($data['title']) ? htmlspecialchars(strip_tags($data['title'])) : '';
        $description = isset($data['description']) ? htmlspecialchars(strip_tags($data['description'])) : '';
        $icon = isset($data['icon']) ? htmlspecialchars(strip_tags($data['icon'])) : 'Code';
        $color = isset($data['color']) ? htmlspecialchars(strip_tags($data['color'])) : 'blue';
        $features = isset($data['features']) ? json_encode($data['features']) : json_encode([]);
        $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0;
        
        $queryParts = [];
        $params = [':id' => $id];
        
        if (isset($data['title'])) {
            $queryParts[] = "title = :title";
            $params[':title'] = $title;
        }
        if (isset($data['description'])) {
            $queryParts[] = "description = :description";
            $params[':description'] = $description;
        }
        if (isset($data['icon'])) {
            $queryParts[] = "icon = :icon";
            $params[':icon'] = $icon;
        }
        if (isset($data['color'])) {
            $queryParts[] = "color = :color";
            $params[':color'] = $color;
        }
        if (isset($data['features'])) {
            $queryParts[] = "features = :features";
            $params[':features'] = $features;
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
        
        $query = "UPDATE services SET " . implode(', ', $queryParts) . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode(["message" => "Service updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update service"]);
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
        echo json_encode(["error" => "Service ID is required"]);
        exit;
    }
    
    try {
        $id = intval($data['id']);
        
        $query = "DELETE FROM services WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Service deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete service"]);
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
