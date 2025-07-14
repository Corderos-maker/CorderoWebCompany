// constantes para completar las ruta de apis
const PEDIDOS_HERRAMIENTAS_API = 'services/admin/pedido_herramienta.php';
const EVIDENCIA_HERRAMIENTA_API = 'services/admin/evidencia.php';
const DUPLAS_API = 'services/admin/duplas.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// constante del modal de tabla de herramientas
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes para el modal de cambiar cantidad del herramientas
const ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    ITEM_FORM = document.getElementById('itemForm'),
    ID_DETALLE = document.getElementById('idDetalle'),
    ID_DETALLE_MATERIAL = document.getElementById('idDetalleHerramienta'),
    MATERIAL_BUTTON = document.getElementById('herramientaButton'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadHerramienta'),
    MODAL_MATERIAL = document.getElementById('herramientaName');
// constantes para el manejo de imágenes de evidencia
const PICTURES_MODAL = new bootstrap.Modal('#picturesModal'),
    PICTURES_FORM = document.getElementById('picturesForm'),
    ID_EVIDENCIA = document.getElementById('idEvidencia'),
    TYPE_IMAGE = document.getElementById('typeImage'),
    IMAGEN_MUESTRA1 = document.getElementById('imagenMuestra1'),
    IMAGEN_MUESTRA2 = document.getElementById('imagenMuestra2');

// constantes para modal de generación de requisiciones
const PEDIDO_MODAL = new bootstrap.Modal('#duplaModal');
// Constante para establecer el formulario de crear requisición
const PEDIDO_FORM = document.getElementById('pedidoForm');

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

// Método del evento para cuando se envía un formulario para crear una requisición y agregar material a esta
PEDIDO_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PEDIDO_FORM);
    // Petición para actualizar la cantidad del material.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'createRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo del formulario.
        PEDIDO_MODAL.hide();
        fillTable();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // ? Abre una nueva ventana con el identificador de la requisición creada
        if (DATA.pedidoId) {
            window.open(`herramientas_pedido.html?id=${DATA.pedidoId}`, '_blank');
        }
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// * función asíncrona para mostrar modal para la generación de requisición
// * parámetros: ninguno
// * Retorno: ninguno
const openCreate = async () => {
    // se muestra la caja de dialogo con el titulo
    PEDIDO_MODAL.show();
    // se prepara el formulario
    PEDIDO_FORM.reset();
    fillSelect(DUPLAS_API, 'readAll', 'duplaPedido');
};

