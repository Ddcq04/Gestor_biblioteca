<?php
include_once "app/config.php"; // Donde tienes AccesoDatos
include_once "app/funciones.php";

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"));
header('Content-Type: application/json');

switch($action) {
    case 'altaSocio': f_altaSocio($input); break;
    case 'modSocio':  f_modSocio($_GET['id'], $input); break;
    case 'altaLibro': f_altaLibro($input); break;
    case 'prestamo':  f_prestamo($input); break;
    // Consultas de búsqueda para que el bibliotecario no use IDs
    case 'buscarSocioNombre': f_buscarSocioNombre($_GET['nombre'] ?? ''); break;
    case 'buscarLibroNombre': f_buscarLibroNombre($_GET['nombre'] ?? ''); break;
    case 'getGeneros': echo json_encode(AccesoDatos::getModelo()->getGenerosDisponibles()); break;
    case 'devolver':  f_devolucion($input); break;
    case 'getSocio':  f_getSocio($_GET['id']); break;
    case 'porGenero': f_librosGenero($_GET['genero']); break;
    case 'checkStock': f_disponibilidad($_GET['id']); break;
    case 'vencidos':   f_vencidos(); break;
    case 'noVencidos': f_noVencidos(); break;
    case 'historial':  f_historialDev(); break;
}
?>