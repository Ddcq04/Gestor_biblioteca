<?php
class Prestamo {
    public $id;
    public $socio_id;
    public $libro_id;
    public $fecha_prestamo;
    public $fecha_devolucion;
    public $fecha_vencimiento;

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