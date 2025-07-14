// Constante para completar la ruta de la API.
const CONTENIDO_API = 'services/admin/contenido.php';
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CONTENIDO = document.getElementById('idContenido'),
    NOMBRE_CONTENIDO = document.getElementById('nombreContenido'),
    UNIDAD_CONTENIDO = document.getElementById('unidadContenido'),
    CANTIDAD_CONTENIDO = document.getElementById('cantidadContenido');

document.addEventListener('DOMContentLoaded', async () => {
    MAIN_TITLE.textContent = 'Unidades estándar';
    loadTemplate();
    // * se carga el contenido de la tabla
    fillTable();
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CONTENIDO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CONTENIDO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con el error.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CONTENIDO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con el error.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Si es null, muestra el mensaje; si tiene valor, muestra el valor
            let contenido = (row.cantidad_contenido === null || row.cantidad_contenido === '' || row.cantidad_contenido === undefined)
                ? 'Cantidad no agregada'
                : row.cantidad_contenido;

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre_contenido}</td>
                    <td>${row.unidad_contenido}</td>
                    <td>${contenido}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_contenido})">
                            <h2><i class="bi bi-pencil-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_contenido})">
                            <h2><i class="bi bi-trash-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-warning disabled" onclick="openChart(${row.id_contenido})">
                            <h2><i class="bi bi-bar-chart-line-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-warning disabled" onclick="openReport(${row.id_contenido})">
                            <h2><i class="bi bi-file-earmark-pdf-fill"></i></h2>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error);
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear contenido';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idContenido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CONTENIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con el error.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar contenido';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CONTENIDO.value = ROW.id_contenido;
        NOMBRE_CONTENIDO.value = ROW.nombre_contenido;
        UNIDAD_CONTENIDO.value = ROW.unidad_contenido;
        CANTIDAD_CONTENIDO.value = ROW.cantidad_contenido;
    }
    else {
        sweetAlert(2, DATA.error, false);
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el contenido de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idContenido', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CONTENIDO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con el error.
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


// * método para filtrar el contenido por tipo unidad
const fillTableNameSearch = async (type) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    switch (type) {
        case 1:
            action = 'readRowsPiezas';
            break;
        case 2:
            action = 'readRowsMetros';
            break;
        case 4:
            action = 'readRowsEmpaque';
            break;
        case 5:
            action = 'readRowsRollos';
            break;
        case 6:
            action = 'readRowsBobinas';
            break;
        case 7:
            action = 'readRowsOtros';
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CONTENIDO_API, action);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con el error.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Si es null, muestra el mensaje; si tiene valor, muestra el valor
            let contenido = (row.cantidad_contenido === null || row.cantidad_contenido === '' || row.cantidad_contenido === undefined)
                ? 'Cantidad no agregada'
                : row.cantidad_contenido;

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre_contenido}</td>
                    <td>${row.unidad_contenido}</td>
                    <td>${contenido}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_contenido})">
                            <h2><i class="bi bi-pencil-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_contenido})">
                            <h2><i class="bi bi-trash-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-warning disabled" onclick="openChart(${row.id_contenido})">
                            <h2><i class="bi bi-bar-chart-line-fill"></i></h2>
                        </button>
                        <button type="button" class="btn btn-warning disabled" onclick="openReport(${row.id_contenido})">
                            <h2><i class="bi bi-file-earmark-pdf-fill"></i></h2>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error);
    }
}