<?php
include_once "config.php";
include_once "../dat/Socio.php";
include_once "../dat/Libro.php";
include_once "../dat/Prestamo.php";
include_once "AccesoDatos.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'));
$modelo = AccesoDatos::getModelo();

function json_response($status, $mensaje){
    echo json_encode(['status'=>$status, 'mensaje'=>$mensaje]);
    exit;
}

try {
    switch($action){
        // ==== SOCIOS ====
        case 'altaSocio':
            if(!$input) json_response(false, 'Datos inválidos');
            $s = new Socio();
            $s->nombre = $input->nombre;
            $s->telefono = $input->telefono;
            $s->correo = $input->correo;
            $result = $modelo->addSocio($s);
            json_response($result, $result ? 'Socio creado correctamente' : 'Error al crear socio');
            break;

        case 'modSocio':
            if(!isset($_GET['id']) || !$input) json_response(false, 'ID o datos inválidos');
            $s = new Socio();
            $s->id = $_GET['id'];
            $s->nombre = $input->nombre;
            $s->telefono = $input->telefono;
            $s->correo = $input->correo;
            $result = $modelo->modSocio($s);
            json_response($result, $result ? 'Socio modificado correctamente' : 'No se pudo modificar el socio');
            break;

        case 'buscarSocioNombre':
            $nombre = $_GET['nombre'] ?? '';
            $socio = $modelo->getSocioPorNombre($nombre);
            echo json_encode($socio);
            break;

        case 'getSocio':
            $id = $_GET['id'] ?? 0;
            $socio = $modelo->getSocio($id);
            echo json_encode($socio);
            break;

        // ==== LIBROS ====
        case 'altaLibro':
            if(!$input) json_response(false, 'Datos inválidos');
            $l = new Libro();
            $l->nombre = $input->nombre;
            $l->genero = $input->genero;
            $l->stock = $input->stock;
            $result = $modelo->addLibro($l);
            json_response($result, $result ? 'Libro agregado correctamente' : 'Error al agregar libro');
            break;

        case 'getLibros':
            $genero = $_GET['genero'] ?? '';
            $libros = $modelo->getLibros($genero);
            echo json_encode($libros);
            break;

        case 'getGeneros':
            $generos = $modelo->getGenerosDisponibles();
            echo json_encode($generos);
            break;

        case 'buscarLibroNombre':
            $nombre = $_GET['nombre'] ?? '';
            $libro = $modelo->getLibroPorNombre($nombre);
            echo json_encode($libro);
            break;

        case 'getLibro':
            $id = $_GET['id'] ?? 0;
            $libro = $modelo->getLibro($id);
            echo json_encode($libro);
            break;

        // ==== PRÉSTAMOS ====
        case 'prestamo':
            if(!$input) json_response(false, 'Datos inválidos');
            $fecha_hoy = date('Y-m-d H:i:s');
            $fecha_venc = date('Y-m-d H:i:s', strtotime('+14 days'));
            $result = $modelo->addPrestamo($input->socio_id, $input->libro_id, $fecha_hoy, $fecha_venc);
            json_response($result, $result ? 'Préstamo registrado correctamente' : 'No se pudo registrar el préstamo (stock insuficiente o datos incorrectos)');
            break;

        case 'devolver':
            if(!isset($_GET['id'])) json_response(false, 'ID de préstamo no especificado');
            $result = $modelo->devolverLibro($_GET['id']);
            json_response($result, $result ? 'Devolución registrada correctamente' : 'Error al registrar devolución');
            break;

        case 'vencidos':
            echo json_encode($modelo->getVencidos());
            break;

        case 'noVencidos':
            echo json_encode($modelo->getNoVencidos());
            break;

        case 'prestamosActivos':
            echo json_encode($modelo->getPrestamosActivos());
            break;

        case 'historial':
            echo json_encode($modelo->getDevoluciones());
            break;

        default:
            echo json_encode(['error' => 'Acción no válida: ' . $action]);
            break;
    }
} catch(Exception $e) {
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>