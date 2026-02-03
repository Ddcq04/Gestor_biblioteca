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
        $recursos = ["socios","libros","prestamos"];
        $consulta=[];
        $anotar=false;
        // Salto todos la URL hasta encontrar el recurso que sea socio,libro o prestamo
        foreach ( $paths as $valor){
            if (in_array($valor,$recursos)){
                $anotar=true;
            }
            if ($anotar){
                $consulta[]=$valor;
            }
        }
        // Extraemos los datos
        $recurso = array_shift($consulta);   // Ejemplo: "socios"
        $valor   = array_shift($consulta);   // Ejemplo: "1002" o null
        return [
            'metodo'  => $metodo,
            'recurso' => $recurso,
            'valor'   => $valor
        ];
    }
}
        
    



    
?>