<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");

/* =========================
   CORS (DEV + FUTURO DEPLOY)
========================= */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

/* Pré-flight */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../db.php";

/* =========================
   PROTEÇÃO DE ROTA
========================= */
function protegerRota() {

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['user'])) {

        http_response_code(401);

        echo json_encode([
            "error" => "Não autorizado"
        ]);

        exit;
    }
}

/* =========================
   LISTAR (PÚBLICO)
========================= */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = $pdo->query("SELECT * FROM carros");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* =========================
   CREATE (PROTEGIDO)
========================= */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {

    protegerRota();

    $data = json_decode(file_get_contents("php://input"));

    $stmt = $pdo->prepare("
        INSERT INTO carros (marca, modelo, ano, preco, imagem)
        VALUES (:marca, :modelo, :ano, :preco, :imagem)
    ");

    $stmt->execute([
        ":marca" => $data->marca ?? '',
        ":modelo" => $data->modelo ?? '',
        ":ano" => $data->ano ?? 0,
        ":preco" => $data->preco ?? 0,
        ":imagem" => $data->imagem ?? ''
    ]);

    echo json_encode([
        "message" => "Carro adicionado com sucesso"
    ]);

    exit;
}

/* =========================
   UPDATE (PROTEGIDO)
========================= */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update') {

    protegerRota();

    $data = json_decode(file_get_contents("php://input"));

    $stmt = $pdo->prepare("
        UPDATE carros 
        SET marca=:marca, modelo=:modelo, ano=:ano, preco=:preco, imagem=:imagem
        WHERE id=:id
    ");

    $stmt->execute([
        ":id" => $data->id,
        ":marca" => $data->marca,
        ":modelo" => $data->modelo,
        ":ano" => $data->ano,
        ":preco" => $data->preco,
        ":imagem" => $data->imagem
    ]);

    echo json_encode([
        "message" => "Carro atualizado"
    ]);

    exit;
}

/* =========================
   DELETE (PROTEGIDO)
========================= */
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    protegerRota();

    $data = json_decode(file_get_contents("php://input"));

    $stmt = $pdo->prepare("
        DELETE FROM carros WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $data->id
    ]);

    echo json_encode([
        "message" => "Carro eliminado"
    ]);

    exit;
}