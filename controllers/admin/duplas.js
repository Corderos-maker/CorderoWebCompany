// ?constante para trabajar con la api
const EMPLEADO_API = 'services/admin/empleado.php';
const DUPLA_API = 'services/admin/duplas.php';

// ? constantes para actualizar las claves de las duplas 
const PASSWORD_MODAL = new bootstrap.Modal('#passwordModal'),
    PASSWORD_TITLE = document.getElementById('passwordTitle'),
    ID_CLAVE_DUPLA = document.getElementById('idClaveDupla'),
    PASSWORD_FORM = document.getElementById('passwordForm');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? contenido de formulario dupla para ocultar y agregar a los empleados
const CONTENIDO_EMPLEADO1 = document.getElementById('infoEmpleado1'),
    CONTENIDO_EMPLEADO2 = document.getElementById('infoEmpleado2');

// ? Constantes del registro de duplas
const SAVE_FORM = document.getElementById('saveForm'),
    ID_DUPLA = document.getElementById('idDupla'),
    TELEFONO_DUPLA = document.getElementById('telefonoDupla'),
    USUARIO_DUPLA = document.getElementById('usuarioDupla'),
    DUPLA_EMPLEADO_1 = document.getElementById('duplaEmpleado1'),
    CLAVE_DUPLA = document.getElementById('claveDupla'),
    DUPLA_EMPLEADO_2 = document.getElementById('duplaEmpleado2');

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('duplas'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

// ? Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    MAIN_TITLE.textContent = 'Administración duplas';
    readAllTable(null, 8);
});

// ? Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    readAllTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_DUPLA.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        readAllTable(null, 8);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

const openCreate = async () => {
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear dupla para empleados';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado1');
    fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado2');
    CLAVE_DUPLA.innerHTML = `                                               
    <div class="row justify-content-center">
        <div class="col-6 col-md-3 mb-3">
            <label for="claveDupla" class="form-label">Clave</label>
            <input type="password" class="form-control" id="claveDupla"
                name="claveDupla" placeholder="Ingrese su clave..."
                required>
        </div>

        <div class="col-6 col-md-3 mb-3">
            <label for="claveDupla2" class="form-label">Repetir
                Clave</label>
            <input type="password" class="form-control" id="claveDupla2"
                name="claveDupla2" placeholder="Repita su clave..."
                required>
        </div>
    </div>`;
    CONTENIDO_EMPLEADO1.innerHTML = '';
    CONTENIDO_EMPLEADO2.innerHTML = '';
}

