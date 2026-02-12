"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
<<<<<<< HEAD

// Función central de comunicación
function api(action, method = "GET", body = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`server.php?action=${action}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        });
        return yield res.json();
=======
document.addEventListener("DOMContentLoaded", () => {
    // --- BOTONES DE FILTROS (solo si existen) ---
    const btnTodos = document.getElementById("btnTodos");
    const btnVencidos = document.getElementById("btnVencidos");
    const btnNoDevueltos = document.getElementById("btnNoDevueltos");
    btnTodos === null || btnTodos === void 0 ? void 0 : btnTodos.addEventListener("click", () => cargarPrestamos("todos"));
    btnVencidos === null || btnVencidos === void 0 ? void 0 : btnVencidos.addEventListener("click", () => cargarPrestamos("vencidos"));
    btnNoDevueltos === null || btnNoDevueltos === void 0 ? void 0 : btnNoDevueltos.addEventListener("click", () => cargarPrestamos("noVencidos"));
    // --- FORMULARIO ALTA SOCIO ---
    const formAltaSocio = document.querySelector("form.form");
    formAltaSocio === null || formAltaSocio === void 0 ? void 0 : formAltaSocio.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta("Socio", formAltaSocio);
    });
    // --- FORMULARIO ALTA LIBRO ---
    // Aquí seleccionamos el segundo formulario de la página (libro)
    const formAltaLibro = document.querySelectorAll("form.form")[1];
    formAltaLibro === null || formAltaLibro === void 0 ? void 0 : formAltaLibro.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta("Libro", formAltaLibro);
    });
    // --- CARGAR PRÉSTAMOS AL INICIO ---
    cargarPrestamos("todos");
});
// ===============================================
// Función para cargar préstamos según tipo
// ===============================================
function cargarPrestamos(tipo) {
    return __awaiter(this, void 0, void 0, function* () {
        let action = "";
        switch (tipo) {
            case "todos":
                action = "prestamosSocio";
                break;
            case "vencidos":
                action = "prestamosVencidos";
                break;
            case "noVencidos":
                action = "prestamosnoVencidos";
                break;
        }
        try {
            const response = yield fetch(`server.php?action=${action}`);
            if (!response.ok)
                throw new Error("Error al cargar préstamos");
            const datos = yield response.json();
            pintarTabla(datos);
        }
        catch (err) {
            alert("No se pudieron cargar los datos");
            console.error(err);
        }
    });
}
// ===============================================
// Función para pintar tabla de préstamos
// ===============================================
function pintarTabla(lista) {
    const tbody = document.getElementById("tablaResultados");
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
        btnDevolver === null || btnDevolver === void 0 ? void 0 : btnDevolver.addEventListener("click", () => {
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
function devolverLibro(socio_id, libro_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`server.php?action=libroDevuelto&socio_id=${socio_id}&libro_id=${libro_id}`, {
                method: "PUT"
            });
            const json = yield response.json();
            alert(json.mensaje);
            cargarPrestamos("todos");
        }
        catch (err) {
            console.error(err);
            alert("Error al devolver libro");
        }
    });
}
// ===============================================
// Función general para registrar socio o libro
// ===============================================
function registrarAlta(tipo, form) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = form.querySelectorAll("input");
        let datos;
        if (tipo === "Socio") {
            const nombre = inputs[0].value.trim();
            const correo = inputs[1].value.trim() || `${nombre}@mail.com`;
            const telefono = parseInt(inputs[2].value) || 600000000;
            if (!nombre) {
                alert("Debe ingresar un nombre");
                return;
            }
            datos = { nombre, correo, telefono };
        }
        else {
            const nombre = inputs[0].value.trim();
            const genero = inputs[1].value.trim() || "Desconocido";
            const stock = parseInt(inputs[2].value) || 1;
            if (!nombre) {
                alert("Debe ingresar un nombre de libro");
                return;
            }
            datos = { nombre, genero, stock };
        }
        const action = tipo === "Socio" ? "altaSocio" : "altaLibro";
        try {
            const response = yield fetch(`server.php?action=${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            const json = yield response.json();
            console.log("RAW PHP RESPONSE:", json);
            alert(json.mensaje);
            // Limpiar inputs
            inputs.forEach(i => i.value = "");
            // Recargar tabla de préstamos
            cargarPrestamos("todos");
        }
        catch (err) {
            console.error(err);
            alert("Error al registrar " + tipo);
        }
>>>>>>> e2af9afb811e8ba30466577394b1dfbce6a40065
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. GESTIÓN DE SOCIOS ---
    const btnBuscarSocio = document.getElementById("btnBuscarSocio");
    const btnActivarMod = document.getElementById("btnActivarMod");
    const formModSocio = document.getElementById("formModSocio");

    // Buscar Socio por Nombre
    btnBuscarSocio?.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const nom = document.getElementById("busqNombreSocio").value;
        const s = yield api(`buscarSocioNombre&nombre=${nom}`);
        
        if (s && s.id) {
            document.getElementById("resSocio").style.display = "block";
            document.getElementById("infoSocioText").innerText = `Socio: ${s.nombre} (ID: ${s.id})`;
            
            // Llenar campos ocultos y visibles para modificar
            document.getElementById("modIdS").value = s.id;
            document.getElementById("modSocio").value = s.nombre;
            document.getElementById("modgmailSocio").value = s.correo;
            document.getElementById("modtelfSocio").value = s.telefono;
            btnActivarMod.style.display = "inline-block";
        } else {
            alert("Socio no encontrado");
            document.getElementById("resSocio").style.display = "none";
        }
    }));

    // Mostrar/Ocultar formulario de edición
    btnActivarMod?.addEventListener("click", () => {
        formModSocio.style.display = formModSocio.style.display === "none" ? "flex" : "none";
    });

    // Enviar Modificación (Corregido: ID en URL + Datos en Body)
    formModSocio?.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = document.getElementById("modIdS").value;
        const data = {
            nombre: document.getElementById("modSocio").value,
            correo: document.getElementById("modgmailSocio").value,
            telefono: document.getElementById("modtelfSocio").value
        };
        const res = yield api(`modSocio&id=${id}`, "POST", data);
        alert(res.mensaje);
        if(res.status) location.reload();
    }));

    // --- 2. GESTIÓN DE LIBROS ---
    
    // Llenar Select de Géneros dinámicamente
    api("getGeneros").then(generos => {
        const select = document.getElementById("busqGenLibro");
        if (select && Array.isArray(generos)) {
            select.innerHTML = generos.map(g => `<option value="${g}">${g}</option>`).join("");
        }
    });

    // Buscar libros por Género y pintar tabla
    document.getElementById("btnBuscarLibro")?.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const gen = document.getElementById("busqGenLibro").value;
        const tbody = document.getElementById("tbodyGral");
        const libros = yield api(`porGenero&genero=${gen}`);
        
        if (Array.isArray(libros) && tbody) {
            tbody.innerHTML = libros.map(l => `
                <tr>
                    <td>${l.nombre}</td>
                    <td>${l.genero}</td>
                    <td>Stock: ${l.stock}</td>
                    <td><button class="btn sel-libro" data-id="${l.id}" data-nombre="${l.nombre}">Seleccionar</button></td>
                </tr>
            `).join("");

            // Evento para los botones creados dinámicamente
            document.querySelectorAll(".sel-libro").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const bid = e.target.getAttribute("data-id");
                    const bnom = e.target.getAttribute("data-nombre");
                    
                    document.getElementById("resLibro").style.display = "block";
                    document.getElementById("infoLibroText").innerText = `Libro: ${bnom}`;
                    document.getElementById("pLibroId").value = bid;
                    document.getElementById("formPrestamoRapido").style.display = "flex";
                });
            });
        }
    }));

    // --- 3. PRÉSTAMOS Y CONSULTAS ---

    // Generar Préstamo
    document.getElementById("formPrestamoRapido")?.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = {
            socio_id: document.getElementById("pSocioId").value,
            libro_id: document.getElementById("pLibroId").value
        };
        const res = yield api("prestamo", "POST", data);
        alert(res.mensaje);
        if(res.status) location.reload();
    }));

    // Botones de Tablas Generales
    document.getElementById("btnVencidos")?.addEventListener("click", () => cargarTablaConsultas("vencidos"));
    document.getElementById("btnNoVencidos")?.addEventListener("click", () => cargarTablaConsultas("noVencidos"));
    document.getElementById("btnHistorialGral")?.addEventListener("click", () => cargarTablaConsultas("historial"));
});

function cargarTablaConsultas(action) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield api(action);
        const tbody = document.getElementById("tbodyGral");
        if (tbody && Array.isArray(data)) {
            tbody.innerHTML = data.length === 0 
                ? "<tr><td colspan='3'>Sin datos</td></tr>" 
                : data.map(item => `
                    <tr>
                        <td>Socio: ${item.socio_id}</td>
                        <td>Libro: ${item.libro_id}</td>
                        <td>Vence: ${item.fecha_vencimiento}</td>
                    </tr>
                `).join("");
        }
    });
}