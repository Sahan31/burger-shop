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

// Data Capture
$full_name        = trim($_POST['name'] ?? '');
$phone            = trim($_POST['phone'] ?? '');
$email            = trim($_POST['email'] ?? '');
$guests           = trim($_POST['guests'] ?? '');
$res_date         = trim($_POST['date'] ?? '');
$res_time         = trim($_POST['time'] ?? '');
$special_requests = trim($_POST['special_requests'] ?? '');

// Validation
if (empty($full_name) || empty($phone) || empty($email) || empty($guests) || empty($res_date) || empty($res_time)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
    exit;
}

$parsedDate = DateTime::createFromFormat('Y-m-d', $res_date);
if (!$parsedDate || $parsedDate->format('Y-m-d') !== $res_date) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid reservation date format.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO `reservations` (`full_name`, `phone`, `email`, `guests`, `res_date`, `res_time`, `special_requests`, `status`)
        VALUES (:full_name, :phone, :email, :guests, :res_date, :res_time, :special_requests, 'Pending')
    ");
    
    $stmt->execute([
        ':full_name'        => $full_name,
        ':phone'            => $phone,
        ':email'            => $email,
        ':guests'           => $guests,
        ':res_date'         => $res_date,
        ':res_time'         => $res_time,
        ':special_requests' => $special_requests !== '' ? $special_requests : null
    ]);

    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your table reservation has been received. We will contact you shortly.'
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}