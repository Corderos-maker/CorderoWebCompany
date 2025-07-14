// ? constantes para completar las rutas api
const MATERIALES_API = 'services/admin/materiales.php';
const TRABAJO_DUPLA_API = 'services/admin/trabajo_dupla.php'
const REQUISICION_API = 'services/admin/requisicion.php';
// ? variables para poder mostrar los materiales con falta de stock y las requisiciones recientes.
const ITEM_MATERIAL = document.getElementById('itemMaterial'),
    REQUISICIONES_DUPLA = document.getElementById('requisicionDupla');
// ? variables para mostrar a los últimos empleados que iniciaron y terminaron una jornada laboral
const JORNADAS_EMPLEADOS = document.getElementById('jornadasEmpleados'),
    INICIO_BOTON = document.getElementById('inicioBoton'),
    FINALIZACION_BOTON = document.getElementById('finalizacionBoton');
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

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    MAIN_TITLE.textContent = 'Pagina principal';
    // Llamada a la función para mostrar el encabezado y bar del documento.
    loadTemplate();
    // Llamada a la función para mostrar los últimos 5 inicios de jornada laboral.
    materialesFaltantes();
    requisicionesRecientes();
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

        requisicionesRecientes();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// * función asíncrona para mostrar los últimos 5 inicios de jornada laboral o las finalizaciones.
// * Parámetros: ninguno.
// * Retorno: ninguno.
const inicioJornadas = async () => {
    JORNADAS_EMPLEADOS.innerHTML = '';
    INICIO_BOTON.classList.add('disabled');
    FINALIZACION_BOTON.classList.remove('disabled');
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readByActive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header text-center">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#empleadoInformacion${row.id_trabajo_dupla}" aria-expanded="false"
                    aria-controls="empleadoInformacion${row.id_trabajo_dupla}">
                    <h4>CÓDIGO DUPLA: ${row.usuario_dupla}</h4>
                </button>
            </h2>
            <div id="empleadoInformacion${row.id_trabajo_dupla}" class="accordion-collapse collapse"
                data-bs-parent="#jornadasEmpleados">
                <div class="accordion-body">
                    <div class="my-3">
                        <h5 class="text-warning">HORA INICIO</h5>
                        <p>${row.hora_inicio_trabajo_dupla ? row.hora_inicio_trabajo_dupla : '<span class="text-danger">No registrado</span>'}</p>
                        <h5>Nombre empleado1: </h5>
                        <p>
                            ${row.nombre_empleado1} ${row.apellido_empleado1}
                        </p>
                        <h5>Nombre empleado2: </h5>
                        <p>
                            ${row.nombre_empleado2} ${row.apellido_empleado2}
                        </p>
                    </div>
                    <a href="detalle_dupla.html?id=${row.id_dupla}" class="btn btn-success mt-2">
                        <h5><i class="bi bi-info-circle-fill"></i> Detalles de dupla</h5>
                    </a>
                </div>
            </div>
        </div>
`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

const finalizacionJornadas = async () => {
    JORNADAS_EMPLEADOS.innerHTML = '';
    FINALIZACION_BOTON.classList.add('disabled');
    INICIO_BOTON.classList.remove('disabled');
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readByInactive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
<div class="accordion-item">
    <h2 class="accordion-header text-center">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#empleadoInformacion${row.id_trabajo_dupla}" aria-expanded="false"
            aria-controls="empleadoInformacion${row.id_trabajo_dupla}">
            <h4>CÓDIGO DUPLA: ${row.usuario_dupla}</h4>
        </button>
    </h2>
    <div id="empleadoInformacion${row.id_trabajo_dupla}" class="accordion-collapse collapse"
            data-bs-parent="#jornadasEmpleados">
            <div class="accordion-body">
                <div class="my-3">
                    <h5 class="text-warning">HORA FINAL</h5>
                    <p>${row.hora_final_trabajo_dupla ? row.hora_final_trabajo_dupla : '<span class="text-danger">No registrado</span>'}</p>

                    <h5>Nombre empleado1: </h5>
                    <p>
                        ${row.nombre_empleado1} ${row.apellido_empleado1}
                    </p>
                    <h5>Nombre empleado2: </h5>
                    <p>
                        ${row.nombre_empleado2} ${row.apellido_empleado2}
                    </p>
                </div>
            </div>
        </div>
    </div>
`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// * función asíncrona para mostrar 5 registros de materiales con falta de stock y requisiciones.
// * Parámetros: ninguno.
// * Retorno: ninguno.
const materialesFaltantes = async () => {
    // se inicializa el contenido del acordeón
    ITEM_MATERIAL.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(MATERIALES_API, 'readByStock5');
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            if (row.cantidad_minima_material == 0) {
                estadoAlerta = `Cantidad minima no definida`;
            } else {
                estadoAlerta = row.cantidad_minima_material + ' ';
            }
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            ITEM_MATERIAL.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#itemMaterial${row.id_material}" aria-expanded="false" aria-controls="itemMaterial${row.id_material}">
                        ${row.nombre_material} 
                    </button>
                </h2>
                <div id="itemMaterial${row.id_material}" class="accordion-collapse collapse"
                    data-bs-parent="#itemMaterial">
                    <div class="accordion-body">
                        <div class="row">
                            <div class="col-6">
                                <h5>Descripción del material</h5>
                                <p class="card-title">${row.descripcion_material}</p>
                                <h5>Código Material</h5>
                                <p class="card-text">${row.codigo_material}</p>
                                <h5>Registro alterado por:</h5>
                                <p class="card-text">${row.nombre_administrador} ${row.apellido_administrador}
                                </p>
                            </div>
                            <div class="col-6">
                                <h5>Material necesario para solicitud</h5>  
                                <p class="card-text">${estadoAlerta} ${row.unidad_contenido}</p>
                                <h5>Cantidad actual material</h5>
                                <p class="card-text">${row.cantidad_material} ${row.unidad_contenido} <i class="bi bi-exclamation-octagon-fill text-danger"></i></p>
                                <h5>Fecha de alteración</h5>
                                <p class="card-text">${row.fecha_material}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        ITEM_MATERIAL.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Sin requisiciones pendientes</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
    }
}

