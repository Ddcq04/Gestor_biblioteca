<?php
include_once "dat/Prestamo.php";
include_once "dat/Socio.php";
include_once "dat/Libro.php";

function altaSocio($socio) {
    $db = AccesoDatos::getModelo();
    // En tu AccesoDatos, el objeto usa ->password, asegúrate que coincida
    $exito = $db->addUsuario($socio);
    echo json_encode(["mensaje" => $exito ? "Socio creado con éxito" : "Error al crear socio"]);
    exit;
}

function altaLibro($libro) {
    $db = AccesoDatos::getModelo();
    $exito = $db->addLibro($libro);
    echo json_encode(["mensaje" => $exito ? "Libro creado con éxito" : "Error al crear libro"]);
    exit;
}

function libroDevuelto($socio_id, $libro_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $libro = $db->getLibro($libro_id);
    $f_devolucion = date("Y-m-d H:i:s");

    if (!$socio || !$libro) {
        echo json_encode(["mensaje" => "Socio o Libro inexistente"]);
        exit;
    }

    $exito = $db->modPrestamo($socio, $libro, $f_devolucion);
    echo json_encode(["mensaje" => $exito ? "Devolución registrada" : "No hay préstamo activo"]);
    exit;
}

function prestamosSocio($socio_id){
    $db = AccesoDatos::getModelo();
    $socio = $db->getSocio($socio_id);
    $prestamos = $db->getPrestamoSocio($socio);
    echo json_encode($prestamos ?: []);
    exit;
}

function prestamosVencidos(){
    $db = AccesoDatos::getModelo();
    echo json_encode($db->getVencidos() ?: []);
    exit;
}

function prestamosnoVencidos(){
    $db = AccesoDatos::getModelo();
    echo json_encode($db->getnoVencidos() ?: []);
    exit;
}