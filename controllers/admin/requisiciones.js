// constantes para completar las ruta de apis
const MATERIALES_API = 'services/admin/materiales.php';
const REQUISICION_API = 'services/admin/requisicion.php';
const DUPLAS_API = 'services/admin/duplas.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// constante del modal de tabla de materiales
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes para el modal de cambiar cantidad del material
const ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    ID_DETALLE = document.getElementById('idDetalle'),
    ID_DETALLE_MATERIAL = document.getElementById('idDetalleMaterial'),
    MATERIAL_BUTTON = document.getElementById('materialButton'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadMaterial'),
    MODAL_MATERIAL = document.getElementById('materialName');
// Constante para establecer el formulario de cambiar material.
const ITEM_FORM = document.getElementById('itemForm');
// constantes para modal de generación de requisiciones
const REQUISICION_MODAL = new bootstrap.Modal('#duplaModal');
// Constante para establecer el formulario de crear requisición
const REQUISICION_FORM = document.getElementById('requisicionForm');
;

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

// Método del evento para cuando se envía el formulario de cambiar cantidad del material.
ITEM_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ITEM_FORM);
    // Petición para actualizar la cantidad del material.
    const DATA = await fetchData(REQUISICION_API, 'updateDetail', FORM);
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

// Método del evento para cuando se envía un formulario para crear una requisición y agregar material a esta
REQUISICION_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(REQUISICION_FORM);
    // Petición para actualizar la cantidad del material.
    const DATA = await fetchData(REQUISICION_API, 'createRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo del formulario.
        REQUISICION_MODAL.hide();
        fillTable();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // ? Abre una nueva ventana con el identificador de la requisición creada
        if (DATA.requisicionId) {
            window.open(`materiales_requisicion.html?id=${DATA.requisicionId}`, '_blank');
        }
    } else {
        sweetAlert(2, DATA.error, false);
    }
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
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, action, form);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            let alerta = '';
            if (row.tiene_exceso > 0) {
                alerta = `<span class="badge bg-danger ms-2">¡Exceso de materiales!</span>`;
                alertaBoton = 'disabled';
            }
            else {
                alertaBoton = '';
                alerta = '';
            }
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.fecha_requisicion}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showMaterials(${row.id_requisicion}, 1)">
                        <h4>
                            <i class="bi bi-eye-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-info" onclick="showMaterials(${row.id_requisicion}, 2)">
                        <h4>
                            <i class="bi bi-pencil-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_requisicion})">
                        <h4>
                            <i class="bi bi-trash-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-success" onclick="approveRequisicion(${row.id_requisicion})" ${alertaBoton}>
                        <h4>
                            <i class="bi bi-check-lg"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-primary" onclick="openReport(${row.id_requisicion})" ${alertaBoton}>
                        <h4>
                            <i class='bi bi-filetype-pdf'></i>
                        </h4>
                    </button>
                    <span class="align-middle fs-4">${alerta}</span>
                </td>
            </tr>`;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
};

// * función asíncrona para mostrar modal para la generación de requisición
// * parámetros: ninguno
// * Retorno: ninguno
const openCreate = async () => {
    // se muestra la caja de dialogo con el titulo
    REQUISICION_MODAL.show();
    // se prepara el formulario
    REQUISICION_FORM.reset();
    fillSelect(DUPLAS_API, 'readAll', 'duplaRequisicion');
};

// * Función asíncrona para mostrar un mensaje de confirmación al momento de mover una requisición a papelera
// * parámetros: id (identificador de la requisición)
// * Retorno: ninguno
const openDelete = async (id) => {
    const RESPONSE = await confirmAction('Quiere remover la requisición a papelera?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idRequisicion', id);
        const DATA = await fetchData(REQUISICION_API, 'removeRequisicion', FORM);
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

// *función asíncrona para llenar la tabla con los registros 
const showMaterials = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `
    <h1 class="modal-title fs-5" id="modalTitle">Materiales solicitados</h1>
    <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
        data-bs-dismiss="modal" aria-label="Close"></button>`;

    // se comprueba que la acción que se desea realizar (visualizar o editar)
    switch (botones) {
        case 1:
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
            break;
        case 2:
            MODAL_BODY.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr id="tableColumns">
                        <th>MATERIAL</th>
                    <th>CANTIDAD</th>
                    <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="modalTableBody"></tbody>
            </table>`;
            MODAL_FOOTER.innerHTML = `
            <a href="materiales_requisicion.html?id=${id}" class="text-decoration-none">
                <button type="button" class="btn btn-success">Agregar material</button>
            </a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            `;
            break;
        default:
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
    if (DATA.status) {
        const MODAL_TABLE_BODY = document.getElementById('modalTableBody');
        SAVE_MODAL.show();
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            if (row.cantidad_material < row.cantidad_total) {
                sweetAlert(3, 'Cantidad de materiales de requisición superan la cantidad actual en bodega');
                MODAL_HEADER.innerHTML = `
                <h1 class="modal-title" id="modalTitle">Materiales solicitados</h1>
                <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
                    data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="alert alert-danger" role="alert">
                    <h2 class="alert-heading">
                    <i class="bi bi-exclamation-octagon-fill"></i>
                    No hay suficiente stock en bodega para cumplir con la requisición!</h2>
                </div>`;
                alertaMaterial = `
                    <i class="bi bi-exclamation-octagon-fill text-danger"></i>
                `;
            } else {
                MODAL_HEADER.innerHTML = `
                <h1 class="modal-title" id="modalTitle">Materiales solicitados</h1>
                <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
                    data-bs-dismiss="modal" aria-label="Close"></button>`;
                alertaMaterial = ``;
            }
            switch (botones) {
                case 1:
                    console.log(row.cantidad_material);
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total} ${row.unidad_contenido} ${alertaMaterial}</td>
                </tr>
            `;
                    break;
                case 2:
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total} ${row.unidad_contenido} ${alertaMaterial}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_detalle_requisicion}, ${row.cantidad_total}, '${row.nombre_material}', ${row.id_material})">
                            <h3>
                                <i class="bi bi-plus-slash-minus"></i>
                            </h3>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDeleteMaterial(${row.id_detalle_requisicion}, ${row.id_requisicion}, 2)">
                            <h3>
                                <i class="bi bi-trash-fill"></i>
                            </h3>
                        </button>
                    </td>
                </tr>
            `;
                    break;
                default:
                    break;
            }
        });
    } else {
        sweetAlert(4, DATA.error, true);
        SAVE_MODAL.show();
    }

}

