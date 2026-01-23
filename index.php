<?php 
include_once "app/server.php";
include_once "app/config.php";
include_once "app/funciones.php";
$server = new Server;
$server->serve();

switch($accion) {
        case 'POST':
            switch($recurso) {
                case "usuario":

                    break;
                case "libro":
                    break;
                case "prestamo":
                    break;
            }
            break;
                
        case 'GET':
            $this->borrar_cliente($cod_cliente);
            break;
                
        case 'PUT':
            $this->get_uncliente($cod_cliente);
            break;
                
        case 'DELETE':
            $this->post_cliente($cod_cliente);
            break;
                
        default:
            header('HTTP/1.1 405 Method Not Allowed');
            header('Allow: GET, PUT, DELETE, POST');
            break;
}
?>