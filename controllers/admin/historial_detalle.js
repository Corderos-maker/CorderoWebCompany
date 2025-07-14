// ? constantes para solicitud de apis
const REQUISICION_API = 'services/admin/requisicion.php';
const EVIDENCIA_HERRAMIENTA_API = 'services/admin/evidencia.php';
const PEDIDOS_HERRAMIENTAS_API = 'services/admin/pedido_herramienta.php';
// constantes para establecer los titulo y la descripción de la pagina.
const TYPE_TITLE = document.getElementById('typeTitle'),
    TYPE_MESSAGE = document.getElementById('typeMessage');
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// constante del modal de tabla de materiales
const DETAILS_MODAL = new bootstrap.Modal('#detailsModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_DETAIL_TITLE = document.getElementById('modalTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes para el manejo de imágenes de evidencia
const PICTURES_MODAL = new bootstrap.Modal('#picturesModal'),
    PICTURES_FORM = document.getElementById('picturesForm'),
    ID_EVIDENCIA = document.getElementById('idEvidencia'),
    TYPE_IMAGE = document.getElementById('typeImage'),
    IMAGEN_MUESTRA1 = document.getElementById('imagenMuestra1'),
    IMAGEN_MUESTRA2 = document.getElementById('imagenMuestra2');
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
//  se establece el tipo de historial en una constante
const objetivo = PARAMS.get('typeHistory');

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    loadInformation();
    fillButtons();
    // ? llama la función para llenar la tabla con los registros
    fillTable(1);
});

/*
*   Función asíncrona para llenar las opciones de búsqueda code los registros disponibles.
*   Parámetros: ninguno
*   Retorno: ninguno.
*/
const fillButtons = () => {
    SEARCH_FORM.innerHTML = `
    <a href="detalle_dupla.html?id=${PARAMS.get('id')}" class="btn btn-success mx-3 my-4">
        <h4>Información de la dupla <i class="bi bi-info-circle"></i></h4> 
    </a>
    <div class="dropend btn">
        <a class="btn btn-secondary dropdown-toggle fs-3" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filtrar
        </a>

        <ul class="dropdown-menu">
            <li><a class="dropdown-item" onclick="fillTable(1)">Toda la información</a></li>
            <li><a class="dropdown-item" onclick="fillTable(2)">Pendientes</a></li>
            <li><a class="dropdown-item" onclick="fillTable(3)">Procesando</a></li>
            <li><a class="dropdown-item" onclick="fillTable(4)">Aprobada</a></li>
            <li><a class="dropdown-item" onclick="fillTable(5)">Anulada</a></li>
        </ul>
    </div>

    `;
};

// ? función para establecer la información de la pagina dependiendo del tipo de historial
const loadInformation = () => {
    //  se establece el tipo de historial en una constante
    const type = PARAMS.get('typeHistory');
    switch (type) {
        case "1":
            TYPE_TITLE.innerHTML = `<i class="bi bi-clock-history"></i>Historial Requisiciones (Acciones)`;
            TYPE_MESSAGE.innerHTML = `Esta es la sección para poder administrar las requisiciones de una dupla especifica.
                    Que fueron alteradas o modificadas. Se puede visualizar
                    las requisiciones aprobadas, rechazadas, en espera o canceladas. También se puede
                    generar un documento PDF.`;
            break;
        case "2":
            TYPE_TITLE.innerHTML = `<i class="bi bi-clock-history"></i>Historial Herramientas (Acciones)</h3>`;
            TYPE_MESSAGE.innerHTML = `Esta es la sección para poder administrar los pedidos de materiales de una dupla especifica.
                    Que fueron modificados o creados. Se puede visualizar
                    los pedidos aprobadas, rechazadas, en espera o canceladas. También se puede
                    generar un documento PDF.`;
            break;
        default:
            break;
    }
};

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: type (llena la tabla dependiendo si son herramientas o requisiciones)
* .
*   Retorno: ninguno.
*/
const fillTable = async (type) => {
    // declaración de variables 
    let action = '';
    let target_api = '';
    let alerta = '';
    let alertaBoton = '';
    let STATE = '';
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    switch (type) {
        case 1:
            action = 'readAllDuplaHistory';
            break;
        case 2:
            action = 'readByPendiente';
            break;
        case 3:
            action = 'readByProcesando';
            break;
        case 4:
            action = 'readByAprobada';
            break;
        case 5:
            action = 'readByAnulada';
            break;
        default:
            action = 'readAllDupla'
            sweetAlert(4, 'Error al cargar información', true);
            break;
    }
    // Se verifica el objetivo al que se tiene que realizar la petición
    switch (objetivo) {
        case "1":
            target_api = REQUISICION_API;
            optionDetail = 1;
            break;
        case "2":
            target_api = PEDIDOS_HERRAMIENTAS_API
            optionDetail = 2;
            break;
        default:
            break;
    }
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(target_api, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        DATA.dataset.forEach(row => {
            if (row.tiene_exceso > 0) {
                alerta = `<span class="badge bg-danger ms-2">¡Exceso de materiales!</span>`;
                alertaBoton = 'disabled';
            }
            else {
                alertaBoton = '';
                alerta = '';
            }
            switch (row.estado_historial) {
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
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <tr>
                <td class='text-${STATE}</td>
                <td>${row.fecha_historial}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showDetails(${row.id_historial}, ${optionDetail})">
                        <h3><i class="bi bi-eye-fill"></i></h3>
                    </button>
                    ${objetivo === "1" ? `
                    <button type="button" class="btn btn-primary" onclick="openReport(${row.id_historial})" ${alertaBoton}>
                        <h3><i class='bi bi-filetype-pdf'></i></h3>
                    </button>
                    ` : ''}
                    <span class="align-middle fs-4">${alerta}</span>
                </td>
            </tr>`;
        });
    } else {
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