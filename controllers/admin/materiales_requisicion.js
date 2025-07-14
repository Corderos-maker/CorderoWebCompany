// ? constantes para completar las rutas api
const MATERIALES_API = 'services/admin/materiales.php';
const CONTENIDO_API = 'services/admin/contenido.php';
const REQUISICION_API = 'services/admin/requisicion.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer los datos de la requisición
const REQUISICION_BODY = document.getElementById('tableBody');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('registrosMaterial'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_BUTTON = document.getElementById('modalButton'),
    MODAL_TITLE = document.getElementById('modalTitle');
// constantes para mostrar y preparar el modal para mostrar los datos de la requisición
// constante del modal de tabla de materiales
const REQUISICION_MODAL = new bootstrap.Modal('#requisicionModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_REQUISICION_TITLE = document.getElementById('modalRequisicionTitle'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes para guardar o editar un registro
const SAVE_FORM = document.getElementById('saveForm');
// Constantes para establecer los elementos del formulario de guardar.
const ID_MATERIAL = document.getElementById('idMaterial'),
    ID_REQUISICION = document.getElementById('idRequisicion'),
    NOMBRE_MATERIAL = document.getElementById('nombreMaterial'),
    DESCRIPCION_MATERIAL = document.getElementById('descripcionMaterial'),
    UNIDADES_MATERIAL = document.getElementById('unidadMaterial'),
    CANTIDAD_MATERIAL = document.getElementById('cantidadMaterial');
//  Constante para establecer el formulario de cambiar material.
const ITEM_FORM = document.getElementById('itemForm');
// constantes para el modal de cambiar cantidad del material
const ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('actuallizarmaterial'),
    ID_DETALLE_MATERIAL = document.getElementById('idDetalleMaterial'),
    UPDATE_BUTTON = document.getElementById('updateButton'),
    MODAL_MATERIAL = document.getElementById('materialName');
// constantes para los botones de categoría de bodega
const BOTON_GENERAL = document.getElementById('botonGeneral'),
    BOTON_USO_COTIDIANO = document.getElementById('botonUsoCotidiano'),
    BOTON_CL200 = document.getElementById('botonCL200'),
    BOTON_ACOMETIDA_ESPECIAL = document.getElementById('botonAcomedidaEspecial'),
    BOTON_SUBTERRANEO = document.getElementById('botonSubterraneo'),
    BOTON_ANTI_TELE = document.getElementById('botonAntiTele');

// Obtener todos los botones relevantes
const botones = [
    BOTON_GENERAL,
    BOTON_USO_COTIDIANO,
    BOTON_CL200,
    BOTON_ACOMETIDA_ESPECIAL,
    BOTON_SUBTERRANEO,
    BOTON_ANTI_TELE
];

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función para cargar la tabla de contenido
    readAllTable(null, 1);
    readRequisicion();
});

// Función para resetear todos los botones a 'btn-secondary'
function resetearBotones() {
    botones.forEach(boton => {
        boton.classList.remove('btn-success', 'disabled');
        boton.classList.add('btn-secondary');
    });
}

// Función para activar un botón específico
function activarBoton(boton) {
    resetearBotones();
    boton.classList.remove('btn-secondary');
    boton.classList.add('btn-success', 'disabled');
}

