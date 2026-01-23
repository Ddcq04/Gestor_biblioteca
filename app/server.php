<?php
class Server {
    
    private $db;
    
    private function paths($url) {
        $uri = parse_url($url);
        return $uri['path'];
    }
    
    public function serve() {
        $this->db = AccesoDatos::getModelo();
        $uri =    $_SERVER['REQUEST_URI'];
        $metodo = $_SERVER['REQUEST_METHOD'];
        
        // URL  http://servidor/camino/server.php/clientes/1002
        // Separa la URL en cadenas que esten separadas con /
        $paths = explode('/', $this->paths($uri));
        $resources = ["socios","libros","prestamo"];
        $consulta=[];
        $anotar=false;
        // Salto todos la URL hasta encontrar el recurso que sea socio,libro o prestamo
        foreach ( $paths as $value){
            if (in_array($value,$resources)){
                $anotar=true;
            }
            if ($anotar){
                $consulta[]=$value;
            }
        }
        
        $resource = array_shift($consulta);
        if ($resource == 'clientes') {
            $cod_cliente = array_shift($consulta);
            
            if (empty($cod_cliente)) {
                //URL clientes
                $this->procesar_base($metodo);
            }
        } else {
            header('HTTP/1.1 404 Not Found');
        }
    }
    
    private function procesar_base($metodo) {
        switch($metodo) {
            case 'GET':
                $this->get_clientes();
                break;
            default:
                header('HTTP/1.1 405 Method Not Allowed');
                header('Allow: GET');
                break;
        }
    }
    



    // METODOS INVOCADOS
     // GET
     private function get_uncliente($cod_cliente) {
        header('Content-type: application/json');
        if ($this->db->existeCliente($cod_cliente)) {
            echo json_encode($this->db->dameUnCliente($cod_cliente));
        } else {
            header('HTTP/1.1 404 Not Found');
        }
    }
    
    //GET
    private function get_clientes() {
        header('Content-type: application/json');
        $obj = $this->db->dameClientes();
        echo json_encode($obj);
    }
    
    // PUT
    private function post_cliente($cod){
        if ($this->db->existeCliente($cod)) {
            header('HTTP/1.1 409 Conflict');
            return;
        }
        /* PUT requests need to be handled
         * by reading from standard input.
         */
        $data = json_decode(file_get_contents('php://input'));
        if (is_null($data)) {
            header('HTTP/1.1 400 Bad Request');
            $this->get_clientes();
            return;
        }
        
        $nombre = $data->nombre;
        $clave  = $data->clave;
        $veces  = $data->veces;
        
        $this->db->nuevoCliente($cod,$nombre,$clave,$veces);
        $this->get_clientes();
    }
    
    // DELETE
    private function borrar_cliente($cod_cliente) {
        if ($this->db->existeCliente($cod_cliente)) {
            $this->db->borrarCliente($cod_cliente);
            $this->get_clientes();
        } else {
            header('HTTP/1.1 404 Not Found');
        }
    }
    
   
    // POST  
    private  function put_cliente($cod){
    
      if (! $this->db->existeCliente($cod)) {
        header('HTTP/1.1 404 Not Found');
        return;
        }
    /* PUT requests need to be handled
     * by reading from standard input.
     */
    $data = json_decode(file_get_contents('php://input'));
    if (is_null($data)) {
        header('HTTP/1.1 400 Bad Request');
        $this->get_clientes();
        return;
        }
    
    $valor = $data->valor;
    $this->db->incrementaVeces($cod,$valor);
    $this->get_clientes();
  }
} 
?>