// * función asíncrona para llenar la tabla para alterar la cantidad de
// * materiales de cada requisición
const openUpdate = (id, quantity, name, material) => {
    // se oculta el primer modal para darle pase al segundo modal
    SAVE_MODAL.hide();
    if (id == null && quantity == null) {
        console.log('error en un valor null');
    } else {
        // se abre el segundo modal con el contendió
        ITEM_MODAL.show();
        document.getElementById('materialName').textContent = name;
        ID_DETALLE.value = id;
        ID_DETALLE_MATERIAL.value = material;
        document.getElementById('cantidadMaterial').value = quantity;
    }
}

['input', 'change'].forEach(eventType => {
    CANTIDAD_ACTUALIZADA_MATERIAL.addEventListener(eventType, async (id) => {
        const FORM = new FormData();
        FORM.append('idMaterial', ID_DETALLE_MATERIAL.value);
        const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
        if (DATA.status) {
            const ROW = DATA.dataset;
            if (Number(CANTIDAD_ACTUALIZADA_MATERIAL.value) > Number(ROW.cantidad_material)) {
                sweetAlert(2, 'La cantidad solicitada no puede ser mayor a ' + Number(ROW.cantidad_material), false);
                MATERIAL_BUTTON.disabled = true;
            } else {
                MATERIAL_BUTTON.disabled = false;
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
});

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar un material de la requisición.
*   Parámetros: id (identificador del material).
*   Retorno: ninguno.
*/
async function openDeleteMaterial(id, idRequisicion, botones) {
    const RESPONSE = await confirmAction('¿Está seguro de remover el material?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        const DATA = await fetchData(REQUISICION_API, 'deleteMaterial', FORM);
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Vuelve a mostrar los materiales actualizados en el modal
            showMaterials(idRequisicion, botones);
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// * Función asíncrona para aproar una requisición y descontarla de lo materiales
// * Parámetros: id(identificador de la requisición).
// * Retorno: ninguno
const approveRequisicion = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Quieres aprobar esta requisición?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idRequisicion', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(REQUISICION_API, 'approveRequisicion', FORM);
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