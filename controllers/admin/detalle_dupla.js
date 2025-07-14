// ? constantes para solicitud de apis
const DUPLA_API = 'services/admin/duplas.php';
const EMPLEADO_API = 'services/admin/empleado.php';
const TRABAJO_DUPLA_API = 'services/admin/trabajo_dupla.php';
const REQUISICION_API = 'services/admin/requisicion.php';
const EVIDENCIA_HERRAMIENTA_API = 'services/admin/evidencia.php';
const PEDIDOS_HERRAMIENTAS_API = 'services/admin/pedido_herramienta.php';
// ? constantes para actualizar las claves de las duplas 
const PASSWORD_MODAL = new bootstrap.Modal('#passwordModal'),
    PASSWORD_TITLE = document.getElementById('passwordTitle'),
    ID_CLAVE_DUPLA = document.getElementById('idClaveDupla'),
    PASSWORD_FORM = document.getElementById('passwordForm');
// constante del modal de tabla de materiales
const DETAILS_MODAL = new bootstrap.Modal('#detailsModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_DETAIL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// ? contenido de formulario dupla para ocultar y agregar a los empleados
const CONTENIDO_EMPLEADO1 = document.getElementById('infoEmpleado1'),
    CONTENIDO_EMPLEADO2 = document.getElementById('infoEmpleado2');
// ? contantes para mostrar los registros de los 4 acordeones (inicio y fin de  jornada) y (requisiciones y herramientas) 
// ? y contenedor de los detalles de los historiales
const INICIO_JORNADAS = document.getElementById('iniciosJornadas'),
    FINALIZACION_JORNADAS = document.getElementById('finalizacionJornada'),
    REQUISICIONES_HISTORIAL = document.getElementById('requisicionesHistorial'),
    HERRAMIENTAS_HISTORIAL = document.getElementById('herramientasHistorial'),
    BUTTONS_HISTORIAL = document.getElementById('buttonsHistorial');
// ? Constantes del registro de duplas
const SAVE_FORM = document.getElementById('saveForm'),
    ID_DUPLA = document.getElementById('idDupla'),
    TELEFONO_DUPLA = document.getElementById('telefonoEmpresaDupla'),
    TIPO_DUPLA = document.getElementById('tipoDupla'),
    USUARIO_DUPLA = document.getElementById('usuarioNombreDupla'),
    DUPLA_EMPLEADO_1 = document.getElementById('duplaEmpleado1'),
    DUPLA_EMPLEADO_2 = document.getElementById('duplaEmpleado2');
// constantes para el manejo de imágenes de evidencia
const PICTURES_MODAL = new bootstrap.Modal('#picturesModal'),
    PICTURES_FORM = document.getElementById('picturesForm'),
    ID_EVIDENCIA = document.getElementById('idEvidencia'),
    TYPE_IMAGE = document.getElementById('typeImage'),
    IMAGEN_MUESTRA1 = document.getElementById('imagenMuestra1'),
    IMAGEN_MUESTRA2 = document.getElementById('imagenMuestra2');

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

// Método del eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Detalles de la dupla';
    fillInformation();
    // métodos para mostrar los históricos de la dupla
    jornadasInicio5();
    jornadasFin5();
    fillAcordeonRequisicion();
    fillAcordeonHerramientas()
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, 'updateRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillInformation();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// * función para mostrar la información genal de la dupla 

const fillInformation = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    console.log(FORM)

    // Obtener el elemento donde se mostrará el estado
    const ESTADO_DUPLA = document.getElementById('estadoDupla'),
        HORA_DUPLA = document.getElementById('horaDupla');

    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Limpiar clases previas
        ESTADO_DUPLA.classList.remove('text-success', 'text-danger');

        // Determinar el mensaje y las clases según el estado
        if (DATA.dataset.estado_dupla == 1) {
            ESTADO_DUPLA.textContent = 'Jornada iniciada'
            ESTADO_DUPLA.classList.add('text-success')
        } else {
            ESTADO_DUPLA.textContent = 'Jornada no iniciada';
            ESTADO_DUPLA.classList.add('text-danger'); // Mensaje en rojo
        }

        // Actualizar otros datos de la dupla
        document.getElementById('usuarioDupla').textContent = DATA.dataset.usuario_dupla;
        document.getElementById('telefonoDupla').textContent = DATA.dataset.telefono_empresa_dupla;
        let type = (DATA.dataset.tipo_dupla == 1 || DATA.dataset.tipo_dupla == "1") ? 'Temporal' : 'Permanente';

        document.getElementById('tipoDupla').textContent = type;

        // Actualizar datos de los empleados
        document.getElementById('empleadoImagen1').src = SERVER_URL.concat('images/empleados/', DATA.dataset.imagen_empleado1);
        document.getElementById('nombreEmpleado1').textContent = DATA.dataset.nombre_empleado1 + ' ' + DATA.dataset.apellido_empleado1;
        document.getElementById('telefonoEmpleado1').textContent = DATA.dataset.telefono_personal_empleado1;

        document.getElementById('empleadoImagen2').src = SERVER_URL.concat('images/empleados/', DATA.dataset.imagen_empleado2);
        document.getElementById('nombreEmpleado2').textContent = DATA.dataset.nombre_empleado2 + ' ' + DATA.dataset.apellido_empleado2;
        document.getElementById('telefonoEmpleado2').textContent = DATA.dataset.telefono_personal_empleado2;

        // todo //  Se cargan los botones con la ruta personalizada para la visualización de los historiales
        BUTTONS_HISTORIAL.innerHTML = `
        <a href="historial_jornadas.html?id=${DATA.dataset.id_dupla}" class="text-reset text-decoration-none">
            <button type="button" class="mx-4 py-4 btn btn-info">
                <h5 class="mb-0">Jornadas Laborales</h5>
            </button>
        </a>
        <a href="historial_detalle.html?id=${DATA.dataset.id_dupla}&typeHistory=${1}" class="text-reset text-decoration-none">
            <button type="button" class="mx-4 py-4 btn btn-info">
                <h5 class="mb-0">Historial requisiciones</h5>
            </button>
        </a>
        <a href="historial_detalle.html?id=${DATA.dataset.id_dupla}&typeHistory=${2}" class="text-reset text-decoration-none">
            <button type="button" class="mx-4 py-4 btn btn-info">
                <h5 class="mb-0">Historial Herramientas</h5>
            </button>
        </a>`;
    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        BUTTONS_HISTORIAL.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h3> Error al cargar el historial</h3>
            </div>
        </div>`;
        document.getElementById('mainTitle').textContent = DATA.error;
        document.getElementById('informacionDupla').innerHTML = `
        <div class="col-5 justify-content-center align-items-center">
        <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>`;
    }
}

/*
*   Función para preparar el formulario al momento de cambiar la constraseña.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openPassword = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));

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
    } else {
        sweetAlert(2, DATA.error, false);
    }
})

const openUpdate = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
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
        USUARIO_DUPLA.value = ROW.usuario_dupla;
        TELEFONO_DUPLA.value = ROW.telefono_empresa_dupla;

        // ? Se llena el formulario con información relacionada a los empleados
        CONTENIDO_EMPLEADO1.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado1}" width="200px"
        height="200px" class="rounded mx-auto d-block" 
        onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado1" name="idEmpleado1"> -->
        <h5 class="text-white mt-2">Nombre empleado</h5>
        <p class="card-title text-white">${ROW.nombre_empleado1}</p>
        <p class="card-title text-white">${ROW.apellido_empleado1}</p>
        `;
        CONTENIDO_EMPLEADO2.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado2}" width="200px"
        height="200px" class="rounded mx-auto d-block" onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado2" name="idEmpleado2"> -->
        <h5 class="text-white mt-2">Nombre empleado</h5>
        <p class="card-title text-white">${ROW.nombre_empleado2}</p>
        <p class="card-title text-white">${ROW.apellido_empleado2}</p>
        `;

        fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado1', parseInt(ROW.id_empleado1));
        fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado2', parseInt(ROW.id_empleado2));
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

/*
* Función asíncrona para preparar un modal de confirmacion para una funcion de estado
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openState = async () => {

    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cambiar el tipo de dupla?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Constante tipo objeto con los datos de la dupla seleccionada.
        const FORM = new FormData();
        FORM.append('idDupla', PARAMS.get('id'));

        // Petición para cambiar el estado del cliente
        const DATA = await fetchData(DUPLA_API, 'updateStatus', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            sweetAlert(1, DATA.message, true); // Mensaje de éxito
            fillInformation(); // Recargar la tabla para visualizar los cambios
        } else {
            sweetAlert(1, 'Tipo cambiado con éxito', false); // Mensaje de error
            fillInformation(); // Recargar la tabla para visualizar los cambios
        }
    }
}

// * función asíncrona para mostrar los últimos 5 registros de los inicios de jornadas laborales de una dupla
// * Parámetros: ninguno.
// * Retorno: ninguno.
const jornadasInicio5 = async () => {
    // se inicializa el contenido del acordeón
    INICIO_JORNADAS.innerHTML = '';
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    console.log(FORM)
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readBy5Inicio', FORM);
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            INICIO_JORNADAS.innerHTML += `
<div class="accordion-item">
    <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#itemHerramienta${row.id_trabajo_historial}" aria-expanded="false"
            aria-controls="itemHerramienta${row.id_trabajo_historial}">
            Jornada registrada el: ${row.fecha_trabajo_historial}
        </button>
    </h2>
    <div id="itemHerramienta${row.id_trabajo_historial}" class="accordion-collapse collapse"
        data-bs-parent="#iniciosJornadas">
        <div class="accordion-body">
            <div class="row">
                <div class="col-6">
                    <h5>Código Dupla</h5>
                    <p class="card-title">${row.codigo_dupla}</p>
                </div>
                <div class="col-6">
                    <h5>Fecha y hora de finalización de jornada</h5>
                    <p class="card-text">${row.fecha_trabajo_historial}</p>
                </div>
            </div>
        </div>
    </div>
