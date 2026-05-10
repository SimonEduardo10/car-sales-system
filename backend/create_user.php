<?php
require_once "db.php";

$username = "admin";
$password = password_hash("1234", PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:u, :p)");
$stmt->execute([
    ":u" => $username,
    ":p" => $password
]);

echo "Utilizador criado com sucesso";