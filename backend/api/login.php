<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once "../db.php";

header("Content-Type: application/json");

/* ✅ CORS CORRETO */
header("Access-Control-Allow-Origin: http://localhost:8000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

/* Pré-flight */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* Ler JSON */
$data = json_decode(file_get_contents("php://input"));

/* Validação */
if (!isset($data->username) || !isset($data->password)) {

    echo json_encode([
        "error" => "Dados inválidos"
    ]);

    exit;
}

/* Buscar utilizador */
$stmt = $pdo->prepare("
    SELECT * FROM users
    WHERE username = :username
");

$stmt->execute([
    ":username" => $data->username
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

/* Validar password */
if (!$user || !password_verify($data->password, $user['password'])) {

    http_response_code(401);

    echo json_encode([
        "error" => "Credenciais inválidas"
    ]);

    exit;
}

/* Criar sessão */
$_SESSION['user'] = [
    "id" => $user["id"],
    "username" => $user["username"]
];

/* Resposta */
echo json_encode([
    "message" => "Login bem-sucedido",
    "user" => $_SESSION['user']
]);