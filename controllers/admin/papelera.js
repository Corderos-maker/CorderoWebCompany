// constantes para completar las ruta de
const MATERIALES_API = 'services/admin/materiales.php';
const REQUISICION_API = 'services/admin/requisicion.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    ID_DETALLE = document.getElementById('idDetalle'),
    ID_DETALLE_MATERIAL = document.getElementById('idDetalleMaterial'),
    MATERIAL_BUTTON = document.getElementById('materialButton'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadMaterial'),
    MODAL_MATERIAL = document.getElementById('materialName'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody');
    
// * método para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // llama a la función para llenar la tabla con los registros
    fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});


/*
* Función asíncrona para llenar la tabla con los registros disponibles.
* Parámetros: form (objeto opcional con los datos de búsqueda).
* Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRowsCancel' : action = 'readAllCancel';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, action, form);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.estado_requisicion}</td>
                <td>${row.fecha_requisicion}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showMaterials(${row.id_requisicion})">
                        <h3>
                            <i class="bi bi-eye-fill"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-success" onclick="openRestore(${row.id_requisicion})">
                        <h3>
                            <i class="bi bi-recycle"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-primary" onclick="openReport(${row.id_requisicion})">
                        <h3>
                            <i class='bi bi-filetype-pdf'></i>
                        </h3>
                    </button>
                </td>
            </tr>`;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
};


// *función asíncrona para llenar la tabla con los registros 
const showMaterials = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `
    <h1 class="modal-title fs-5" id="modalTitle">Materiales solicitados</h1>
    <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
        data-bs-dismiss="modal" aria-label="Close"></button>`;
    MODAL_BODY.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr id="tableColumns">
                        <th>MATERIAL</th>
                        <th>CANTIDAD</th>
                    </tr>
                </thead>
                <tbody id="modalTableBody"></tbody>
            </table>`;
    MODAL_FOOTER.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            `;
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
    if (DATA.status) {
        const MODAL_TABLE_BODY = document.getElementById('modalTableBody');
        SAVE_MODAL.show();
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            console.log(row.cantidad_material);
            MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total} ${row.unidad_contenido}</td>
                </tr>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
        SAVE_MODAL.show();
    }

}

// * Función asíncrona para mostrar un mensaje de confirmación al momento de restaurar una requisición a papelera
// * parámetros: id (identificador de la requisición)
// * Retorno: ninguno
const openRestore = async (id) => {
    const RESPONSE = await confirmAction('Quiere restaurar la requisición a papelera?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idRequisicion', id);
        const DATA = await fetchData(REQUISICION_API, 'restoreRequisicion', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

/*
*   Función para abrir un reporte parametrizado.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openReport = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/requisicion.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idRequisicion', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}