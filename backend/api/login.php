<?php

header("Content-Type: application/json");

session_start();

require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? "";
$password = $data["password"] ?? "";

try {

    $sql = "SELECT * FROM users WHERE username = :username LIMIT 1";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":username" => $username
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {

        if ($password === $user["password"]) {

            $_SESSION["user"] = $user["username"];

            echo json_encode([
                "user" => true,
                "username" => $user["username"]
            ]);

        } else {

            echo json_encode([
                "user" => false,
                "message" => "Password errada"
            ]);
        }

    } else {

        echo json_encode([
            "user" => false,
            "message" => "Utilizador não encontrado"
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        "error" => $e->getMessage()
    ]);
}