// constantes para completar las ruta de
const REQUISICION_API = 'services/admin/requisicion.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    ID_DETALLE = document.getElementById('idDetalle'),
    ID_DETALLE_MATERIAL = document.getElementById('idDetalleMaterial'),
    MATERIAL_BUTTON = document.getElementById('materialButton'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadMaterial'),
    MODAL_MATERIAL = document.getElementById('materialName'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función para llenar la tabla con los registros
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


const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRowsHistory' : action = 'readAllHistory';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, action, form);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            let STATE = '';
            switch (row.estado_requisicion) {
                case 'Pendiente':
                    STATE = "warning'>Pendiente";
                    break;
                case 'Procesando':
                    STATE = "primary'>Procesando";
                    break;
                case 'Aprobada':
                    STATE = "success'>Aprobada";
                    break;
                case 'Anulada':
                    STATE = "danger'>Rechazada";
                    break;
                default:
                    break;
            }
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.usuario_dupla}</td>
                    <td class='text-${STATE}</td>
                    <td>${row.fecha_accion_requisicion}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-secondary" onclick="showMaterials(${row.id_requisicion}, '${row.fecha_requisicion}', '${row.alias_administrador}')">
                        <h4>
                            <i class="bi bi-eye-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-primary" onclick="openReport(${row.id_requisicion})">
                        <h4>
                            <i class='bi bi-filetype-pdf'></i>
                        </h4>
                    </button>
                    </td>
                </tr>`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// *función asíncrona para llenar la tabla con los registros 
const showMaterials = async (id, time, admin) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `
    <h1 class="modal-title fs-5" id="modalTitle">Materiales solicitados</h1>
        <div class="row">
            <div class="col-12">
                <h5 class="modal-title fs-5" id="">Fecha generada</h5>
                <h5 class="modal-title fs-5" id="">${time}</h5>
            </div>
            <div class="col-12">
                <h5 class="modal-title fs-5" id="">Administrador </h5>
                <h5 class="modal-title fs-5" id="">${admin}</h5>
            </div>
        </div>
        
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