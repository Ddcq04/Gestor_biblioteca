<?php
//Constantes para la conexion a la base de datos
define("SERVER_DB","localhost");
define("DATABASE","gestion_biblioteca");
define("DB_USER", "root");
define("DB_PASSWD", "");

include_once "dat/Socio.php";
include_once "dat/Libro.php";
class AccesoDatos {
    
    private static $modelo = null;
    private $dbh = null;
    private $stmt_creaSocio = null;
    private $stmt_creaLibro = null;
    private $stmt_creaPrestamo = null;
    private $stmt_modSocio  = null;
    private $stmt_modPrestamo  = null;
    private $stmt_socio  = null;
    private $stmt_libro  = null;
    private $stmt_libros  = null;
    private $stmt_libroDisponible  = null;
    private $stmt_prestamosDevueltos = null;
    private $stmt_prestamosVencidos  = null;
    private $stmt_prestamosNoVencidos  = null;
    private $stmt_devoluciones  = null;
    

    public static function getModelo(){
        if (self::$modelo == null){
            self::$modelo = new AccesoDatos();
        }
        return self::$modelo;
    }
   // Constructor privado
    private function __construct(){
        try {
            $dsn = "mysql:host=".SERVER_DB.";dbname=".DATABASE.";charset=utf8";
            $this->dbh = new PDO($dsn,DB_USER,DB_PASSWD);
            $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->dbh->setAttribute( PDO::ATTR_EMULATE_PREPARES, FALSE );
        } catch (PDOException $e){
            echo "Error de conexión ".$e->getMessage();
            exit();
        }
        // Construccion de las consultas 
        $this->dbh->setAttribute( PDO::ATTR_EMULATE_PREPARES, FALSE );
        try {
        $this->stmt_creaSocio  = $this->dbh->prepare("insert into socio (nombre,contrasena,correo) values(?,?,?)");
        $this->stmt_creaLibro = $this->dbh->prepare("insert into libro(nombre,genero,stock) values(?,?,?)");
        $this->stmt_creaPrestamo = $this->dbh->prepare("insert into prestamo (socio_id,libro_id,fecha_prestamo,fecha_vencimiento) values (:socio_id,:libro_id,:f_prestamo,:f_vencimiento)");
        $this->stmt_modSocio   = $this->dbh->prepare("update socio set nombre=:nombre, contrasena=:contrasena, correo=:correo where id=:id_socio");
        $this->stmt_modPrestamo = $this->dbh->prepare("update prestamo set fecha_devolucion =:f_devolucion where socio_id =:socio_id and libro_id =:libro_id and fecha_devolucion is null");
        $this->stmt_socio  = $this->dbh->prepare("select * from socio where id =:id");
        $this->stmt_libro  = $this->dbh->prepare("select * from libro where id =:id");
        $this->stmt_libros = $this->dbh->prepare("select * from libro where genero =:genero");
        $this->stmt_libroDisponible = $this->dbh->prepare("select * from libro where id =:id_libro and stock > 0");
        $this->stmt_prestamosDevueltos = $this->dbh->prepare("select * from prestamo where socio_id =:socio_id and fecha_devolucion is not null");
        $this->stmt_prestamosVencidos = $this->dbh->prepare("select * from prestamo where fecha_vencimiento < now() and fecha_devolucion is null");
        $this->stmt_prestamosNoVencidos = $this->dbh->prepare("select * from prestamo where fecha_vencimiento >= now() and fecha_devolucion is null");
        $this->stmt_devoluciones = $this->dbh->prepare("select * from prestamo where fecha_devolucion is not null");
        } catch ( PDOException $e){
            echo " Error al crear la sentencias ".$e->getMessage();
            exit();
        }
    
    }

    // Cierro la conexión anulando todos los objectos relacioanado con la conexión PDO (stmt)
    public static function closeModelo(){
        if (self::$modelo != null){
            $obj = self::$modelo;
            $obj->stmt_creaSocio = null;
            $obj->stmt_creaLibro = null;
            $obj->stmt_creaPrestamo = null;
            $obj->stmt_modSocio  = null;
            $obj->stmt_modPrestamo  = null;
            $obj->stmt_socio  = null;
            $obj->stmt_libros  = null;
            $obj->stmt_libroDisponible  = null;
            $obj->stmt_prestamosDevueltos = null;
            $obj->stmt_prestamosVencidos  = null;
            $obj->stmt_prestamosNoVencidos  = null;
            $obj->stmt_devoluciones  = null;
            self::$modelo = null; // Borro el objeto.
        }
    }

    //Dar de alta a un Socio
    public function addUsuario($socio):bool{
        $this->stmt_creaSocio->execute( [$socio->nombre, $socio->password, $socio->correo]);
        $resu = ($this->stmt_creaSocio->rowCount () == 1);
        return $resu;
    }

    //Dar de alta un libro
    public function addLibro($libro):bool{
        $this->stmt_creaLibro->execute( [$libro->nombre, $libro->genero, $libro->stock]);
        $resu = ($this->stmt_creaLibro->rowCount () == 1);
        return $resu;
    }
    
