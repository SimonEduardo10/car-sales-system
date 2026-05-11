<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

require_once __DIR__ . "/../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "user" => false,
        "message" => "Dados inválidos"
    ]);
    exit;
}

$username = $data["username"] ?? "";
$password = $data["password"] ?? "";

try {

    $sql = "SELECT * FROM users WHERE username = :username LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":username" => $username]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $password === $user["password"]) {

        $_SESSION["user"] = $user["username"];

        echo json_encode([
            "user" => true,
            "username" => $user["username"]
        ]);

    } else {

        echo json_encode([
            "user" => false,
            "message" => "Credenciais inválidas"
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        "user" => false,
        "message" => "Erro servidor",
        "error" => $e->getMessage()
    ]);
}