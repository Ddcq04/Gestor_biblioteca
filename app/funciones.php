<?php
//ACCIONES POST
function altaSocio($socio) {
    $db = AccesoDatos::getModelo();
    if ($db->addUsuario($socio)) {
        echo json_encode(["mensaje" => "Socio creado con éxito"]);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
    }
}

function altaLibro($libro) {
    $db = AccesoDatos::getModelo();
    if ($db->addUsuario($libro)) {
        echo json_encode(["mensaje" => "Socio creado con éxito"]);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
    }
}

function registroPrestamo($socio_id,$libro_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $libro = $db->getLibro($libro_id);
    $f_prestamo = date("Y-m-d H:i:s");
    $f_vencimiento = date("Y-m-d H:i:s", strtotime("+14 days")); //14 dias de vencimiento
    if($db->addPrestamo($socio->id, $libro->id, $f_prestamo, $f_vencimiento)) {
        echo json_encode(["status" => "Ok", "mensaje" => "Préstamo registrado"]);
    } else {
        echo json_encode(["status" => "Error"]);
    }
}


//ACCIONES GET
function datosSocio($id){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($id);
    if($socio) {
        echo json_encode($socio);
    }else header('HTTP/1.1 404 Not Found');
}

function librosPorGenero($genero){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $libros = $db->getLibros($genero);
    if($libros) {
        echo json_encode($libros);
    }else header('HTTP/1.1 404 Not Found');
}

function libroDisponible($libro_id) {
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $libro = $db->getLibro($libro_id);
    if($libro) {
        $libro_disponible = $db->getLibroDisponible($libro->id);
        if($libro_disponible) {
            echo json_encode($libro_disponible);
        }else header('HTTP/1.1 404 Not Found');
    }else header('HTTP/1.1 404 Not Found');
}

function prestamosSocio($socio_id) {
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $prestamosSocio = $db->getPrestamoSocio($socio); 
    if($prestamosSocio) {
        echo json_encode($prestamosSocio);
    }else header('HTTP/1.1 404 Not Found');
}

function prestamosVencidos(){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $prestamosVencidos = $db->getVencidos();
    if($prestamosVencidos) {
        echo json_encode($prestamosVencidos);
    }else header('HTTP/1.1 404 Not Found');
}

function prestamosnoVencidos(){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $prestamosnoVencidos = $db->getnoVencidos();
    if($prestamosnoVencidos) {
        echo json_encode($prestamosnoVencidos);
    }else header('HTTP/1.1 404 Not Found');
}

function devoluciones(){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $devoluciones = $db->getDevoluciones();
    if($devoluciones) {
        echo json_encode($devoluciones);
    }else header('HTTP/1.1 404 Not Found');
}


//ACCIONES PUT
function modificarSocio($socio_id,$datos_nuevos){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    if($socio){
        $socio->nombre = $datos_nuevos->nombre;
        $socio->correo = $datos_nuevos->correo;
        $socio->contrasena = $datos_nuevos->contrasena;
    }

    if ($db->modSocio($socio)) {
        echo json_encode(["mensaje" => "Actualizado"]);
    } else {
        echo json_encode(["mensaje" => "No hubo cambios o error"]);
    }
}

function libroDevuelto($socio_id,$libro_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $libro = $db->getLibro($libro_id);
    $f_devolucion = date("Y-m-d H:i:s");
    
    if(!$socio || !$libro) {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(["mensaje" => "Socio o Libro inexistente"]);
        return;
    }

    if($db->modPrestamo($socio, $libro, $f_devolucion)){
        echo json_encode(["mensaje" => "Devolución registrada"]);
    } else {
        echo json_encode(["mensaje" => "Error o no hay préstamo activo para este par"]);
    }
}
?>