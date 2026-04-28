<?php
/**
 * Mail Configuration & Handler
 * Update these settings with your SMTP credentials
 */

// Include the autoloader
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Configuration
$config = [
    // SMTP Server Settings
    'smtp_host' => 'smtp.gmail.com',           // SMTP server address
    'smtp_port' => 587,                         // SMTP port (587 for TLS, 465 for SSL)
    'smtp_secure' => 'tls',                     // Encryption: 'tls' or 'ssl'
    'smtp_auth' => true,                        // Enable SMTP authentication
    
    // Email Credentials
    'smtp_username' => 'panganibanalvin4@gmail.com',  // Your email address
    'smtp_password' => 'vazhkbaepbpydgfn',     // Your app password (not regular password)
    
    // Sender & Recipient
    'from_email' => 'noreply@projectmun.com',   // Sender email
    'from_name' => 'Project MUN Contact Form',  // Sender name
    'to_email' => 'projectmun.team@gmail.com',  // Where to receive emails
    'to_name' => 'Project MUN Team',            // Recipient name
    
    // Reply Settings
    'reply_to_name' => 'Project MUN',           // Reply-to name
];

class MailHandler {
    private $mail;
    private $config;
    
    public function __construct() {
        global $config;
        $this->config = $config;
        $this->mail = new PHPMailer(true);
        $this->setup();
    }
    
    private function setup() {
        // Server settings
        $this->mail->isSMTP();
        $this->mail->Host       = $this->config['smtp_host'];
        $this->mail->SMTPAuth   = $this->config['smtp_auth'];
        $this->mail->Username   = $this->config['smtp_username'];
        $this->mail->Password   = $this->config['smtp_password'];
        $this->mail->SMTPSecure = $this->config['smtp_secure'];
        $this->mail->Port       = $this->config['smtp_port'];
        
        // Set default sender
        $this->mail->setFrom(
            $this->config['from_email'], 
            $this->config['from_name']
        );
    }
    
    public function sendContactEmail($name, $email, $subject, $message) {
        try {
            // Add recipient
            $this->mail->addAddress(
                $this->config['to_email'], 
                $this->config['to_name']
            );
            
            // Add reply-to
            $this->mail->addReplyTo($email, $name);
            
            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = "Contact Form: " . $subject;
            
            // Create HTML email body
            $htmlBody = "
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #0a1628; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .footer { background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #0a1628; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>New Contact Form Submission</h2>
                        </div>
                        <div class='content'>
                            <div class='field'>
                                <span class='label'>Name:</span> " . htmlspecialchars($name) . "
                            </div>
                            <div class='field'>
                                <span class='label'>Email:</span> " . htmlspecialchars($email) . "
                            </div>
                            <div class='field'>
                                <span class='label'>Subject:</span> " . htmlspecialchars($subject) . "
                            </div>
                            <div class='field'>
                                <span class='label'>Message:</span><br>
                                " . nl2br(htmlspecialchars($message)) . "
                            </div>
                        </div>
                        <div class='footer'>
                            <p>This email was sent from the Project MUN contact form.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";
            
            $this->mail->Body = $htmlBody;
            
            // Plain text version for email clients that don't support HTML
            $this->mail->AltBody = "
                New Contact Form Submission\n\n
                Name: $name\n
                Email: $email\n
                Subject: $subject\n\n
                Message:\n$message\n\n
                ---
                This email was sent from the Project MUN contact form.
            ";
            
            $this->mail->send();
            return ['success' => true, 'message' => 'Email sent successfully'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Email could not be sent. Error: ' . $this->mail->ErrorInfo];
        }
    }
    
    public function sendAutoReply($name, $email, $subject) {
        try {
            // Create a new PHPMailer instance for the auto-reply
            $autoReply = new PHPMailer(true);
            $autoReply->isSMTP();
            $autoReply->Host       = $this->config['smtp_host'];
            $autoReply->SMTPAuth   = $this->config['smtp_auth'];
            $autoReply->Username   = $this->config['smtp_username'];
            $autoReply->Password   = $this->config['smtp_password'];
            $autoReply->SMTPSecure = $this->config['smtp_secure'];
            $autoReply->Port       = $this->config['smtp_port'];
            
            $autoReply->setFrom(
                $this->config['from_email'], 
                $this->config['from_name']
            );
            $autoReply->addAddress($email, $name);
            
            $autoReply->isHTML(true);
            $autoReply->Subject = "Thank you for contacting Project MUN";
            
            $autoReplyBody = "
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #0a1628; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .footer { background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Thank You for Contacting Us!</h2>
                        </div>
                        <div class='content'>
                            <p>Dear " . htmlspecialchars($name) . ",</p>
                            <p>Thank you for reaching out to Project MUN. We have received your message regarding: <strong>" . htmlspecialchars($subject) . "</strong></p>
                            <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
                            <p>If you have any urgent matters, please don't hesitate to contact us directly.</p>
                            <p>Best regards,<br>The Project MUN Team</p>
                        </div>
                        <div class='footer'>
                            <p>&copy; " . date('Y') . " Project MUN. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";
            
            $autoReply->Body = $autoReplyBody;
            $autoReply->AltBody = "
                Thank You for Contacting Us!\n\n
                Dear $name,\n\n
                Thank you for reaching out to Project MUN. We have received your message regarding: $subject\n\n
                Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.\n\n
                If you have any urgent matters, please don't hesitate to contact us directly.\n\n
                Best regards,\n
                The Project MUN Team\n\n
                ---
                © " . date('Y') . " Project MUN. All rights reserved.
            ";
            
            $autoReply->send();
            return ['success' => true, 'message' => 'Auto-reply sent successfully'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Auto-reply could not be sent. Error: ' . $autoReply->ErrorInfo];
        }
    }
}

// Return config for backward compatibility
return $config;
