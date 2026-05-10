<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");

function protegerRota() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(["error" => "Não autorizado"]);
        exit;
    }
}