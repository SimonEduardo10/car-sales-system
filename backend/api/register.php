<?php

require_once "../db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

$nome = $data->nome;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO users (nome, email, password)
VALUES (:nome, :email, :password)");

$stmt->execute([
    ":nome" => $nome,
    ":email" => $email,
    ":password" => $password
]);

echo json_encode(["message" => "Utilizador criado com sucesso"]);