// Método del evento para cuando se envía el formulario de buscar.
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
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(REQUISICION_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false);
        SAVE_MODAL.hide();
        // sweetAlert(1, DATA.message, false, 'cart.html');
    } else if (DATA.session) {
        sweetAlert(2, DATA.error, false);
    } else {
        sweetAlert(3, DATA.error, true);
        // sweetAlert(3, DATA.error, true, 'login.html');
    }
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
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// ? función asíncrona para ordenar los registros de diferentes formas que el  usuario  requiera
const readAllTable = async (form = null, buscador) => {

    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';

    let action = form ? 'searchRows' : 'readAll'; // Valor por defecto

    // Si el buscador tiene un valor válido (1-4), sobrescribe la acción
    if (buscador >= 1 && buscador <= 10) {
        switch (buscador) {
            case 1:
                action = 'readAll';
                break;
            case 5:
                action = 'readAll';
                activarBoton(BOTON_GENERAL);
                break;
            case 6:
                action = 'readByCategory1';
                activarBoton(BOTON_USO_COTIDIANO);
                break;
            case 7:
                action = 'readByCategory2';
                activarBoton(BOTON_CL200);
                break;
            case 8:
                action = 'readByCategory3';
                activarBoton(BOTON_ACOMETIDA_ESPECIAL);
                break;
            case 9:
                action = 'readByCategory4';
                activarBoton(BOTON_SUBTERRANEO);
                break;
            case 10:
                action = 'readByCategory5';
                activarBoton(BOTON_ANTI_TELE);
                break;
            default:
                // Opcional: Resetear todos si no hay coincidencia
                resetearBotones();
                BOTON_GENERAL.classList.add('btn-success'); // Por defecto
                break;
        }
    }

    const DATA = await fetchData(MATERIALES_API, action, form);

    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            let info;
            // ? icono y texto para clasificar la categoría
            switch (row.categoria_material) {
                case 'Uso habitual':
                    info = '<i class="bi bi-house-door"></i> Uso habitual';
                    break;
                case 'Material para CL200':
                    info = '<i class="bi bi-lightning-charge"></i> Material para CL200';
                    break;
                case 'Acometida especial':
                    info = '<i class="bi bi-lightning-fill"></i> Acometida especial';
                    break;
                case 'Subterráneo':
                    info = '<i class="bi bi-minecart-loaded"></i> Subterráneo';
                    break;
                case 'Antihurto y telegestión':
                    info = '<i class="bi bi-shield-lock"></i> Antihurto y telegestión';
                    break;
                default:
                    break;
            }
            if (row.cantidad_minima_material == 0) {
                estadoAlerta = `Cantidad minima no definida`;
            } else {
                estadoAlerta = row.cantidad_minima_material + ' ';
            }

            if (row.visibilidad_material == 1) {
                estadoVisible = 'Material visible';
                claseVisible = 'bg-success';
                estadoFormulario = '';
            } else {
                estadoVisible = 'Material no visible';
                claseVisible = 'bg-warning text-dark';
                estadoFormulario = 'disabled';
            }

            cantidadContenido = Math.ceil(row.cantidad_material / row.cantidad_contenido);

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="card mb-5">
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div class="col-lg-3 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/material/${row.imagen_material}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/images/error/404material.png';">
                        </div>
                        <div class="col-lg-3 col-md-8 col-sm-12 mb-4"> <!-- Añadí mb-4 para margen inferior -->
                            <div class="d-flex flex-column align-items-center text-center ">
                                <h5>Nombre del material</h5>
                                <p class="card-title">${row.nombre_material}</p>
                                
                                <h5>Código Material</h5>
                                <p class="card-text">${row.codigo_material}</p>
                            
                                <h5>Cantidad contenido</h5>
                                <p class="card-text">Sistema de medidas: ${row.cantidad_contenido} ${row.unidad_contenido}</p>
                                <p class="card-text">Cantidad de ${row.nombre_contenido}: ${cantidadContenido}</p>
                                
                            </div>
                        </div>
                        
                        <!-- Segunda columna -->
                        <div class="col-lg-3 col-md-8 col-sm-12">
                            <div class="d-flex flex-column align-items-center text-center "> 
                            
                                <h5>Cantidad actual material</h5>
                                <p class="card-text">${row.cantidad_material} ${row.unidad_contenido}</p>

                                <h5>Material necesario para solicitud</h5>
                                <p class="card-text">${estadoAlerta} ${row.unidad_contenido}</p>
                                

                                <h5>Registro alterado por:</h5>
                                <p class="card-text">${row.nombre_administrador} ${row.apellido_administrador}</p>
                            </div>
                        </div>

                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column ">
                                <div class="round bg-info rounded-3 text-dark mb-2">
                                    <h5 class="card-text py-2 px-2">${info}
                                    </h5>
                                </div>
                                <div class="round ${claseVisible} rounded-3 mb-2">
                                    <h5 class="card-text py-2 px-2">
                                        ${estadoVisible}
                                    </h5>
                                </div>
                                <fieldset ${estadoFormulario}>
                                    <button class="btn btn-primary mb-2"
                                    onclick="orderMaterial(${row.id_material})">
                                    <h4><i class="bi bi-clipboard-plus-fill"></i> Agregar Material</h4>
                                    </button>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
            <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>
        `
        sweetAlert(4, DATA.error, true);
    }
}

// * función para mostrar el estado actual de la requisición
const readRequisicion = async () => {
    // Se define un objeto con los datos de la categoría seleccionada.  
    const FORM = new FormData();
    FORM.append('idRequisicion', PARAMS.get('id'));
    // Se realiza una petición para obtener los datos de la requisición.
    const DATA = await fetchData(REQUISICION_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {

        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        let alerta = '';
        if (ROW.tiene_exceso > 0) {
            alerta = `<span class="badge bg-danger ms-2">¡Exceso de materiales!</span>`;
            alertaBoton = 'disabled';
        }
        else {
            alertaBoton = '';
            alerta = '';
        }
        console.log(alertaBoton);
        REQUISICION_BODY.innerHTML += `
                <tr>
                <td>${ROW.usuario_dupla}</td>
                <td>${ROW.fecha_requisicion}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showMaterials(${ROW.id_requisicion},1)">
                        <h4>
                            <i class="bi bi-eye-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-info" onclick="showMaterials(${ROW.id_requisicion}, 2)">
                        <h4>
                            <i class="bi bi-pencil-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-success" onclick="approveRequisicion(${ROW.id_requisicion})" ${alertaBoton}>
                        <h4>
                            <i class="bi bi-check-lg"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-primary" onclick="openReport(${ROW.id_requisicion})" ${alertaBoton}>

                        <h4>
                            <i class='bi bi-filetype-pdf'></i>
                        </h4>
                    </button>
                    <span class="align-middle fs-4">${alerta}</span>
                </td>
            </tr>
            `;
    }
    else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        sweetAlert(2, DATA.error, false);
    }
}


// *función asíncrona para llenar la tabla con los registros 
const showMaterials = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    MODAL_BODY.innerHTML = ``;
    switch (botones) {
        case 1:
            MODAL_BODY.innerHTML = `
            <thead>
                <tr id="tableColumns">
                    <th>MATERIAL</th>
                    <th>CANTIDAD</th>
                </tr>
            </thead>
            <tbody id="modalTableBody"></tbody>
            `;
            break;
        case 2:
            MODAL_BODY.innerHTML = `
            <thead>
                <tr id="tableColumns">
                    <th>MATERIAL</th>
                    <th>CANTIDAD</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
            <tbody id="modalTableBody"></tbody>
            `;
            break;
        default:
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
    if (DATA.status) {
        const MODAL_TABLE_BODY = document.getElementById('modalTableBody');

        REQUISICION_MODAL.show();
        switch (botones) {
            case 1:
                // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                DATA.dataset.forEach(row => {
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total} ${row.unidad_contenido}</td>
                </tr>
            `;
                });
                break;
            case 2:
                // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                DATA.dataset.forEach(row => {
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total} ${row.unidad_contenido}</td>
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
                });
                break;
            default:
                break;
        }
    } else {
        sweetAlert(4, DATA.error, true);
        REQUISICION_MODAL.show();
    }

}

