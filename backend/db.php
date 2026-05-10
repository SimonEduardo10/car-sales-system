<?php

$host = getenv("DB_HOST");
$dbname = getenv("DB_NAME");
$username = getenv("DB_USER");
$password = getenv("DB_PASSWORD");

if (!$host || !$dbname || !$username || !$password) {
    die("ERRO: Variáveis de ambiente não configuradas no Render.");
}

try {
    $pdo = new PDO(
        "pgsql:host=$host;port=5432;dbname=$dbname",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

} catch (Exception $e) {
    die("Erro na conexão: " . $e->getMessage());
}