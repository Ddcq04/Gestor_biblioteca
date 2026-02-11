<?php
// server.php
include_once "app/config.php";
include_once "app/funciones.php";

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Capturamos la acción
$action = $_GET['action'] ?? '';

// Leemos el JSON del cuerpo (para POST y PUT)
$input = json_decode(file_get_contents("php://input"));

switch($action){
    case 'altaSocio': 
        altaSocio($input); 
        break;

    case 'altaLibro': 
        altaLibro($input); 
        break;

    case 'prestamosSocio': 
        $socio_id = $_GET['socio_id'] ?? 1; 
        prestamosSocio($socio_id);
        break;

    case 'prestamosVencidos': 
        prestamosVencidos(); 
        break;

    case 'prestamosnoVencidos': 
        prestamosnoVencidos(); 
        break;

    case 'libroDevuelto': 
        $socio_id = $_GET['socio_id'] ?? null;
        $libro_id = $_GET['libro_id'] ?? null;
        libroDevuelto($socio_id, $libro_id); 
        break;

    default: 
        http_response_code(404);
        echo json_encode(["mensaje" => "Acción '$action' no encontrada"]);
        break;
}