    //Registro del prestamo 
    public function addPrestamo($socio_id,$libro_id,$f_prestamo,$f_vencimiento):bool{
        $this->stmt_creaPrestamo->bindValue(":socio_id",$socio_id);
        $this->stmt_creaPrestamo->bindValue(":libro_id",$libro_id);
        $this->stmt_creaPrestamo->bindValue(":f_prestamo",$f_prestamo);
        $this->stmt_creaPrestamo->bindValue(":f_vencimiento",$f_vencimiento);
        $this->stmt_creaPrestamo->execute();
        $resu = ($this->stmt_creaPrestamo->rowCount () == 1);
        return $resu;
    }

     //Modificar los datos de un Socio
    public function modSocio($socio):bool{
        $this->stmt_modSocio->bindValue(':id',$socio->id);
        $this->stmt_modSocio->bindValue(':nombre',$socio->nombre);
        $this->stmt_modSocio->bindValue(':password',$socio->password);
        $this->stmt_modSocio->bindValue(':contrasena',$socio->correo);
        $this->stmt_modSocio->execute();
        $resu = ($this->stmt_modSocio->rowCount () == 1);
        return $resu;
    }

    //Modificar prestamo que el socio ha devuelto el libro
    public function modPrestamo($socio,$libro,$f_devolucion):bool{
        $this->stmt_modPrestamo->bindValue(':socio_id',$socio->id);
        $this->stmt_modPrestamo->bindValue(':libro_id',$libro->id);
        $this->stmt_modPrestamo->bindValue(':f_devolucion',$f_devolucion);
        $this->stmt_modPrestamo->execute();
        $resu = ($this->stmt_modPrestamo->rowCount () == 1);
        return $resu;
    }

    //Devuelvo un socio o false
    public function getSocio($socio_id) {
        $user = false;
        $this->stmt_socio->setFetchMode(PDO::FETCH_CLASS, 'Socio');
        $this->stmt_socio->bindParam(':id',$socio_id);
        if ( $this->stmt_socio->execute() ){
             if ( $obj = $this->stmt_socio->fetch()){
                $user= $obj;
            }
        }
        return $user;
    }

    //Devuelvo un libro o false
    public function getLibro($libro_id) {
        $libro = false;
        $this->stmt_libro->setFetchMode(PDO::FETCH_CLASS, 'Libro');
        $this->stmt_libro->bindParam(':id',$libro_id);
        if ( $this->stmt_libro->execute() ){
             if ( $obj = $this->stmt_libro->fetch()){
                $libro= $obj;
            }
        }
        return $libro;
    }

    //Devuelvo la lista de libro segun el genero
    public function getLibros($genero):array {
        $tlibros = [];
        $this->stmt_libros->setFetchMode(PDO::FETCH_CLASS, 'Libro');
        $this->stmt_libros->bindParam(':genero',$genero);
        if ( $this->stmt_libros->execute() ){
            while ( $libro = $this->stmt_libros->fetch()){
               $tlibros[]= $libro;
            }
        }
        return $tlibros;
    }

    //Si hay stock disponible de un libro
    public function getLibroDisponible($libro_id) {
        $libroDisponible = false;
        $this->stmt_libroDisponible->setFetchMode(PDO::FETCH_CLASS, 'Libro');
        $this->stmt_libroDisponible->bindParam(":id_libro", $libro_id);
        if ( $this->stmt_libroDisponible->execute() ){
           if ( $obj = $this->stmt_libroDisponible->fetch()){
                $libroDisponible= $obj;
            }
        }
        return $libroDisponible;
    }

    //Prestamos devueltos de un socio
    public function getPrestamoSocio($socio) {
        $tprestamosDevueltos = [];
        $this->stmt_prestamosDevueltos->bindParam("socio_id", $socio->id);
        $this->stmt_prestamosDevueltos->setFetchMode(PDO::FETCH_CLASS, 'Prestamo');
        if ( $this->stmt_prestamosDevueltos->execute() ){
            while ( $prestamo = $this->stmt_prestamosDevueltos->fetch()){
               $tprestamosDevueltos[]= $prestamo;
            }
        }
        return $tprestamosDevueltos;
    }

    //Prestamos vencidos
    public function getVencidos() {
        $tvencidos = [];
        $this->stmt_prestamosVencidos->setFetchMode(PDO::FETCH_CLASS, 'Prestamo');
        if ( $this->stmt_prestamosVencidos->execute() ){
            while ( $prestamo = $this->stmt_prestamosVencidos->fetch()){
               $tvencidos[]= $prestamo;
            }
        }
        return $tvencidos;
    }

    //Prestamos no vencidos
    public function getnoVencidos() {
        $tnoVencidos = [];
        $this->stmt_prestamosNoVencidos->setFetchMode(PDO::FETCH_CLASS, 'Prestamo');
        if ( $this->stmt_prestamosNoVencidos->execute() ){
            while ( $prestamo = $this->stmt_prestamosNoVencidos->fetch()){
               $tnoVencidos[]= $prestamo;
            }
        }
        return $tnoVencidos;
    }

    //Registro de devolucion
    public function getDevoluciones() {
        $tdevoluciones = [];
        $this->stmt_devoluciones->setFetchMode(PDO::FETCH_CLASS, 'Prestamo');
        if ( $this->stmt_devoluciones->execute() ){
            while ( $prestamo = $this->stmt_devoluciones->fetch()){
               $tdevoluciones[]= $prestamo;
            }
        }
        return $tdevoluciones;
    }
     // Evito que se pueda clonar el objeto. (SINGLETON)
    public function __clone(){ 
        trigger_error('La clonación no permitida', E_USER_ERROR); 
    }
}
?>