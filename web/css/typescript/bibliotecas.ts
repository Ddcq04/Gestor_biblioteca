// bibliotecas.ts
<<<<<<< HEAD

// Función centralizada para peticiones
export async function api(action: string, method: string = "GET", body: any = null) {
    const res = await fetch(`server.php?action=${action}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
    });
    return await res.json();
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SECCIÓN SOCIOS: BÚSQUEDA Y MODIFICACIÓN ---
    document.getElementById("btnBuscarSocio")?.addEventListener("click", async () => {
        const nomInput = document.getElementById("busqNombreSocio") as HTMLInputElement;
        const resCont = document.getElementById("resSocio");
        const infoText = document.getElementById("infoSocioText");
=======
export {}

document.addEventListener("DOMContentLoaded", () => {

    // --- BOTONES DE FILTROS (solo si existen) ---
    const btnTodos = document.getElementById("btnTodos");
    const btnVencidos = document.getElementById("btnVencidos");
    const btnNoDevueltos = document.getElementById("btnNoDevueltos");
>>>>>>> e2af9afb811e8ba30466577394b1dfbce6a40065

        if (nomInput.value.trim() === "") return alert("Introduce un nombre");

<<<<<<< HEAD
        // Usamos la acción definida en server.php
        const s = await api(`buscarSocioNombre&nombre=${nomInput.value}`);
        
        if (s && s.id && resCont && infoText) {
            resCont.style.display = "block";
            infoText.innerText = `Socio: ${s.nombre} (ID: ${s.id}) - Correo: ${s.correo}`;
            
            // Pre-llenar el formulario de modificación (IDs del HTML)
            (document.getElementById("modIdS") as HTMLInputElement).value = s.id;
            (document.getElementById("modSocio") as HTMLInputElement).value = s.nombre;
            (document.getElementById("modgmailSocio") as HTMLInputElement).value = s.correo;
            (document.getElementById("modtelfSocio") as HTMLInputElement).value = s.telefono;
        } else { 
            alert("Socio no encontrado"); 
        }
    });

    // Activar visor del mini-formulario de modificación
    document.getElementById("btnActivarMod")?.addEventListener("click", () => {
        const f = document.getElementById("formModSocio")!;
        f.style.display = f.style.display === "none" ? "flex" : "none";
    });

    // Guardar cambios del Socio (POST con ID en la URL)
    document.getElementById("formModSocio")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = (document.getElementById("modIdS") as HTMLInputElement).value;
        const data = {
            nombre: (document.getElementById("modSocio") as HTMLInputElement).value,
            correo: (document.getElementById("modgmailSocio") as HTMLInputElement).value,
            telefono: (document.getElementById("modtelfSocio") as HTMLInputElement).value
        };

        const res = await api(`modSocio&id=${id}`, "POST", data);
        alert(res.mensaje);
        if(res.status) location.reload();
    });

    // Registrar nuevo socio
    document.getElementById("formNuevoSocio")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            nombre: (document.getElementById("nomS") as HTMLInputElement).value,
            correo: (document.getElementById("corS") as HTMLInputElement).value,
            telefono: (document.getElementById("telS") as HTMLInputElement).value
        };
        const res = await api("altaSocio", "POST", data);
        alert(res.mensaje);
        if(res.status) location.reload();
    });


    // --- 2. SECCIÓN LIBROS Y GÉNEROS ---
    
    // Llenar el select de géneros automáticamente
    api("getGeneros").then(generos => {
        const select = document.getElementById("busqGenLibro") as HTMLSelectElement;
        if (select && Array.isArray(generos)) {
            select.innerHTML = generos.map(g => `<option value="${g}">${g}</option>`).join("");
        }
    });

    // Buscar libros por género y pintar en la tabla
    document.getElementById("btnBuscarLibro")?.addEventListener("click", async () => {
        const gen = (document.getElementById("busqGenLibro") as HTMLSelectElement).value;
        const tbody = document.getElementById("tbodyGral") as HTMLTableSectionElement;
        
        const libros = await api(`porGenero&genero=${gen}`);
        
        if (Array.isArray(libros) && tbody) {
            tbody.innerHTML = libros.map(l => `
                <tr>
                    <td>${l.nombre}</td>
                    <td>${l.genero}</td>
                    <td>Stock: ${l.stock}</td>
                    <td><button class="btn btn-prestar-lista" data-id="${l.id}" data-nombre="${l.nombre}">Seleccionar</button></td>
                </tr>
            `).join("");

            // Asignar eventos a los botones de la tabla recién creados
            document.querySelectorAll(".btn-prestar-lista").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const el = e.target as HTMLButtonElement;
                    const lid = el.getAttribute("data-id")!;
                    const lnom = el.getAttribute("data-nombre")!;
                    prepararFormularioPrestamo(lid, lnom);
                });
            });
        }
    });

    // Función auxiliar para llenar el form de préstamo
    function prepararFormularioPrestamo(id: string, nombre: string) {
        document.getElementById("resLibro")!.style.display = "block";
        document.getElementById("infoLibroText")!.innerText = `Libro seleccionado: ${nombre}`;
        (document.getElementById("pLibroId") as HTMLInputElement).value = id;
        document.getElementById("formPrestamoRapido")!.style.display = "flex";
    }


    // --- 3. SECCIÓN PRÉSTAMOS ---

    // Confirmar préstamo (POST)
    document.getElementById("formPrestamoRapido")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            socio_id: (document.getElementById("pSocioId") as HTMLInputElement).value,
            libro_id: (document.getElementById("pLibroId") as HTMLInputElement).value
        };
        // Cambiado de "altaPrestamo" a "prestamo" para coincidir con tu server.php
        const res = await api("prestamo", "POST", data);
        alert(res.mensaje);
        if(res.status) location.reload();
    });

    // Cargar tablas de estados (Vencidos, No vencidos, Historial)
    document.getElementById("btnVencidos")?.addEventListener("click", () => cargarTablaConsultas("vencidos"));
    document.getElementById("btnNoVencidos")?.addEventListener("click", () => cargarTablaConsultas("noVencidos"));
    document.getElementById("btnHistorialGral")?.addEventListener("click", () => cargarTablaConsultas("historial"));
});

// Función para pintar cualquier consulta en la tabla principal
async function cargarTablaConsultas(action: string) {
    const data = await api(action);
    const tbody = document.getElementById("tbodyGral") as HTMLTableSectionElement;
    
    if (tbody && Array.isArray(data)) {
        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>No se encontraron registros</td></tr>";
            return;
        }
        tbody.innerHTML = data.map((item: any) => `
            <tr>
                <td>Socio ID: ${item.socio_id}</td>
                <td>Libro ID: ${item.libro_id}</td>
                <td>Vencimiento: ${item.fecha_vencimiento}</td>
            </tr>
        `).join("");
    }
}
=======
    // --- FORMULARIO ALTA SOCIO ---
    const formAltaSocio = document.querySelector("form.form") as HTMLFormElement | null;
    formAltaSocio?.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta("Socio", formAltaSocio);
    });

    // --- FORMULARIO ALTA LIBRO ---
    // Aquí seleccionamos el segundo formulario de la página (libro)
    const formAltaLibro = document.querySelectorAll("form.form")[1] as HTMLFormElement | undefined;
    formAltaLibro?.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta("Libro", formAltaLibro);
    });

    // --- CARGAR PRÉSTAMOS AL INICIO ---
    cargarPrestamos("todos");
});

// ===============================================
// Función para cargar préstamos según tipo
// ===============================================
async function cargarPrestamos(tipo: string) {
    let action = "";
    switch (tipo) {
        case "todos": action = "prestamosSocio"; break;
        case "vencidos": action = "prestamosVencidos"; break;
        case "noVencidos": action = "prestamosnoVencidos"; break;
    }

    try {
        const response = await fetch(`server.php?action=${action}`);
        if (!response.ok) throw new Error("Error al cargar préstamos");
        const datos = await response.json();
        pintarTabla(datos);
    } catch (err) {
        alert("No se pudieron cargar los datos");
        console.error(err);
    }
}

// ===============================================
// Función para pintar tabla de préstamos
// ===============================================
function pintarTabla(lista: any[]) {
    const tbody = document.getElementById("tablaResultados")!;
    tbody.innerHTML = "";

    lista.forEach((p) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.socio_id || p.nombre || "N/A"}</td>
            <td>${p.libro_id || p.titulo || "N/A"}</td>
            <td>${p.fecha_prestamo || p.fecha || "-"}</td>
            <td>${p.fecha_devolucion ? 'Devuelto' : 'Pendiente'}</td>
            <td>
                ${!p.fecha_devolucion ? `<button class="btn-devolver" data-socio="${p.socio_id}" data-libro="${p.libro_id}">Devolver</button>` : ""}
            </td>
        `;

        const btnDevolver = tr.querySelector(".btn-devolver");
        btnDevolver?.addEventListener("click", () => {
            const sId = parseInt(btnDevolver.getAttribute("data-socio") || "0");
            const lId = parseInt(btnDevolver.getAttribute("data-libro") || "0");
            devolverLibro(sId, lId);
        });

        tbody.appendChild(tr);
    });
}

