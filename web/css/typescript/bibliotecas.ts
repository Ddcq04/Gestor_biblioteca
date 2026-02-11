// bibliotecas.ts
export {}

document.addEventListener("DOMContentLoaded", () => {

    // --- BOTONES DE FILTROS (solo si existen) ---
    const btnTodos = document.getElementById("btnTodos");
    const btnVencidos = document.getElementById("btnVencidos");
    const btnNoDevueltos = document.getElementById("btnNoDevueltos");

    btnTodos?.addEventListener("click", () => cargarPrestamos("todos"));
    btnVencidos?.addEventListener("click", () => cargarPrestamos("vencidos"));
    btnNoDevueltos?.addEventListener("click", () => cargarPrestamos("noVencidos"));

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
