<?php
class Socio {
    public $id;
    public $nombre;
    public $telefono;
    public $correo;

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