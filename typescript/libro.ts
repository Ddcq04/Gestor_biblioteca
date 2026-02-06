// 1. Definimos la clase Libro
class Libro {
    private id: number;
    private titulo: string;
    private genero: string;
    private disponible: boolean;

    // Segundo: El constructor recibe los datos y los "guarda"
    constructor(idRecibido: number, tituloRecibido: string, generoRecibido: string) {
        this.id = idRecibido;
        this.titulo = tituloRecibido;
        this.genero = generoRecibido;
        this.disponible = true; // Por defecto, todos los libros nuevos están libres
    }
}

// 2. Definimos la clase Usuario (Socio)
class Usuario {
    public id: number;
    public nombre: string;
    public email: string;

    constructor(idRecibido: number, nombreRecibido: string, emailRecibido: string) {
        this.id = idRecibido;
        this.nombre = nombreRecibido;
        this.email = emailRecibido;
    }
}

// 3. Definimos la clase Prestamo
class Prestamo {
    public idLibro: number;
    public idUsuario: number;
    public fechaPrestamo: Date;
    public fechaVencimiento: Date;
    public devuelto: boolean;

    constructor(idLibroRecibido: number, idUsuarioRecibido: number, vencimiento: Date) {
        this.idLibro = idLibroRecibido;
        this.idUsuario = idUsuarioRecibido;
        this.fechaPrestamo = new Date(); // La fecha de hoy
        this.fechaVencimiento = vencimiento;
        this.devuelto = false; // Al principio no está devuelto
    }
}