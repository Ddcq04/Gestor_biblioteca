<?php
// funciones.php

function responder($res, $msgExito = "Operación realizada", $msgError = "Error al procesar") {
    echo json_encode([
        "status" => (bool)$res,
        "mensaje" => $res ? $msgExito : $msgError,
        "datos" => is_bool($res) ? null : $res
    ]);
}

// NUEVAS: Búsquedas proactivas
function f_buscarSocioNombre($nombre) {
    $res = AccesoDatos::getModelo()->getSocioPorNombre($nombre);
    echo json_encode($res ?: ["error" => "No encontrado"]);
}

function f_buscarLibroNombre($nombre) {
    $res = AccesoDatos::getModelo()->getLibroPorNombre($nombre);
    echo json_encode($res ?: ["error" => "No encontrado"]);
}

// ACCIONES
function f_altaSocio($input) { responder(AccesoDatos::getModelo()->addUsuario($input), "Socio añadido"); }

function f_modSocio($id, $input) { 
    $input->id = $id; 
    responder(AccesoDatos::getModelo()->modSocio($input), "Socio actualizado correctamente"); 
}

function f_altaLibro($input) { responder(AccesoDatos::getModelo()->addLibro($input), "Libro registrado en inventario"); }

function f_prestamo($input) {
    $f_p = date("Y-m-d H:i:s");
    $f_v = date("Y-m-d", strtotime("+15 days"));
    responder(AccesoDatos::getModelo()->addPrestamo($input->socio_id, $input->libro_id, $f_p, $f_v), "Préstamo registrado");
}

function f_devolucion($input) {
    $s = new stdClass(); $s->id = $input->socio_id;
    $l = new stdClass(); $l->id = $input->libro_id;
    responder(AccesoDatos::getModelo()->modPrestamo($s, $l, date("Y-m-d H:i:s")), "Devolución completada");
}

// CONSULTAS
function f_getSocio($id) { echo json_encode(AccesoDatos::getModelo()->getSocio($id)); }
function f_librosGenero($g) { echo json_encode(AccesoDatos::getModelo()->getLibros($g)); }
function f_disponibilidad($id) { 
    $res = AccesoDatos::getModelo()->getLibroDisponible($id);
    responder($res, "Hay stock de este ejemplar", "Ejemplar no disponible o sin stock"); 
}
function f_vencidos() { 
    $res = AccesoDatos::getModelo()->getVencidos();
    echo json_encode($res ?: []); 
}

function f_noVencidos() { 
    $res = AccesoDatos::getModelo()->getnoVencidos();
    echo json_encode($res ?: []); 
}

function f_historialDev() { 
    $res = AccesoDatos::getModelo()->getDevoluciones();
    echo json_encode($res ?: []); 
}
?>