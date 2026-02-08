<?php
include_once "config.php";
include_once "funciones.php";
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);
header('Content-Type: application/json');
// Capturamos la acción del query string
$action = $_GET['action'] ?? '';
// Si viene POST, leemos el JSON
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
        $db = AccesoDatos::getModelo();
        $socio = $db->getSocio($socio_id);
        header('Content-Type: application/json');
        echo json_encode($db->getPrestamoSocio($socio));
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
        echo json_encode(["mensaje"=>"No encontrado"]);
        break;
}