// ===============================================
// Función para devolver un libro
// ===============================================
async function devolverLibro(socio_id: number, libro_id: number) {
    try {
        const response = await fetch(`server.php?action=libroDevuelto&socio_id=${socio_id}&libro_id=${libro_id}`, {
            method: "PUT"
        });
        const json = await response.json();
        alert(json.mensaje);
        cargarPrestamos("todos");
    } catch (err) {
        console.error(err);
        alert("Error al devolver libro");
    }
}

// ===============================================
// Función general para registrar socio o libro
// ===============================================
async function registrarAlta(tipo: "Socio" | "Libro", form: HTMLFormElement) {
    const inputs = form.querySelectorAll("input");
    let datos: any;

    if (tipo === "Socio") {
        const nombre = (inputs[0] as HTMLInputElement).value.trim();
        const correo = (inputs[1] as HTMLInputElement).value.trim() || `${nombre}@mail.com`;
        const telefono = parseInt((inputs[2] as HTMLInputElement).value) || 600000000;

        if (!nombre) {
            alert("Debe ingresar un nombre");
            return;
        }

        datos = { nombre, correo, telefono };
    } else {
        const nombre = (inputs[0] as HTMLInputElement).value.trim();
        const genero = (inputs[1] as HTMLInputElement).value.trim() || "Desconocido";
        const stock = parseInt((inputs[2] as HTMLInputElement).value) || 1;

        if (!nombre) {
            alert("Debe ingresar un nombre de libro");
            return;
        }

        datos = { nombre, genero, stock };
    }

    const action = tipo === "Socio" ? "altaSocio" : "altaLibro";

    try {
        const response = await fetch(`server.php?action=${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const json = await response.json();
        console.log("RAW PHP RESPONSE:", json);
        alert(json.mensaje);

        // Limpiar inputs
        inputs.forEach(i => (i as HTMLInputElement).value = "");

        // Recargar tabla de préstamos
        cargarPrestamos("todos");
    } catch (err) {
        console.error(err);
        alert("Error al registrar " + tipo);
    }
}
>>>>>>> e2af9afb811e8ba30466577394b1dfbce6a40065