</div>`;
        });
    } else {
        INICIO_JORNADAS.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Error al cargar el historial</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
    }
}

// * función asíncrona para mostrar los últimos 5 registros de las finalizaciones de jornadas laborales de una dupla
// * Parámetros: ninguno.
// * Retorno: ninguno.
const jornadasFin5 = async () => {
    // se inicializa el contenido del acordeón
    FINALIZACION_JORNADAS.innerHTML = ''; INICIO_JORNADAS.innerHTML = '';
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    console.log(FORM)
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readBy5Fin', FORM);
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            FINALIZACION_JORNADAS.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#itemHerramienta${row.id_trabajo_historial}" aria-expanded="false"
                        aria-controls="itemHerramienta${row.id_trabajo_historial}">
                        Jornada registrada el: ${row.fecha_trabajo_historial}
                    </button>
                </h2>
                <div id="itemHerramienta${row.id_trabajo_historial}" class="accordion-collapse collapse"
                    data-bs-parent="#finalizacionJornada">
                    <div class="accordion-body">
                        <div class="row">
                            <div class="col-6">
                                <h5>Código Dupla</h5>
                                <p class="card-title">${row.codigo_dupla}</p>
                            </div>
                            <div class="col-6">
                                <h5>Fecha y hora de finalización de jornada</h5>
                                <p class="card-text">${row.fecha_trabajo_historial}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        FINALIZACION_JORNADAS.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Error al cargar el historial</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
    }
}

// * función asíncrona para mostrar los últimos 10 pedidos de requisiciones realizados por una dupla
// * Parámetros: id.
// * Retorno: ninguno.
const fillAcordeonRequisicion = async () => {
    // se inicia el contenido del acordeón
    REQUISICIONES_HISTORIAL.innerHTML = '';
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    console.log(FORM)
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readBy10', FORM);
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
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
            REQUISICIONES_HISTORIAL.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#itemHerramienta${row.id_requisicion}XX" aria-expanded="false"
                        aria-controls="itemHerramienta${row.id_requisicion}XX">
                        Requisición generada el: ${row.fecha_requisicion}
                    </button>
                </h2>
                <div id="itemHerramienta${row.id_requisicion}XX" class="accordion-collapse collapse"
                    data-bs-parent="#requisicionesHistorial">
                    <div class="accordion-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <h5>Código Dupla</h5>
                                <p class="card-title">${row.usuario_dupla}</p>
                                <h5>Fecha de generación</h5>
                                <p class="card-text">${row.fecha_requisicion}</p>
                                <h5>Estado requisición</h5>
                                <p class='text-${STATE}</p>

                            </div>
                            <div class="col-6">
                                <h5>Acciones</h5>
                                <button type="button" class="btn btn-secondary" onclick="showDetails(${row.id_requisicion}, 1)">
                                    <h4>
                                        <i class="bi bi-eye-fill"></i>
                                    </h4>
                                </button>
                                <button type="button" class="btn btn-primary" onclick="openReport(${row.id_requisicion})" ${alertaBoton}>
                                    <h4>
                                        <i class='bi bi-filetype-pdf'></i>
                                    </h4>
                                </button>
                                <span class="align-middle fs-4">${alerta}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        REQUISICIONES_HISTORIAL.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Error al cargar el historial</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
    }
};

// * función asíncrona para mostrar los últimos 10 pedidos de herramientas realizados por una dupla
// * Parámetros: id.
// * Retorno: ninguno.
const fillAcordeonHerramientas = async () => {
    // se inicia el contenido del acordeón
    HERRAMIENTAS_HISTORIAL.innerHTML = '';
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    console.log(FORM)
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'readBy10', FORM);
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
            let STATE = '';
            switch (row.estado_pedido_herramienta) {
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
            HERRAMIENTAS_HISTORIAL.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#itemHerramienta${row.id_pedido_herramienta}XXa" aria-expanded="false"
                        aria-controls="itemHerramienta${row.id_pedido_herramienta}XXa">
                        Pedido Herramienta generada el: ${row.fecha_pedido_herramienta}
                    </button>
                </h2>
                <div id="itemHerramienta${row.id_pedido_herramienta}XXa" class="accordion-collapse collapse"
                    data-bs-parent="#herramientasHistorial">
                    <div class="accordion-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <h5>Código Dupla</h5>
                                <p class="card-title">${row.usuario_dupla}</p>
                                <h5>Fecha de generación</h5>
                                <p class="card-text">${row.fecha_pedido_herramienta}</p>
                                <h5>Estado Pedido</h5>
                                <p class='text-${STATE}</p>

                            </div>
                            <div class="col-6">
                                <h5>Acciones</h5>
                                <button type="button" class="btn btn-secondary" onclick="showDetails(${row.id_pedido_herramienta}, 2)">
                                    <h4>
                                        <i class="bi bi-eye-fill"></i>
                                    </h4>
                                </button>
                                <span class="align-middle fs-4">${alerta}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        HERRAMIENTAS_HISTORIAL.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Error al cargar el historial</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
    }
};

// *función asíncrona para llenar la tabla de los detalles de la requisición con los registros 
// * Parámetros: id.
// * Retorno: ninguno.
const showDetails = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    // se comprueba que la acción que se desea realizar (visualizar o editar)
    switch (botones) {
        case 1:
            FORM.append('idRequisicion', id);
            // se inicializa la tabla de materiales
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
            break;
        case 2:
            FORM.append('idPedido', id);
            // se inicializa la tabla de herramientas
            MODAL_HEADER.innerHTML = `
            <h1 class="modal-title fs-5" id="modalTitle">Herramientas solicitadas</h1>
            <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
            data-bs-dismiss="modal" aria-label="Close">
            </button>`;
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>`;
            break;
        default:
            break;
    }
    let DATA = null;
    switch (botones) {
        case 1:
            // Petición para obtener los registros disponibles.
            DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
            if (DATA.status) {
                const MODAL_TABLE_BODY = document.getElementById('modalTableBody');
                DETAILS_MODAL.show();
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
                    MODAL_TABLE_BODY.innerHTML += `
            <tr>                    
                <td>${row.nombre_material}</td>
                <td>${row.cantidad_total} ${row.unidad_contenido} ${alertaMaterial}</td>
            </tr>`;
                });
            } else {
                sweetAlert(4, DATA.error, true);
                DETAILS_MODAL.show();
            }
            break;
        case 2:
            // Petición para obtener los registros disponibles.
            DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'readByOrder', FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                const MODAL_TABLE_BODY = document.getElementById('modalTableBody');
                DETAILS_MODAL.show();
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
            }
            else {
                sweetAlert(4, DATA.error, true);
                DETAILS_MODAL.show();
            }
            break;
        default:
            break;
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
};