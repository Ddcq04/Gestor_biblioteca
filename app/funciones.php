<?php
include_once "server.php"; // tu clase modelo
include_once "dat/Prestamo.php";
include_once  "dat/Socio.php";
include_once  "dat/Libro.php";

// === ACCIONES POST ===
function altaSocio($socio) {
    $db = AccesoDatos::getModelo();
    $exito = $db->addUsuario($socio);

    header('Content-Type: application/json');
    echo json_encode([
        "mensaje" => $exito ? "Socio creado con éxito" : "Error al crear socio"
    ]);
    exit;
}

function altaLibro($libro) {
    $db = AccesoDatos::getModelo();
    $exito = $db->addLibro($libro);

    header('Content-Type: application/json');
    echo json_encode([
        "mensaje" => $exito ? "Libro creado con éxito" : "Error al crear libro"
    ]);
    exit;
}

function libroDevuelto($socio_id, $libro_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $libro = $db->getLibro($libro_id);
    $f_devolucion = date("Y-m-d H:i:s");

    header('Content-Type: application/json');

    if (!$socio || !$libro) {
        echo json_encode(["mensaje" => "Socio o Libro inexistente"]);
        exit;
    }

    $exito = $db->modPrestamo($socio, $libro, $f_devolucion);
    echo json_encode(["mensaje" => $exito ? "Devolución registrada" : "Error o no hay préstamo activo"]);
    exit;
}

// === ACCIONES GET ===
function prestamosSocio($socio_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $prestamos = $db->getPrestamoSocio($socio);

    header('Content-Type: application/json');
    echo json_encode($prestamos ?? []);
    exit;
}

function prestamosVencidos(){
    $db = AccesoDatos::getModelo();
    $prestamos = $db->getVencidos();

    header('Content-Type: application/json');
    echo json_encode($prestamos ?? []);
    exit;
}

function prestamosnoVencidos(){
    $db = AccesoDatos::getModelo();
    $prestamos = $db->getnoVencidos();

    header('Content-Type: application/json');
    echo json_encode($prestamos ?? []);
    exit;
}

// === DISPATCHER ===
$action = $_GET['action'] ?? '';
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
        header('Content-Type: application/json');
        echo json_encode(["mensaje" => "Acción no encontrada"]);
        exit;
}