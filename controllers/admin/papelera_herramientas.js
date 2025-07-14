// constantes para completar las ruta de apis
const EVIDENCIA_HERRAMIENTA_API = 'services/admin/evidencia.php';
const PEDIDOS_HERRAMIENTAS_API = 'services/admin/pedido_herramienta.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes del formulario para mostrar
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    ID_DETALLE = document.getElementById('idDetalle'),
    ID_DETALLE_HERRAMIENTA = document.getElementById('idDetalleHerramienta'),
    HERRAMIENTA_BUTTON = document.getElementById('materialButton'),
    CANTIDAD_ACTUALIZADA_HERRAMIENTA = document.getElementById('cantidadHerramienta'),
    MODAL_HERRAMIENTA = document.getElementById('materialName'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody');
// constantes para el manejo de imágenes de evidencia
const PICTURES_MODAL = new bootstrap.Modal('#picturesModal'),
    PICTURES_FORM = document.getElementById('picturesForm'),
    ID_EVIDENCIA = document.getElementById('idEvidencia'),
    TYPE_IMAGE = document.getElementById('typeImage'),
    IMAGEN_MUESTRA1 = document.getElementById('imagenMuestra1'),
    IMAGEN_MUESTRA2 = document.getElementById('imagenMuestra2');

// ? función que se ejecuta al momento de cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    loadTemplate();
    // llama la función para rellenar la tabla al cargar la pagina
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
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.estado_pedido_herramienta}</td>
                <td>${row.fecha_pedido_herramienta}</td>
                <td>${row.fecha_accion_pedido}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showHerramientas(${row.id_pedido_herramienta})">
                        <h3>
                            <i class="bi bi-eye-fill"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-success" onclick="openRestore(${row.id_pedido_herramienta})">
                        <h3>
                            <i class="bi bi-recycle"></i>
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
const showHerramientas = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `
    <h1 class="modal-title fs-5" id="modalTitle">Herramientas solicitadas</h1>
    <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
        data-bs-dismiss="modal" aria-label="Close"></button>`;
    MODAL_BODY.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr id="tableColumns">
                        <th>HERRAMIENTAS</th>
                        <th>CANTIDAD</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="modalTableBody"></tbody>
            </table>`;
    MODAL_FOOTER.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            `;
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'readByOrder', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        const MODAL_TABLE_BODY = document.getElementById('modalTableBody');
        SAVE_MODAL.show();
        // Usar for...of para poder usar await dentro del ciclo
        for (const row of DATA.dataset) {
            // Prepara formData para la sub-consulta de evidencia
            const formData = new FormData();
            formData.append('idDetalle', row.id_detalle_herramienta);

            // Espera la respuesta de la subconsulta
            const evidencia = await fetchData(EVIDENCIA_HERRAMIENTA_API, 'readDetail', formData);

            // Determina el botón/icono según si hay evidencia
            let evidenciaBtn = '';
            if (evidencia.status) {
                evidenciaBtn = `
                <button type="button" class="btn btn-info btn-lg" onclick="openEvidence(${row.id_detalle_herramienta}, 2)">
                    <i class="bi bi-image-fill"></i>
                </button>
                <button type="button" class="btn btn-success btn-lg">
                    <i class="bi bi-check2"></i>
                </button>`;
            } else {
                evidenciaBtn = `
                <button type="button" class="btn btn-info btn-lg" onclick="openEvidence(${row.id_detalle_herramienta}, 1)">
                    <i class="bi bi-image-fill"></i>
                </button>
                <button type="button" class="btn btn-warning btn-lg">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </button>`;
            }
            MODAL_TABLE_BODY.innerHTML += `
                    <tr>
                        <td>${row.nombre_herramienta}</td>
                        <td>${row.cantidad_detalle_herramienta}</td>
                        <td>${evidenciaBtn}</td>
                    </tr>`;
        }
    } else {
        sweetAlert(4, DATA.error, true);
        SAVE_MODAL.show();
    }
};

// * función para preparar el formulario de evidencia
const openEvidence = async (id, type) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDetalle', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(EVIDENCIA_HERRAMIENTA_API, 'readPictures', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se abre la caja de diálogo que contiene el formulario de evidencia.
        PICTURES_MODAL.show();
        // se prepara el formulario
        PICTURES_FORM.reset();
        // Se inicializan los campos del formulario con los datos del registro seleccionado.
        const ROW = DATA.dataset;
        ID_EVIDENCIA.value = ROW.id_evidencia_herramienta;
        console.log('este es el id del detalle ' + ROW.id_evidencia_herramienta)
        IMAGEN_MUESTRA1.src = `${SERVER_URL}images/evidencia/${ROW.imagen_evidencia_herramienta1}`;
        IMAGEN_MUESTRA2.src = `${SERVER_URL}images/evidencia/${ROW.imagen_evidencia_herramienta2}`;
        // se prepara el input para saber que tipo de caso es el que se realizara
        TYPE_IMAGE.value = type;
    }
    else {
        sweetAlert(3, 'No tiene imágenes ingresadas', false);
        PICTURES_FORM.reset();
        // Se abre la caja de diálogo que contiene el formulario de evidencia.
        IMAGEN_MUESTRA1.src = '../../resources/images/error/404Material.png';
        IMAGEN_MUESTRA2.src = '../../resources/images/error/404Material.png';
        PICTURES_MODAL.show();
        ID_EVIDENCIA.value = id;
        // se prepara el input para saber que tipo de caso es el que se realizara
        TYPE_IMAGE.value = type;
    }

}

// * Función asíncrona para mostrar un mensaje de confirmación al momento de restaurar un pedido de la papelera
// * parámetros: id (identificador del pedido)
// * Retorno: ninguno
const openRestore = async (id) => {
    const RESPONSE = await confirmAction('Quiere restaurar el pedido de la papelera?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idPedido', id);
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'restorePedido', FORM);
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