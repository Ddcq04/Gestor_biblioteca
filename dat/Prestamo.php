<?php
class Prestamo {
    private $id;
    private $socio_id;
    private $libro_id;
    private $fecha_prestamo;
    private $fecha_devolucion;
    private $fecha_vencimiento;

    function __get($name){
        if(property_exists($this,$name)){
            return $this->$name;
        }
    }

    function __set($name, $value){
        if(property_exists($this,$name)){
            $this->$name = $value;
        }
    }
}
?>