const API_URL = '../app/server.php';

async function api(action, method = "GET", body = null) {
    try {
        const url = `${API_URL}?action=${action}`;
        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);
        
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarGeneros();
    cargarTodosLosLibros();
    
    // ==== EVENT LISTENERS ====
    
    // Alta socio
    document.getElementById("formNuevoSocio")?.addEventListener("submit", async e => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById("nomS").value,
            telefono: document.getElementById("telS").value,
            correo: document.getElementById("corS").value
        };
        try {
            const res = await api("altaSocio", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                e.target.reset();
            }
        } catch (error) {
            alert("Error al registrar socio");
        }
    });

    // Buscar socio
    document.getElementById("btnBuscarSocio")?.addEventListener("click", async () => {
        const nombre = document.getElementById("busqNombreSocio").value;
        if (!nombre) {
            alert("Ingrese un nombre para buscar");
            return;
        }
        try {
            const socio = await api(`buscarSocioNombre&nombre=${encodeURIComponent(nombre)}`);
            if (!socio) {
                alert("Socio no encontrado");
                return;
            }
            document.getElementById("infoSocioText").innerHTML = `
                <strong>ID:</strong> ${socio.id}<br>
                <strong>Nombre:</strong> ${socio.nombre}<br>
                <strong>Email:</strong> ${socio.correo}<br>
                <strong>Teléfono:</strong> ${socio.telefono}
            `;
            document.getElementById("resSocio").style.display = "block";
            document.getElementById("modIdS").value = socio.id;
            document.getElementById("modSocio").value = socio.nombre;
            document.getElementById("modgmailSocio").value = socio.correo;
            document.getElementById("modtelfSocio").value = socio.telefono;
        } catch (error) {
            alert("Error al buscar socio");
        }
    });

    // Activar formulario de modificación
    document.getElementById("btnActivarMod")?.addEventListener("click", () => {
        document.getElementById("formModSocio").style.display = "block";
    });

    // Modificar socio
    document.getElementById("formModSocio")?.addEventListener("submit", async e => {
        e.preventDefault();
        const id = document.getElementById("modIdS").value;
        const data = {
            nombre: document.getElementById("modSocio").value,
            correo: document.getElementById("modgmailSocio").value,
            telefono: document.getElementById("modtelfSocio").value
        };
        try {
            const res = await api(`modSocio&id=${id}`, "POST", data);
            alert(res.mensaje);
            if (res.status) {
                document.getElementById("formModSocio").style.display = "none";
                document.getElementById("resSocio").style.display = "none";
            }
        } catch (error) {
            alert("Error al modificar socio");
        }
    });

    // Alta libro
    document.getElementById("formNuevoLibro")?.addEventListener("submit", async e => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById("titulolibro").value,
            genero: document.getElementById("busqGenLibro").value,
            stock: parseInt(document.getElementById("ejemplar").value)
        };
        try {
            const res = await api("altaLibro", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                e.target.reset();
                cargarGeneros();
                cargarTodosLosLibros();
            }
        } catch (error) {
            alert("Error al agregar libro");
        }
    });

    // Filtrar libros por género
    document.getElementById("btnFiltrarLibro")?.addEventListener("click", async () => {
        const genero = document.getElementById("busqLibroCatalogo").value;
        await cargarLibrosPorGenero(genero);
    });

    // Préstamo rápido
    document.getElementById("formPrestamoRapido")?.addEventListener("submit", async e => {
        e.preventDefault();
        const libroId = document.getElementById("pLibroId").value;
        const socioId = document.getElementById("pSocioId").value;
        
        if (!libroId || !socioId) {
            alert("Complete todos los campos");
            return;
        }
        
        const data = {
            socio_id: parseInt(socioId),
            libro_id: parseInt(libroId)
        };
        
        try {
            const res = await api("prestamo", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                document.getElementById("formPrestamoRapido").style.display = "none";
                document.getElementById("pSocioId").value = "";
                cargarTodosLosLibros();
            }
        } catch (error) {
            alert("Error al registrar préstamo");
        }
    });

    // Botones de consulta de préstamos
    document.getElementById("btnVencidos")?.addEventListener("click", async () => {
        try {
            const prestamos = await api("vencidos");
            mostrarPrestamos(prestamos, "Préstamos Vencidos");
        } catch (error) {
            alert("Error al cargar préstamos vencidos");
        }
    });

    document.getElementById("btnNoVencidos")?.addEventListener("click", async () => {
        try {
            const prestamos = await api("noVencidos");
            mostrarPrestamos(prestamos, "Préstamos No Vencidos");
        } catch (error) {
            alert("Error al cargar préstamos no vencidos");
        }
    });

    document.getElementById("btnHistorial")?.addEventListener("click", async () => {
        try {
            const prestamos = await api("historial");
            mostrarPrestamos(prestamos, "Historial de Devoluciones");
        } catch (error) {
            alert("Error al cargar historial");
        }
    });
});

// ==== FUNCIONES AUXILIARES ====

async function cargarGeneros() {
    try {
        const generos = await api("getGeneros");
        const selectGen = document.getElementById("busqGenLibro");
        const selectFiltro = document.getElementById("busqLibroCatalogo");
        
        let options = '<option value="">Seleccione un género</option>';
        options += generos.map(g => `<option value="${g}">${g}</option>`).join("");
        
        selectGen.innerHTML = options;
        if (selectFiltro) {
            selectFiltro.innerHTML = '<option value="">Todos los géneros</option>' + 
                generos.map(g => `<option value="${g}">${g}</option>`).join("");
        }
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
}

async function cargarTodosLosLibros() {
    try {
        const libros = await api("getLibros");
        mostrarLibros(libros);
    } catch (error) {
        console.error("Error al cargar libros:", error);
    }
}

async function cargarLibrosPorGenero(genero) {
    try {
        const libros = await api(`getLibros&genero=${encodeURIComponent(genero)}`);
        mostrarLibros(libros);
    } catch (error) {
        console.error("Error al cargar libros por género:", error);
    }
}

function mostrarLibros(libros) {
    const tbody = document.getElementById("tbodyGral");
    if (!tbody) return;
    
    if (!libros || libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No hay libros disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = libros.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td>${libro.nombre}</td>
            <td>${libro.genero}</td>
            <td>${libro.stock}</td>
            <td>
                <button onclick="seleccionarLibro(${libro.id}, '${libro.nombre.replace(/'/g, "\\'")}')" 
                        class="btn" style="background:#27ae60" 
                        ${libro.stock <= 0 ? 'disabled' : ''}>
                    Prestar
                </button>
            </td>
        </tr>
    `).join("");
}

window.seleccionarLibro = function(id, titulo) {
    document.getElementById("pLibroId").value = id;
    document.getElementById("resLibro").style.display = "block";
    document.getElementById("infoLibroText").innerHTML = `
        <strong>Libro seleccionado:</strong> ${titulo} (ID: ${id})<br>
        Complete el ID del socio para realizar el préstamo.
    `;
    document.getElementById("formPrestamoRapido").style.display = "block";
};

function mostrarPrestamos(prestamos, titulo) {
    const tbody = document.getElementById("tbodyPrestamos");
    if (!tbody) return;
    
    if (!prestamos || prestamos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay préstamos para mostrar</td></tr>';
        return;
    }
    
    tbody.innerHTML = prestamos.map(p => {
        const fecha = p.fecha_vencimiento ? new Date(p.fecha_vencimiento).toLocaleDateString() : '';
        const estado = p.fecha_devolucion ? 'Devuelto' : 
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