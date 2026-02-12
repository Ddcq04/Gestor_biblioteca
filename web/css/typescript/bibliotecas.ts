// bibliotecas.ts

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

        if (nomInput.value.trim() === "") return alert("Introduce un nombre");

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