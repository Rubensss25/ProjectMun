    <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
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
    // Check if email parameter is provided (user profile fetch)
    if (isset($_GET['email'])) {
        $email = $_GET['email'];
        
        try {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'name' => $user['name'] ?? '',
                        'email' => $user['email'] ?? '',
                        'role' => $user['role'] ?? '',
                        'phone' => $user['phone'] ?? '',
                        'location' => $user['location'] ?? '',
                        'bio' => $user['bio'] ?? ''
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
            }
        } catch(PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => 'Database error: ' . $e->getMessage()
            ]);
        }
        exit;
    }
    
    // Regular settings fetch
    $query = "SELECT * FROM settings";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $settings = $stmt->fetchAll();
    
    $result = [];
    foreach ($settings as $setting) {
        $result[$setting['setting_key']] = $setting['setting_value'];
    }
    
    echo json_encode($result);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $rawInput = file_get_contents("php://input");
    
    // Check if input is empty
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode(["error" => "No data received"]);
        exit;
    }
    
    $data = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data: " . json_last_error_msg()]);
        exit;
    }
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data"]);
        exit;
    }
    
    // Check if this is a user profile update
    if (isset($data['action']) && $data['action'] === 'update_profile') {
        // Handle user profile update
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $role = $data['role'] ?? '';
        $phone = $data['phone'] ?? '';
        $location = $data['location'] ?? '';
        $bio = $data['bio'] ?? '';
        
        try {
            // Create users table if not exists
            $conn->exec("CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                role VARCHAR(100),
                phone VARCHAR(50),
                location VARCHAR(255),
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )");
            
            // Check if user exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                // Update existing user
                $updateStmt = $conn->prepare("UPDATE users SET name = ?, role = ?, phone = ?, location = ?, bio = ? WHERE email = ?");
                $updateStmt->execute([$name, $role, $phone, $location, $bio, $email]);
            } else {
                // Insert new user
                $insertStmt = $conn->prepare("INSERT INTO users (name, email, role, phone, location, bio) VALUES (?, ?, ?, ?, ?, ?)");
                $insertStmt->execute([$name, $email, $role, $phone, $location, $bio]);
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Profile updated successfully',
                'user' => [
                    'name' => $name,
                    'email' => $email,
                    'role' => $role,
                    'phone' => $phone,
                    'location' => $location,
                    'bio' => $bio
                ]
            ]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
        exit;
    }
    
    // Handle regular settings update
    try {
        $updated = 0;
        $errors = [];
        
        foreach ($data as $key => $value) {
            // Skip non-string keys or special keys
            if (empty($key) || !is_string($key) || $key === 'action') {
                continue;
            }
            
            // Check if setting exists
            $checkQuery = "SELECT id FROM settings WHERE setting_key = :key";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->bindParam(':key', $key);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                // Update existing setting
                $updateQuery = "UPDATE settings SET setting_value = :value WHERE setting_key = :key";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bindParam(':key', $key);
                $updateStmt->bindParam(':value', $value);
                
                if ($updateStmt->execute()) {
                    $updated++;
                } else {
                    $errors[] = "Failed to update setting: $key";
                }
            } else {
                // Insert new setting
                $insertQuery = "INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value)";
                $insertStmt = $conn->prepare($insertQuery);
                $insertStmt->bindParam(':key', $key);
                $insertStmt->bindParam(':value', $value);
                
                if ($insertStmt->execute()) {
                    $updated++;
                } else {
                    $errors[] = "Failed to create setting: $key";
                }
            }
        }
        
        if ($updated > 0) {
            echo json_encode([
                "success" => true, 
                "message" => "Successfully updated $updated settings",
                "updated_count" => $updated
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false, 
                "message" => "No settings were updated",
                "errors" => $errors
            ]);
        }
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "error" => "Database error: " . $e->getMessage()
        ]);
    }
} 
else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
