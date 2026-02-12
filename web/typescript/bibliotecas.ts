// web/typescript/bibliotecas.ts
const API_URL: string = '../app/server.php';

interface ApiResponse {
    status: boolean;
    mensaje: string;
}

interface Socio {
    id: number;
    nombre: string;
    telefono: string;
    correo: string;
}

interface Libro {
    id: number;
    nombre: string;
    genero: string;
    stock: number;
}

interface Prestamo {
    id: number;
    socio_id: number;
    libro_id: number;
    fecha_prestamo: string;
    fecha_vencimiento: string;
    fecha_devolucion: string | null;
    socio_nombre?: string;
    libro_nombre?: string;
}

async function api<T>(action: string, method: string = "GET", body: object | null = null): Promise<T> {
    try {
        const url: string = `${API_URL}?action=${action}`;
        const options: RequestInit = {
            method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);
        
        const res: Response = await fetch(url, options);
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return await res.json() as T;
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", (): void => {
    cargarGeneros();
    cargarTodosLosLibros();
    
    // ==== EVENT LISTENERS ====
    
    // Alta socio
    document.getElementById("formNuevoSocio")?.addEventListener("submit", async (e: Event): Promise<void> => {
        e.preventDefault();
        const data = {
            nombre: (document.getElementById("nomS") as HTMLInputElement).value,
            telefono: (document.getElementById("telS") as HTMLInputElement).value,
            correo: (document.getElementById("corS") as HTMLInputElement).value
        };
        try {
            const res = await api<ApiResponse>("altaSocio", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            alert("Error al registrar socio");
        }
    });

    // Buscar socio
    document.getElementById("btnBuscarSocio")?.addEventListener("click", async (): Promise<void> => {
        const nombre: string = (document.getElementById("busqNombreSocio") as HTMLInputElement).value;
        if (!nombre) {
            alert("Ingrese un nombre para buscar");
            return;
        }
        try {
            const socio = await api<Socio | null>(`buscarSocioNombre&nombre=${encodeURIComponent(nombre)}`);
            if (!socio) {
                alert("Socio no encontrado");
                return;
            }
            document.getElementById("infoSocioText")!.innerHTML = `
                <strong>ID:</strong> ${socio.id}<br>
                <strong>Nombre:</strong> ${socio.nombre}<br>
                <strong>Email:</strong> ${socio.correo}<br>
                <strong>Teléfono:</strong> ${socio.telefono}
            `;
            (document.getElementById("resSocio") as HTMLElement).style.display = "block";
            (document.getElementById("modIdS") as HTMLInputElement).value = socio.id.toString();
            (document.getElementById("modSocio") as HTMLInputElement).value = socio.nombre;
            (document.getElementById("modgmailSocio") as HTMLInputElement).value = socio.correo;
            (document.getElementById("modtelfSocio") as HTMLInputElement).value = socio.telefono;
        } catch (error) {
            alert("Error al buscar socio");
        }
    });

    // Activar formulario de modificación
    document.getElementById("btnActivarMod")?.addEventListener("click", (): void => {
        (document.getElementById("formModSocio") as HTMLElement).style.display = "block";
    });

    // Modificar socio
    document.getElementById("formModSocio")?.addEventListener("submit", async (e: Event): Promise<void> => {
        e.preventDefault();
        const id: string = (document.getElementById("modIdS") as HTMLInputElement).value;
        const data = {
            nombre: (document.getElementById("modSocio") as HTMLInputElement).value,
            correo: (document.getElementById("modgmailSocio") as HTMLInputElement).value,
            telefono: (document.getElementById("modtelfSocio") as HTMLInputElement).value
        };
        try {
            const res = await api<ApiResponse>(`modSocio&id=${id}`, "POST", data);
            alert(res.mensaje);
            if (res.status) {
                (document.getElementById("formModSocio") as HTMLElement).style.display = "none";
                (document.getElementById("resSocio") as HTMLElement).style.display = "none";
            }
        } catch (error) {
            alert("Error al modificar socio");
        }
    });

    // Alta libro
    document.getElementById("formNuevoLibro")?.addEventListener("submit", async (e: Event): Promise<void> => {
        e.preventDefault();
        const data = {
            nombre: (document.getElementById("titulolibro") as HTMLInputElement).value,
            genero: (document.getElementById("busqGenLibro") as HTMLSelectElement).value,
            stock: parseInt((document.getElementById("ejemplar") as HTMLInputElement).value, 10)
        };
        try {
            const res = await api<ApiResponse>("altaLibro", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                (e.target as HTMLFormElement).reset();
                cargarGeneros();
                cargarTodosLosLibros();
            }
        } catch (error) {
            alert("Error al agregar libro");
        }
    });

    // Filtrar libros por género
    document.getElementById("btnFiltrarLibro")?.addEventListener("click", async (): Promise<void> => {
        const genero: string = (document.getElementById("busqLibroCatalogo") as HTMLSelectElement).value;
        await cargarLibrosPorGenero(genero);
    });

    // Préstamo rápido
    document.getElementById("formPrestamoRapido")?.addEventListener("submit", async (e: Event): Promise<void> => {
        e.preventDefault();
        const libroId: string = (document.getElementById("pLibroId") as HTMLInputElement).value;
        const socioId: string = (document.getElementById("pSocioId") as HTMLInputElement).value;
        
        if (!libroId || !socioId) {
            alert("Complete todos los campos");
            return;
        }
        
        const data = {
            socio_id: parseInt(socioId, 10),
            libro_id: parseInt(libroId, 10)
        };
        
        try {
            const res = await api<ApiResponse>("prestamo", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                (document.getElementById("formPrestamoRapido") as HTMLElement).style.display = "none";
                (document.getElementById("pSocioId") as HTMLInputElement).value = "";
                cargarTodosLosLibros();
            }
        } catch (error) {
            alert("Error al registrar préstamo");
        }
    });

    // Botones de consulta de préstamos
    document.getElementById("btnVencidos")?.addEventListener("click", async (): Promise<void> => {
        try {
            const prestamos = await api<Prestamo[]>("vencidos");
            mostrarPrestamos(prestamos, "Préstamos Vencidos");
        } catch (error) {
            alert("Error al cargar préstamos vencidos");
        }
    });

    document.getElementById("btnNoVencidos")?.addEventListener("click", async (): Promise<void> => {
        try {
            const prestamos = await api<Prestamo[]>("noVencidos");
            mostrarPrestamos(prestamos, "Préstamos No Vencidos");
        } catch (error) {
            alert("Error al cargar préstamos no vencidos");
        }
    });

    document.getElementById("btnHistorial")?.addEventListener("click", async (): Promise<void> => {
        try {
            const prestamos = await api<Prestamo[]>("historial");
            mostrarPrestamos(prestamos, "Historial de Devoluciones");
        } catch (error) {
            alert("Error al cargar historial");
        }
    });
});

// ==== FUNCIONES AUXILIARES ====

async function cargarGeneros(): Promise<void> {
    try {
        const generos = await api<string[]>("getGeneros");
        const selectGen = document.getElementById("busqGenLibro") as HTMLSelectElement;
        const selectFiltro = document.getElementById("busqLibroCatalogo") as HTMLSelectElement;
        
        let options: string = '<option value="">Seleccione un género</option>';
        options += generos.map((g: string) => `<option value="${g}">${g}</option>`).join("");
        
        selectGen.innerHTML = options;
        if (selectFiltro) {
            selectFiltro.innerHTML = '<option value="">Todos los géneros</option>' + 
                generos.map((g: string) => `<option value="${g}">${g}</option>`).join("");
        }
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
}

async function cargarTodosLosLibros(): Promise<void> {
    try {
        const libros = await api<Libro[]>("getLibros");
        mostrarLibros(libros);
    } catch (error) {
        console.error("Error al cargar libros:", error);
    }
}

async function cargarLibrosPorGenero(genero: string): Promise<void> {
    try {
        const libros = await api<Libro[]>(`getLibros&genero=${encodeURIComponent(genero)}`);
        mostrarLibros(libros);
    } catch (error) {
        console.error("Error al cargar libros por género:", error);
    }
}

function mostrarLibros(libros: Libro[]): void {
    const tbody = document.getElementById("tbodyGral") as HTMLTableSectionElement;
    if (!tbody) return;
    
    if (!libros || libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No hay libros disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = libros.map((libro: Libro): string => {
        const tituloEscapado: string = libro.nombre.replace(/'/g, "\\'");
        return `
        <tr>
            <td>${libro.id}</td>
            <td>${libro.nombre}</td>
            <td>${libro.genero}</td>
            <td>${libro.stock}</td>
            <td>
                <button onclick="seleccionarLibro(${libro.id}, '${tituloEscapado}')" 
                        class="btn" style="background:#27ae60" 
                        ${libro.stock <= 0 ? 'disabled' : ''}>
                    Prestar
                </button>
            </td>
        </tr>
    `}).join("");
}

// ✅ CORREGIDO: Declaración global como módulo
export {};

declare global {
    interface Window {
        seleccionarLibro: (id: number, titulo: string) => void;
    }
}

window.seleccionarLibro = function(id: number, titulo: string): void {
    (document.getElementById("pLibroId") as HTMLInputElement).value = id.toString();
    (document.getElementById("resLibro") as HTMLElement).style.display = "block";
    (document.getElementById("infoLibroText") as HTMLElement).innerHTML = `
        <strong>Libro seleccionado:</strong> ${titulo} (ID: ${id})<br>
        Complete el ID del socio para realizar el préstamo.
    `;
    (document.getElementById("formPrestamoRapido") as HTMLElement).style.display = "block";
};

function mostrarPrestamos(prestamos: Prestamo[], titulo: string): void {
    const tbody = document.getElementById("tbodyPrestamos") as HTMLTableSectionElement;
    if (!tbody) return;
    
    if (!prestamos || prestamos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay préstamos para mostrar</td></tr>';
        return;
    }
    
    tbody.innerHTML = prestamos.map((p: Prestamo): string => {
        const fecha: string = p.fecha_vencimiento ? new Date(p.fecha_vencimiento).toLocaleDateString() : '';
        const estado: string = p.fecha_devolucion ? 'Devuelto' : 
                      (new Date(p.fecha_vencimiento) < new Date() ? 'Vencido' : 'Activo');
        
        return `
            <tr>
                <td>${p.socio_id} - ${p.socio_nombre || ''}</td>
                <td>${p.libro_id} - ${p.libro_nombre || ''}</td>
                <td>${fecha}</td>
                <td style="color: ${estado === 'Vencido' ? 'red' : estado === 'Activo' ? 'green' : 'gray'}">
                    ${estado}
                </td>
            </tr>
        `;
    }).join("");
}