const requisicionesRecientes = async () => {
    // Se inicializa el contenido de la tabla.
    REQUISICIONES_DUPLA.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readAll5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
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
            REQUISICIONES_DUPLA.innerHTML += `
                <div class="accordion-item text-center">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapse${row.id_requisicion}" aria-expanded="true" aria-controls="collapse${row.id_requisicion}">
                                Requisicion generada por "${row.usuario_dupla}" ${row.fecha_requisicion}
                            </button>
                        </h2>
                        <div id="collapse${row.id_requisicion}" class="accordion-collapse collapse" data-bs-parent="#requisicionDupla">
                            <div class="accordion-body">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <h5>Codigo Dupla</h5>
                                        ${row.usuario_dupla}
                                        <h5>fecha generada</h5>
                                        ${row.fecha_requisicion}
                                    </div>
                                    <div class="col-6">
                                        <h5>Acciones</h5>
                                        <button type="button" class="btn btn-secondary"
                                            onclick="showMaterials(${row.id_requisicion}, 1)">
                                            <h4>
                                                <i class="bi bi-eye-fill"></i>
                                            </h4>
                                        </button>
                                        <button type="button" class="btn btn-info"
                                            onclick="showMaterials(${row.id_requisicion}, 2)">
                                            <h4>
                                                <i class="bi bi-pencil-fill"></i>
                                            </h4>
                                        </button>
                                        <button type="button" class="btn btn-success"
                                            onclick="approveRequisicion(${row.id_requisicion})" ${alertaBoton}>
                                            <h4>
                                                <i class="bi bi-check-lg"></i>
                                            </h4>
                                        </button>
                                        <button type="button" class="btn btn-primary"
                                            onclick="openReport(${row.id_requisicion})" ${alertaBoton}>
                                            <h4>
                                                <i class='bi bi-filetype-pdf'></i>
                                            </h4>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });
    }
    else {
        REQUISICIONES_DUPLA.innerHTML += `
        <div class="card">
            <div class="card-body">
                <h3> Sin requisiciones pendientes</h3>
            </div>
        </div>
        `;
        sweetAlert(4, DATA.error, true);
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