// * función asíncrona para llenar la tabla para alterar la cantidad de
// * materiales de cada requisición
const openUpdate = (id, quantity, name, material) => {
    // se oculta el primer modal para darle pase al segundo modal
    REQUISICION_MODAL.hide();
    if (id == null && quantity == null) {
        console.log('error en un valor null');
    } else {
        // se abre el segundo modal con el contendió
        ITEM_MODAL.show();
        ID_DETALLE_MATERIAL.value = material;
        document.getElementById('materialName').textContent = name;
        document.getElementById('idDetalle').value = id;
        CANTIDAD_ACTUALIZADA_MATERIAL.value = quantity;
        console.log('id: ' + id + ' cantidad: ' + quantity + ' nombre: ' + name);
    }
}

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar un material de la requisición.
*   Parámetros: id (identificador del material).
*   Retorno: ninguno.
*/
async function openDeleteMaterial(id, idRequisicion, botones) {
    const RESPONSE = await confirmAction('¿Está seguro de remover la herramienta?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'deleteMaterial', FORM);
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Vuelve a mostrar los materiales actualizados en el modal
            showMaterials(idRequisicion, botones);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// función para modal de solicitud de material
const orderMaterial = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idMaterial', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_REQUISICION.value = PARAMS.get('id');
        ID_MATERIAL.value = ROW.id_material;
        NOMBRE_MATERIAL.textContent = ROW.nombre_material;
        DESCRIPCION_MATERIAL.textContent = ROW.descripcion_material;
        UNIDADES_MATERIAL.textContent = ROW.unidad_contenido;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

['input', 'change'].forEach(eventType => {
    CANTIDAD_MATERIAL.addEventListener(eventType, async (event) => {
        // ...tu lógica de validación...
        const FORM = new FormData();
        FORM.append('idMaterial', ID_MATERIAL.value);
        const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
        if (DATA.status) {
            const ROW = DATA.dataset;
            if (Number(CANTIDAD_MATERIAL.value) > Number(ROW.cantidad_material)) {
                sweetAlert(2, 'La cantidad solicitada no puede ser mayor a ' + Number(ROW.cantidad_material), false);
                MODAL_BUTTON.disabled = true;
            } else {
                MODAL_BUTTON.disabled = false;
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
});

['input', 'change'].forEach(eventType => {
    CANTIDAD_ACTUALIZADA_MATERIAL.addEventListener(eventType, async (id) => {
        const FORM = new FormData();
        FORM.append('idMaterial', ID_DETALLE_MATERIAL.value);
        const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
        if (DATA.status) {
            const ROW = DATA.dataset;
            if (Number(CANTIDAD_ACTUALIZADA_MATERIAL.value) > Number(ROW.cantidad_material)) {
                sweetAlert(2, 'La cantidad solicitada no puede ser mayor a ' + Number(ROW.cantidad_material), false);
                UPDATE_BUTTON.disabled = true;
            } else {
                UPDATE_BUTTON.disabled = false;
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
});


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