<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/mail.php';

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Validate required fields
$name = htmlspecialchars($data['name'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($data['subject'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

try {
    // Save message to database first
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        $query = "INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        
        if (!$stmt->execute()) {
            error_log('Failed to save message to database');
            // Continue with email sending even if database save fails
        }
    }
    
    // Create mail handler instance
    $mailHandler = new MailHandler();
    
    // Send the main contact email
    $result = $mailHandler->sendContactEmail($name, $email, $subject, $message);
    
    if ($result['success']) {
        // Send auto-reply to the user
        $autoReply = $mailHandler->sendAutoReply($name, $email, $subject);
        
        if ($autoReply['success']) {
            echo json_encode([
                'success' => true, 
                'message' => 'Message sent successfully! You will receive a confirmation email shortly.'
            ]);
        } else {
            // Log auto-reply error but don't fail the main request
            error_log('Auto-reply failed: ' . $autoReply['message']);
            echo json_encode([
                'success' => true, 
                'message' => 'Message sent successfully!'
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $result['message']]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred. Please try again later.']);
    error_log('Contact form error: ' . $e->getMessage());
}
