<?php
header('Content-Type: application/json; charset=utf-8');

if (!file_exists(__DIR__ . '/db.php')) {
    echo json_encode(['status' => 'error', 'message' => 'db.php not found']);
    exit;
}
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$full_name = trim($_POST['name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = trim($_POST['phone'] ?? '');
$subject   = trim($_POST['subject'] ?? '');
$message   = trim($_POST['message'] ?? '');

// Validation
if (empty($full_name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO `contacts` (`full_name`, `email`, `phone`, `subject`, `message`, `status`)
        VALUES (:full_name, :email, :phone, :subject, :message, 'Unread')
    ");

    $stmt->execute([
        ':full_name' => $full_name,
        ':email'     => $email,
        ':phone'     => $phone,
        ':subject'   => $subject,
        ':message'   => $message
    ]);

    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your message has been sent successfully. We will get back to you shortly.'
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}