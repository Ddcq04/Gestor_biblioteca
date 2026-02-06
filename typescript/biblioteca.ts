import { Libro, Usuario, Prestamo } from './libro';

class Biblioteca {
    private libros: Libro[] = [];
    private usuarios: Usuario[] = [];
    private prestamos: Prestamo[] = [];

    // --- ALTAS ---
    registrarLibro(nuevoLibro: Libro) {
        this.libros.push(nuevoLibro);
    }

    registrarUsuario(nuevoUsuario: Usuario) {
        this.usuarios.push(nuevoUsuario);
    }

    // --- CONSULTAS ---
    buscarLibrosPorGenero(genero: string) {
        return this.libros.filter(l => l.genero.toLowerCase() === genero.toLowerCase());
    }

    consultarDisponibilidad(titulo: string) {
        return this.libros.find(l => l.titulo === titulo && l.disponible);
    }

    // --- GESTIÓN DE PRÉSTAMOS ---
    registrarPrestamo(idLibro: string, idUsuario: string) {
        const libro = this.libros.find(l => l.id === idLibro);
        if (libro && libro.disponible) {
            libro.disponible = false;
            const vencimiento = new Date();
            vencimiento.setDate(vencimiento.getDate() + 15); // 15 días de plazo

            const nuevoPrestamo = new Prestamo(idLibro, idUsuario, new Date(), vencimiento);
            this.prestamos.push(nuevoPrestamo);
            console.log("Préstamo registrado con éxito.");
        }
    }

    listarPrestamosVencidos() {
        const hoy = new Date();
        return this.prestamos.filter(p => !p.devuelto && p.fechaVencimiento < hoy);
    }
}