// ? función asíncrona para llenar la tabla con los registros disponibles filtrados por nombre, fecha de actualización y actividad o inactividad
const readAllTable = async (form = null, buscador) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';

    // control de filtros para cargar la información que el usuario necesita 
    switch (buscador) {
        case 1:
            action = 'readByName';
            break;
        case 2:
            action = 'readByNameDesc';
            break;
        case 3:
            action = 'readByModify';
            break;
        case 4:
            action = 'readByActive';
            break;
        case 5:
            action = 'readByInactive';
            break;
        case 6:
            action = 'readByTypePermanent';
            break;
        case 7:
            action = 'readByTypeTemporal';
            break;
        case 8:
            action = 'readAll';
            break;
        default:
            action = 'searchRows';
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(DUPLA_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            // (row.tipo_dupla) ? type = 'Temporal' : type = 'Permanente';
            // (row.estado_dupla) ?  icon = 'text-info">Estado: Jornada iniciada' : icon = 'text-warning">Estado: Jornada terminada';
            let type = (row.tipo_dupla == 1 || row.tipo_dupla == "1") ? 'Temporal' : 'Permanente';
            let icon = (row.estado_dupla == 1 || row.estado_dupla == "1") ? 'text-info">Estado: Jornada iniciada' : 'text-warning">Estado: Jornada terminada';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            // console.log(row.estado_dupla);
            TABLE_BODY.innerHTML += `
<div class="col-12 card mt-2" >
    <div class="row justify-content-center align-items-center my-3">
        <!-- Contenedor de empleados -->
        <div class="col-md-12 col-lg-9 d-flex flex-wrap justify-content-between text-center gap-4">
            <div class="container">
                <h1>Nombre Dupla: ${row.usuario_dupla}</h1>
                <h3>Teléfono Dupla: ${row.telefono_empresa_dupla}</h3>
                <h3 class="card-text">Tipo: ${type}</h3>
                <h3>Usuario Dupla: ${row.usuario_dupla}</h3>
            </div>
        </div>
        <!-- Botones de acción alineados verticalmente -->
        <div class="col-sm-12 col-md-12 col-lg-3 d-flex flex-column justify-content-center align-items-center">
            <button class="btn btn-outline-dark mb-2 w-75" onclick="openDelete(${row.id_dupla})">
                <i class="bi bi-trash3-fill"></i> Eliminar
            </button>
            <button class="btn btn-outline-dark mb-2 w-75" onclick="openUpdate(${row.id_dupla})">
                <i class="bi bi-pencil-fill"></i> Actualizar
            </button>
            <button class="btn btn-outline-dark mb-2 w-75" onclick="openState(${row.id_dupla})">
                <i class="bi bi-exclamation-octagon"></i> Cambiar tipo dupla
            </button>
            <button class="btn btn-outline-dark mb-2 w-75" onclick="openPassword(${row.id_dupla})">
                <i class="bi bi-key"></i> Cambiar clave
            </button>
            <div class="card bg-dark my-2">
                <div class="card-body">
                    <h3 class="card-text ${icon}</h3>
                </div>
            </div>
            <a href="detalle_dupla.html?id=${row.id_dupla}" class="btn btn-success mb-2 w-75">
                <i class="bi bi-info-circle-fill"></i> Detalles de dupla
            </a>
        </div>
    </div>
</div>
`;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
        TABLE_BODY.innerHTML += `
    <div class="col-5 justify-content-center align-items-center">
            <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>
    `
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la dupla de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDupla', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DUPLA_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            readAllTable(null, 8);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const openUpdate = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea editar el materia de forma permanente?');
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDupla', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar información';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;

            ID_DUPLA.value = ROW.id_dupla;
            TELEFONO_DUPLA.value = ROW.telefono_empresa_dupla;
            USUARIO_DUPLA.value = ROW.usuario_dupla;

            // Asignar el tipo de dupla a los radio buttons
            if (parseInt(ROW.tipo_dupla) === 1) {
                document.getElementById('tipoDupla1').checked = true; // Temporal
            } else {
                document.getElementById('tipoDupla2').checked = true; // Permanente
            }

            CLAVE_DUPLA.innerHTML = '';

            // ? Se llena el formulario con información relacionada a los empleados
            CONTENIDO_EMPLEADO1.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado1}" width="200px"
        height="200px" class="rounded mx-auto d-block" 
        onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado1" name="idEmpleado1"> -->
        <h5 class=" mt-2">Nombre empleado</h5>
        <p class="card-title ">${ROW.nombre_empleado1}</p>
        <p class="card-title ">${ROW.apellido_empleado1}</p>
        `;
            CONTENIDO_EMPLEADO2.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado2}" width="200px"
        height="200px" class="rounded mx-auto d-block" onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado2" name="idEmpleado2"> -->
        <h5 class=" mt-2">Nombre empleado</h5>
        <p class="card-title ">${ROW.nombre_empleado2}</p>
        <p class="card-title ">${ROW.apellido_empleado2}</p>
        `;

            fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado1', parseInt(ROW.id_empleado1));
            fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado2', parseInt(ROW.id_empleado2));
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } 

}

/*
*   Función para preparar el formulario al momento de cambiar la constraseña.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openPassword = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDupla', id);

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        PASSWORD_MODAL.show();
        // ? preparar el modal para actualizar datos
        PASSWORD_FORM.reset();
        PASSWORD_TITLE.textContent = 'Cambiar clave duplas';
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CLAVE_DUPLA.value = ROW.id_dupla;
    }
}

// Método del evento para cuando se envía el formulario de guardar.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PASSWORD_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, 'updatePassword', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        PASSWORD_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        readAllTable(null, 8);
    } else {
        sweetAlert(2, DATA.error, false);
    }
})


/*
* Función asíncrona para preparar un modal de confirmacion para una funcion de estado
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openState = async (id) => {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cambiar el tipo de dupla?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDupla', id);

        // Petición para cambiar el estado del cliente
        const DATA = await fetchData(DUPLA_API, 'updateStatus', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            sweetAlert(1, DATA.message, true); // Mensaje de éxito
            // Recargar la tabla para visualizar los cambios
            readAllTable(null, 8);
        } else {
            sweetAlert(1, 'Tipo cambiado con éxito', false); // Mensaje de error
            // Recargar la tabla para visualizar los cambios
            readAllTable(null, 8);
        }
    }
}