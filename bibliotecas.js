var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    // BOTONES DE FILTROS
    const btnTodos = document.getElementById("btnTodos");
    const btnVencidos = document.getElementById("btnVencidos");
    const btnNoDevueltos = document.getElementById("btnNoDevueltos");
    btnTodos === null || btnTodos === void 0 ? void 0 : btnTodos.addEventListener("click", () => cargarPrestamos("todos"));
    btnVencidos === null || btnVencidos === void 0 ? void 0 : btnVencidos.addEventListener("click", () => cargarPrestamos("vencidos"));
    btnNoDevueltos === null || btnNoDevueltos === void 0 ? void 0 : btnNoDevueltos.addEventListener("click", () => cargarPrestamos("noVencidos"));
    // FORMULARIO ALTA
    const formAlta = document.querySelector("form.form");
    formAlta === null || formAlta === void 0 ? void 0 : formAlta.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta();
    });
    // Cargar todos al iniciar
    cargarPrestamos("todos");
});
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
function pintarTabla(lista) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    lista.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.socio}</td>
            <td>${p.libro}</td>
            <td>${p.fecha}</td>
            <td>${p.estado}</td>
            <td>
                ${p.estado !== "Devuelto" ? `<button class="btn-devolver">Devolver</button>` : ""}
            </td>
        `;
        const btnDevolver = tr.querySelector(".btn-devolver");
        btnDevolver === null || btnDevolver === void 0 ? void 0 : btnDevolver.addEventListener("click", () => devolverLibro(p.socio_id, p.libro_id));
        tbody.appendChild(tr);
    });
}
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
function registrarAlta() {
    return __awaiter(this, void 0, void 0, function* () {
        const form = document.querySelector("form.form");
        const select = form.querySelector("select");
        const inputNombre = form.querySelector("input[type=text]");
        const tipo = select.value;
        const nombre = inputNombre.value;
        if (!nombre) {
            alert("Debe ingresar un nombre");
            return;
        }
        const action = tipo === "Socio" ? "altaSocio" : "altaLibro";
        const datos = tipo === "Socio"
            ? { nombre, correo: `${nombre}@mail.com`, password: "1234" }
            : { nombre, genero: "Desconocido", stock: 1 };
        // fetch sin catch
        const response = yield fetch(`server.php?action=${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const json = yield response.json(); // <-- ya es objeto JS
        console.log("RAW PHP RESPONSE:", json);
        alert(json.mensaje);
        // Limpiar input y recargar tabla
        inputNombre.value = "";
        cargarPrestamos("todos");
    });
}
export {};
