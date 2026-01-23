<?php
//ACCIONES POST
function altaSocio($socio) {
    $db = AccesoDatos::getModelo();
    $db->addUsuario($socio);
}

function altaLibro($libro) {
    $db = AccesoDatos::getModelo();
    $db->addUsuario($libro);
}

function registroPrestamo($login,$libro_nombre){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($login);
    $libro = $db->getLibro($libro_nombre);
    $f_prestamo = time();
    $f_vencimiento = $f_prestamo + 10; //10 seg de vencimiento
    $db->addPrestamo($socio->id,$libro->id,$f_prestamo,$f_vencimiento);
}


//ACCIONES GET
function datosSocio($login){
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($login);
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

function libroDisponible($libro_nombre) {
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $libro = $db->getLibro($libro_nombre);
    if($libro) {
        $libro_disponible = $db->getLibroDisponible($libro->id);
        if($libro_disponible) {
            echo json_encode($libro_disponible);
        }else header('HTTP/1.1 404 Not Found');
    }else header('HTTP/1.1 404 Not Found');
}

function prestamosSocio($login) {
    header('Content-type: application/json');
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($login);
    $prestamosSocio = $db->getPrestamoSocio($socio); 
    if($prestamosSocio) {
        echo json_encode($prestamosSocio);
    }else header('HTTP/1.1 404 Not Found');
}
?>