var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// web/typescript/bibliotecas.ts
const API_URL = '../app/server.php';
function api(action_1) {
    return __awaiter(this, arguments, void 0, function* (action, method = "GET", body = null) {
        try {
            const url = `${API_URL}?action=${action}`;
            const options = {
                method,
                headers: { "Content-Type": "application/json" }
            };
            if (body)
                options.body = JSON.stringify(body);
            const res = yield fetch(url, options);
            if (!res.ok)
                throw new Error(`Error del servidor: ${res.status}`);
            return yield res.json();
        }
        catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    cargarGeneros();
    cargarTodosLosLibros();
    // ==== EVENT LISTENERS ====
    // Alta socio
    (_a = document.getElementById("formNuevoSocio")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const data = {
            nombre: document.getElementById("nomS").value,
            telefono: document.getElementById("telS").value,
            correo: document.getElementById("corS").value
        };
        try {
            const res = yield api("altaSocio", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                e.target.reset();
            }
        }
        catch (error) {
            alert("Error al registrar socio");
        }
    }));
    // Buscar socio y pintar tabla
    (_b = document.getElementById("btnBuscarSocio")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const nombre = document.getElementById("busqNombreSocio").value;
        if (!nombre) {
            alert("Ingrese un nombre para buscar");
            return;
        }
        try {
            const socios = yield api(`buscarSocioNombre&nombre=${encodeURIComponent(nombre)}`);
            mostrarSociosEnTabla(socios);
            if (socios.length === 0) {
                alert("No se encontraron socios con ese nombre");
            }
        }
        catch (error) {
            alert("Error al buscar socios");
            console.error(error);
        }
    }));
    // Modificar socio
    (_c = document.getElementById("formModSocio")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const id = document.getElementById("modIdS").value;
        const data = {
            nombre: document.getElementById("modSocio").value,
            correo: document.getElementById("modgmailSocio").value,
            telefono: document.getElementById("modtelfSocio").value
        };
        try {
            const res = yield api(`modSocio&id=${id}`, "POST", data);
            alert(res.mensaje);
            if (res.status) {
                document.getElementById("formModSocio").style.display = "none";
            }
        }
        catch (error) {
            alert("Error al modificar socio");
        }
    }));
    // Alta libro
    (_d = document.getElementById("formNuevoLibro")) === null || _d === void 0 ? void 0 : _d.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const data = {
            nombre: document.getElementById("titulolibro").value,
            genero: document.getElementById("busqGenLibro").value,
            stock: parseInt(document.getElementById("ejemplar").value, 10)
        };
        try {
            const res = yield api("altaLibro", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                e.target.reset();
                cargarGeneros();
                cargarTodosLosLibros();
            }
        }
        catch (error) {
            alert("Error al agregar libro");
        }
    }));
    // Filtrar libros por género
    (_e = document.getElementById("btnFiltrarLibro")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const genero = document.getElementById("busqLibroCatalogo").value;
        yield cargarLibrosPorGenero(genero);
    }));
    // Préstamo rápido
    (_f = document.getElementById("formPrestamoRapido")) === null || _f === void 0 ? void 0 : _f.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const libroId = document.getElementById("pLibroId").value;
        const socioId = document.getElementById("pSocioId").value;
        if (!libroId || !socioId) {
            alert("Complete todos los campos");
            return;
        }
        const data = {
            socio_id: parseInt(socioId, 10),
            libro_id: parseInt(libroId, 10)
        };
        try {
            const res = yield api("prestamo", "POST", data);
            alert(res.mensaje);
            if (res.status) {
                document.getElementById("formPrestamoRapido").style.display = "none";
                document.getElementById("pSocioId").value = "";
                cargarTodosLosLibros();
            }
        }
        catch (error) {
            alert("Error al registrar préstamo");
        }
    }));
    // Botones de consulta de préstamos
    (_g = document.getElementById("btnfiltrarPrestamos")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const socioId = document.getElementById("busqIdSocio").value;
        if (!socioId) {
            alert("Por favor, ingrese un ID de socio");
            return;
        }
        try {
            const prestamos = yield api(`prestamosSocio&id=${socioId}`);
            mostrarPrestamos(prestamos, `Préstamos del socio ID: ${socioId}`);
        }
        catch (error) {
            alert("Error al cargar préstamos del socio");
            console.error(error);
        }
    }));
    (_h = document.getElementById("btnVencidos")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prestamos = yield api("vencidos");
            mostrarPrestamos(prestamos, "Préstamos Vencidos");
        }
        catch (error) {
            alert("Error al cargar préstamos vencidos");
        }
    }));
    (_j = document.getElementById("btnNoVencidos")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prestamos = yield api("noVencidos");
            mostrarPrestamos(prestamos, "Préstamos No Vencidos");
        }
        catch (error) {
            alert("Error al cargar préstamos no vencidos");
        }
    }));
    (_k = document.getElementById("btnHistorial")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prestamos = yield api("historial");
            mostrarPrestamos(prestamos, "Historial de Devoluciones");
        }
        catch (error) {
            alert("Error al cargar historial");
        }
    }));
});
// ==== FUNCIONES AUXILIARES ====
// Cargar todos los socios
function cargarTodosLosSocios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const socios = yield api("getSocios");
            mostrarSociosEnTabla(socios);
        }
        catch (error) {
            console.error("Error al cargar socios:", error);
            alert("Error al cargar la lista de socios");
        }
    });
}
// Mostrar socios en tabla
function mostrarSociosEnTabla(socios) {
    const tbody = document.getElementById("infoSocioText");
    if (!tbody)
        return;
    if (!socios || socios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No hay socios para mostrar</td></tr>';
        return;
    }
    tbody.innerHTML = socios.map((socio) => {
        // Escapar comillas simples para el onclick
        const nombreEscapado = socio.nombre.replace(/'/g, "\\'");
        const telefonoEscapado = socio.telefono.replace(/'/g, "\\'");
        const correoEscapado = socio.correo.replace(/'/g, "\\'");
        return `
        <tr>
            <td>${socio.id}</td>
            <td>${socio.nombre}</td>
            <td>${socio.telefono}</td>
            <td>${socio.correo}</td>
            <td>
                <button onclick="window.seleccionarSocio(${socio.id}, '${nombreEscapado}', '${telefonoEscapado}', '${correoEscapado}')" 
                        class="btn" style="background:#e67e22; padding:5px 10px;">
                    Modificar
                </button>
            </td>
        </tr>
    `;
    }).join("");
}
window.seleccionarSocio = function (id, nombre, telefono, correo) {
    document.getElementById("modIdS").value = id.toString();
    document.getElementById("modSocio").value = nombre;
    document.getElementById("modtelfSocio").value = telefono;
    document.getElementById("modgmailSocio").value = correo;
    document.getElementById("formModSocio").style.display = "block";
};
function cargarGeneros() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const generos = yield api("getGeneros");
            const selectGen = document.getElementById("busqGenLibro");
            const selectFiltro = document.getElementById("busqLibroCatalogo");
            let options = '<option value="">Seleccione un género</option>';
            options += generos.map((g) => `<option value="${g}">${g}</option>`).join("");
            selectGen.innerHTML = options;
            if (selectFiltro) {
                selectFiltro.innerHTML = '<option value="">Todos los géneros</option>' +
                    generos.map((g) => `<option value="${g}">${g}</option>`).join("");
            }
        }
        catch (error) {
            console.error("Error al cargar géneros:", error);
        }
    });
}
function cargarTodosLosLibros() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const libros = yield api("getLibros");
            mostrarLibros(libros);
        }
        catch (error) {
            console.error("Error al cargar libros:", error);
        }
    });
}
function cargarLibrosPorGenero(genero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const libros = yield api(`getLibros&genero=${encodeURIComponent(genero)}`);
            mostrarLibros(libros);
        }
        catch (error) {
            console.error("Error al cargar libros por género:", error);
        }
    });
}
function mostrarLibros(libros) {
    const tbody = document.getElementById("tbodyGral");
    if (!tbody)
        return;
    if (!libros || libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No hay libros disponibles</td></tr>';
        return;
    }
    tbody.innerHTML = libros.map((libro) => {
        const tituloEscapado = libro.nombre.replace(/'/g, "\\'");
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
    `;
    }).join("");
}
window.seleccionarLibro = function (id, titulo) {
    document.getElementById("pLibroId").value = id.toString();
    document.getElementById("resLibro").style.display = "block";
    document.getElementById("infoLibroText").innerHTML = `
        <strong>Libro seleccionado:</strong> ${titulo} (ID: ${id})<br>
        Complete el ID del socio para realizar el préstamo.
    `;
    document.getElementById("formPrestamoRapido").style.display = "block";
};
function mostrarPrestamos(prestamos, titulo) {
    const tbody = document.getElementById("tbodyPrestamos");
    if (!tbody)
        return;
    if (!prestamos || prestamos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay préstamos para mostrar</td></tr>';
        return;
    }
    tbody.innerHTML = prestamos.map((p) => {
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
export {};