// TODO funciones para administrar los pedidos de herramientas
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
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, action, form);
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            let alerta = '';
            if (row.tiene_exceso > 0) {
                alerta = `<span class="badge bg-danger ms-2">¡Exceso de herramientas!</span>`;
                alertaBoton = 'disabled';
            }
            else {
                alertaBoton = '';
                alerta = '';
            }
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.fecha_pedido_herramienta}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showHerramientas(${row.id_pedido_herramienta}, 1)">
                        <h4>
                            <i class="bi bi-eye-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-info" onclick="showHerramientas(${row.id_pedido_herramienta}, 2)">
                        <h4>
                            <i class="bi bi-pencil-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_pedido_herramienta})">
                        <h4>
                            <i class="bi bi-trash-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-success" onclick="approvePedido(${row.id_pedido_herramienta})" ${alertaBoton}>
                        <h4>
                            <i class="bi bi-check-lg"></i>
                        </h4>
                    </button>
                    <span class="align-middle fs-4">${alerta}</span>
                </td>
            </tr>`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
};

// * Función asíncrona para aprobar un pedido de herramientas y descontarla de las herramientas
// * Parámetros: id(identificador del pedido).
// * Retorno: ninguno
const approvePedido = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Quieres aprobar este pedido?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPedido', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'approvePedido', FORM);
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

// * Función asíncrona para mostrar un mensaje de confirmación al momento de mover un pedido de herramientas a papelera
// * parámetros: id (identificador del pedido)
// * Retorno: ninguno
const openDelete = async (id) => {
    const RESPONSE = await confirmAction('Quiere remover el pedido a la papelera?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idPedido', id);
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'removePedido', FORM);
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



// TODO funciones para administrar los detalles de los pedidos de herramientas
// Método del evento para cuando se envía el formulario de cambiar cantidad de la herramienta.
ITEM_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ITEM_FORM);
    // Petición para actualizar la cantidad del material.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'updateDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo del formulario.
        ITEM_MODAL.hide();
        fillTable();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// *función asíncrona para llenar la tabla con los registros 
const showHerramientas = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // se inicializa la tabla de herramientas
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `
    <h1 class="modal-title fs-5" id="modalTitle">Herramientas solicitadas</h1>
    <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
        data-bs-dismiss="modal" aria-label="Close">
    </button>`;
    // se comprueba que la acción que se desea realizar (visualizar o editar)
    switch (botones) {
        case 1:
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
            break;
        case 2:
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
            <a href="#.html?id=${id}" class="text-decoration-none">
                <button type="button" class="btn btn-success">Agregar herramienta</button>
            </a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            `;
            break;
        default:
            break;
    }
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

            // ...tu lógica de alertaHerramienta...

            switch (botones) {
                case 1:
                    MODAL_TABLE_BODY.innerHTML += `
                    <tr>
                        <td>${row.nombre_herramienta}</td>
                        <td>${row.cantidad_detalle_herramienta}</td>
                        <td>${evidenciaBtn}</td>
                    </tr>
                `;
                    break;
                case 2:
                    MODAL_TABLE_BODY.innerHTML += `
                    <tr>
                        <td>${row.nombre_herramienta}</td>
                        <td>${row.cantidad_detalle_herramienta} </td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_detalle_herramienta}, ${row.cantidad_detalle_herramienta}, '${row.nombre_herramienta}', ${row.id_herramienta})">
                                <h3>
                                    <i class="bi bi-plus-slash-minus"></i>
                                </h3>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="openDeleteHerramienta(${row.id_detalle_herramienta}, ${row.id_pedido_herramienta}, 2)">
                                <h3>
                                    <i class="bi bi-trash-fill"></i>
                                </h3>
                            </button>
                            ${evidenciaBtn}
                        </td>
                    </tr>
                `;
                    break;
                default:
                    break;
            }
        }
    } else {
        sweetAlert(4, DATA.error, true);
        SAVE_MODAL.show();
    }
};

// * función asíncrona para llenar la tabla para alterar la cantidad de
// * herramientas de cada pedido.
const openUpdate = (id, quantity, name, herramienta) => {
    // se oculta el primer modal para darle pase al segundo modal
    SAVE_MODAL.hide();
    if (id == null && quantity == null) {
        console.log('error en un valor null');
    } else {
        // se abre el segundo modal con el contendió
        ITEM_MODAL.show();
        document.getElementById('herramientaName').textContent = name;
        ID_DETALLE.value = id;
        ID_DETALLE_MATERIAL.value = herramienta;
        CANTIDAD_ACTUALIZADA_MATERIAL.value = quantity;
    }
}

// ? método para validad por lado del cliente un valor valido
CANTIDAD_ACTUALIZADA_MATERIAL.addEventListener('input', () => {
    // Validar que la cantidad sea un número entero positivo
    if (CANTIDAD_ACTUALIZADA_MATERIAL.value < 0) {
        CANTIDAD_ACTUALIZADA_MATERIAL.value = 1; // Ajustar a 1 si es menor que 1
        sweetAlert(4, 'la cantidad tiene que ser mayor a 1', true);
    } else if (CANTIDAD_ACTUALIZADA_MATERIAL.value > 2) {
        CANTIDAD_ACTUALIZADA_MATERIAL.value = 2; // Ajustar a 2 si es mayor a 2
        // ? se muestra una alerta si la cantidad es mayor a 2
        sweetAlert(4, 'la cantidad tiene que ser menor a 2', true);
    }
});

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar una herramienta del pedido.
*   Parámetros: id (identificador del detalle de la herramienta).
*   Retorno: ninguno.
*/
async function openDeleteHerramienta(id, idPedido, botones) {
    const RESPONSE = await confirmAction('¿Está seguro de remover la herramienta?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'deleteHerramienta', FORM);
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Vuelve a mostrar las herramientas actualizadas en el modal
            showHerramientas(idPedido, botones);
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

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