// bibliotecas.ts
export{}

document.addEventListener("DOMContentLoaded", () => {
    // BOTONES DE FILTROS
    const btnTodos = document.getElementById("btnTodos");
    const btnVencidos = document.getElementById("btnVencidos");
    const btnNoDevueltos = document.getElementById("btnNoDevueltos");

    btnTodos?.addEventListener("click", () => cargarPrestamos("todos"));
    btnVencidos?.addEventListener("click", () => cargarPrestamos("vencidos"));
    btnNoDevueltos?.addEventListener("click", () => cargarPrestamos("noVencidos"));

    // FORMULARIO ALTA
    const formAlta = document.querySelector("form.form");
    formAlta?.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarAlta();
    });

    // Cargar todos al iniciar
    cargarPrestamos("todos");
});

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

function pintarTabla(lista: any[]) {
    const tbody = document.querySelector("tbody")!;
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
        btnDevolver?.addEventListener("click", () => devolverLibro(p.socio_id, p.libro_id));

        tbody.appendChild(tr);
    });
}

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

async function registrarAlta() {
    const form = document.querySelector("form.form")!;
    const select = form.querySelector("select")!;
    const inputNombre = form.querySelector("input[type=text]")!;
    const tipo = (select as HTMLSelectElement).value;
    const nombre = (inputNombre as HTMLInputElement).value;

    if (!nombre) {
        alert("Debe ingresar un nombre");
        return;
    }

    const action = tipo === "Socio" ? "altaSocio" : "altaLibro";
    const datos = tipo === "Socio"
        ? { nombre, correo: `${nombre}@mail.com`, password: "1234" }
        : { nombre, genero: "Desconocido", stock: 1 };

    // fetch sin catch
    const response = await fetch(`server.php?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const json = await response.json(); // <-- ya es objeto JS
    console.log("RAW PHP RESPONSE:", json);
    alert(json.mensaje);

    // Limpiar input y recargar tabla
    (inputNombre as HTMLInputElement).value = "";
    cargarPrestamos("todos");
}