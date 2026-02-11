<?php 
/*
include_once "app/server.php";
include_once "app/config.php";
include_once "app/funciones.php";
$server = new Server;
$datosRequest = $server->serve();

$metodo = $datosRequest["metodo"]; //GET, POST, PUT O DELETE
$recurso = $datosRequest["recurso"];  // socios, libros o prestamos
$valor = $datosRequest["valor"]; // 1002

switch($metodo) {
        case 'GET':
            switch($recurso) {
                case "socios":
                    datosSocio($valor);
                    break;
                case "libros":
                    if(isset($_GET["genero"])){ //Si se envia el genero
                        librosPorGenero($_GET["genero"]);
                    }else libroDisponible($valor);
                    break;
                case "prestamos":
                    if(isset($_GET["socio_id"])){
                        prestamosSocio($valor);
                    }elseif($valor == "vencidos"){
                        prestamosVencidos();
                    }elseif($valor == "noVencidos"){
                        prestamosnoVencidos();
                    }else devoluciones();
                    break;
            }
            break;
                
        case 'POST':
            $json = file_get_contents('php://input');
            $datos = json_decode($json);

            switch($recurso) {
                case "socios":
                    altaSocio($datos);
                    break;
                case "libros":
                    altaLibro($datos);
                    break;
                case "prestamos":
                    registroPrestamo($datos->socio_id, $datos->libro_id);
                    break;
            }
            break;
                
        case 'PUT':
            $json = file_get_contents('php://input');
            $datosNuevos = json_decode($json);
            switch($recurso) {
                case "socios":
                    modificarSocio($valor,$datosNuevos);
                    break;
                case "prestamos":
                    libroDevuelto($valor,$datosNuevos->libro_id);
                    break;
            }
            break;    
        default:
            header('HTTP/1.1 405 Method Not Allowed');
            header('Allow: GET, PUT, DELETE, POST');
            break;
}*
include_once "biblioteca.html";*/
?>