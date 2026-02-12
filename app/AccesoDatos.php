<?php
include_once "../dat/Socio.php";
include_once "../dat/Libro.php";
include_once "../dat/Prestamo.php";
include_once "config.php";

class AccesoDatos {
    private static $modelo = null;
    private $dbh;

    private function __construct(){
        try {
            $dsn = "mysql:host=".SERVER_DB.";dbname=".DATABASE.";charset=utf8";
            $this->dbh = new PDO($dsn, DB_USER, DB_PASSWD, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
        } catch(PDOException $e){
            echo "Error conexión: ".$e->getMessage();
            exit();
        }
    }

    public static function getModelo(){
        if(self::$modelo===null) self::$modelo = new AccesoDatos();
        return self::$modelo;
    }

    // ============= SOCIOS =============
    public function addSocio($s){
        $stmt = $this->dbh->prepare("INSERT INTO socio(nombre,telefono,correo) VALUES(?,?,?)");
        return $stmt->execute([$s->nombre,$s->telefono,$s->correo]);
    }

    public function modSocio($s){
        $stmt = $this->dbh->prepare("UPDATE socio SET nombre=?, telefono=?, correo=? WHERE id=?");
        $stmt->execute([$s->nombre,$s->telefono,$s->correo,$s->id]);
        return $stmt->rowCount()===1;
    }

    public function getSocio($id){
        $stmt = $this->dbh->prepare("SELECT * FROM socio WHERE id=?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getSocioPorNombre($nombre){
        $stmt = $this->dbh->prepare("SELECT * FROM socio WHERE nombre LIKE ? LIMIT 1");
        $stmt->execute(["%$nombre%"]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ============= LIBROS =============
    public function addLibro($l){
        $stmt = $this->dbh->prepare("INSERT INTO libro(nombre,genero,stock) VALUES(?,?,?)");
        return $stmt->execute([$l->nombre,$l->genero,$l->stock]);
    }

    public function getLibros($genero = null){
        if($genero && $genero !== ''){
            $stmt = $this->dbh->prepare("SELECT * FROM libro WHERE genero=?");
            $stmt->execute([$genero]);
        } else {
            $stmt = $this->dbh->query("SELECT * FROM libro");
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGenerosDisponibles(){
        $stmt = $this->dbh->query("SELECT DISTINCT genero FROM libro ORDER BY genero");
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getLibroPorNombre($nombre){
        $stmt = $this->dbh->prepare("SELECT * FROM libro WHERE nombre LIKE ? LIMIT 1");
        $stmt->execute(["%$nombre%"]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getLibro($id){
        $stmt = $this->dbh->prepare("SELECT * FROM libro WHERE id=?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getLibroDisponible($id){
        $stmt = $this->dbh->prepare("SELECT * FROM libro WHERE id=? AND stock>0");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ============= PRÉSTAMOS =============
    public function addPrestamo($socio_id, $libro_id, $fecha_prestamo, $fecha_vencimiento){
        $libro = $this->getLibroDisponible($libro_id);
        if(!$libro) return false;
        
        try {
            $this->dbh->beginTransaction();
            
            $stmt1 = $this->dbh->prepare("UPDATE libro SET stock = stock - 1 WHERE id=? AND stock>0");
            $stmt1->execute([$libro_id]);
            
            if($stmt1->rowCount() === 0){
                $this->dbh->rollBack();
                return false;
            }
            
            $stmt2 = $this->dbh->prepare("INSERT INTO prestamo(socio_id, libro_id, fecha_prestamo, fecha_vencimiento) VALUES(?,?,?,?)");
            $stmt2->execute([$socio_id, $libro_id, $fecha_prestamo, $fecha_vencimiento]);
            
            $this->dbh->commit();
            return true;
        } catch(Exception $e){
            $this->dbh->rollBack();
            return false;
        }
    }

    public function devolverLibro($prestamo_id){
        try {
            $this->dbh->beginTransaction();
            
            $stmt = $this->dbh->prepare("SELECT * FROM prestamo WHERE id=? AND fecha_devolucion IS NULL");
            $stmt->execute([$prestamo_id]);
            $prestamo = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(!$prestamo){
                $this->dbh->rollBack();
                return false;
            }
            
            $stmt1 = $this->dbh->prepare("UPDATE prestamo SET fecha_devolucion=NOW() WHERE id=?");
            $stmt1->execute([$prestamo_id]);
            
            $stmt2 = $this->dbh->prepare("UPDATE libro SET stock = stock + 1 WHERE id=?");
            $stmt2->execute([$prestamo['libro_id']]);
            
            $this->dbh->commit();
            return true;
        } catch(Exception $e){
            $this->dbh->rollBack();
            return false;
        }
    }

    public function getVencidos(){
        $stmt = $this->dbh->query("SELECT p.*, s.nombre as socio_nombre, l.nombre as libro_nombre 
                                   FROM prestamo p 
                                   JOIN socio s ON p.socio_id = s.id 
                                   JOIN libro l ON p.libro_id = l.id 
                                   WHERE p.fecha_vencimiento < NOW() AND p.fecha_devolucion IS NULL");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNoVencidos(){
        $stmt = $this->dbh->query("SELECT p.*, s.nombre as socio_nombre, l.nombre as libro_nombre 
                                   FROM prestamo p 
                                   JOIN socio s ON p.socio_id = s.id 
                                   JOIN libro l ON p.libro_id = l.id 
                                   WHERE p.fecha_vencimiento >= NOW() AND p.fecha_devolucion IS NULL");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPrestamosActivos(){
        $stmt = $this->dbh->query("SELECT p.*, s.nombre as socio_nombre, l.nombre as libro_nombre 
                                   FROM prestamo p 
                                   JOIN socio s ON p.socio_id = s.id 
                                   JOIN libro l ON p.libro_id = l.id 
                                   WHERE p.fecha_devolucion IS NULL");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDevoluciones(){
        $stmt = $this->dbh->query("SELECT p.*, s.nombre as socio_nombre, l.nombre as libro_nombre 
                                   FROM prestamo p 
                                   JOIN socio s ON p.socio_id = s.id 
                                   JOIN libro l ON p.libro_id = l.id 
                                   WHERE p.fecha_devolucion IS NOT NULL 
                                   ORDER BY p.fecha_devolucion DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>