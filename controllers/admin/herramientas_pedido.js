// Constantes para completar las rutas de la API.
const PEDIDOS_HERRAMIENTAS_API = 'services/admin/pedido_herramienta.php';
const HERRAMIENTA_API = 'services/admin/herramienta.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer los datos deL pedido
const PEDIDO_BODY = document.getElementById('tableBody');
// Constantes para establecer el contenido de la tabla.
const TABLE_HERRAMIENTAS = document.getElementById('herramientasTable'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_BUTTON = document.getElementById('modalButton'),
    MODAL_TITLE = document.getElementById('modalTitle');
// constantes para guardar o editar un registro
const SAVE_FORM = document.getElementById('saveForm'),
    ID_HERRAMIENTA = document.getElementById('idHerramienta'),
    ID_PEDIDO = document.getElementById('idPedido'),
    NOMBRE_HERRAMIENTA = document.getElementById('nombreHerramienta'),
    DESCRIPCION_HERRAMIENTA = document.getElementById('descripcionHerramienta'),
    CANTIDAD_HERRAMIENTA = document.getElementById('cantidadHerramienta');
// constante del modal de tabla de materiales
const PEDIDO_MODAL = new bootstrap.Modal('#pedidoModal'),
    MODAL_HEADER = document.getElementById('modalHeader'),
    MODAL_FOOTER = document.getElementById('modalFooter'),
    MODAL_BODY = document.getElementById('modalBody'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constantes para el modal de cambiar cantidad del material
const ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    ITEM_FORM = document.getElementById('itemForm'),
    CANTIDAD_ACTUALIZADA_HERRAMIENTA = document.getElementById('actualizarHerramienta'),
    ID_DETALLE_HERRAMIENTA = document.getElementById('idDetalleHerramienta'),
    UPDATE_BUTTON = document.getElementById('updateButton');
// constantes para los botones de categoría de bodega
const BOTON_GENERAL = document.getElementById('botonGeneral'),
    BOTON_MANUAL_LIGERA = document.getElementById('botonManualLigera'),
    BOTON_MANUAL_PESADA = document.getElementById('botonManualPesada'),
    BOTON_ELECTRICA = document.getElementById('botonElectrica'),
    BOTON_EPP = document.getElementById('botonEPP');
// Obtener todos los botones relevantes
const botones = [
    BOTON_GENERAL,
    BOTON_MANUAL_LIGERA,
    BOTON_MANUAL_PESADA,
    BOTON_ELECTRICA,
    BOTON_EPP
];

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

// ? método que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // ? se carga el encabezado y pie de la página
    loadTemplate();
    // ? se llena la tabla con los registros disponibles
    fillTable(null, 1);
    // ? muestra el estado del pedido actual
    readPedido();
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

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false);
        SAVE_MODAL.hide();
        readPedido();
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
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'updateDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo del formulario.
        ITEM_MODAL.hide();
        // Se muestra un mensaje de éxito.
    readPedido();
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null, type) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_HERRAMIENTAS.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    switch (type) {
        case 1:
            action = 'readAll';
            activarBoton(BOTON_GENERAL);
            break;
        case 2:
            action = 'readByLight';
            activarBoton(BOTON_MANUAL_LIGERA);
            break;
        case 3:
            action = 'readByHeavy';
            activarBoton(BOTON_MANUAL_PESADA);
            break;
        case 4:
            action = 'readByElectric';
            activarBoton(BOTON_ELECTRICA);
            break;
        case 5:
            action = 'readByEPP';
            activarBoton(BOTON_EPP);
            break;
        default:
            action = 'readAll';
            sweetAlert(4, 'Error al cargar la tabla', true);
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(HERRAMIENTA_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje de error
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // ? icono y texto para clasificar la categoría
            let categoria;
            switch (row.sub_manual_herramienta) {
                case 1:
                    categoria = '<i class="bi bi-wrench"></i> Manual ligera';
                    break;
                case 2:
                    categoria = '<i class="bi bi-hammer"></i> Manual pesada';
                    break;
                case 3:
                    categoria = '<i class="bi bi-shield-shaded"></i> EPP';
                    break;
                case "1":
                    categoria = '<i class="bi bi-wrench"></i> Manual ligera';
                    break;
                case "2":
                    categoria = '<i class="bi bi-hammer"></i> Manual pesada';
                    break;
                case "3":
                    categoria = '<i class="bi bi-shield-shaded"></i> EPP';
                default:
                    categoria = '<i class="bi bi-lightning-charge-fill"></i> Eléctrica';
                    break;
            }
            // ? icono y texto para clasificar la visibilidad de la herramienta
            if (row.visibilidad_herramienta == 1) {
                estadoVisible = 'Herramienta visible';
                claseVisible = 'bg-success';
            } else {
                estadoVisible = 'Herramienta no visible';
                claseVisible = 'bg-warning ';
            }
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_HERRAMIENTAS.innerHTML += `
            <div class="card  mb-5">
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div class="col-lg-3 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/herramientas/${row.imagen_herramienta}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/images/error/404Herramienta.png';">
                        </div>
                        <div class="col-lg-6 col-md-8 col-sm-12 mb-4"> <!-- Añadí mb-4 para margen inferior -->
                            <div class="d-flex flex-column align-items-center text-center ">
                                <h5>Nombre de la herramienta</h5>
                                <p class="card-title">${row.nombre_herramienta}</p>
                                
                                <h5>Descripción de la herramienta</h5>
                                <p class="card-text">${row.descripcion_herramienta}</p>
                                <h5>Cantidad actual herramientas</h5>
                                <p class="card-text">${row.cantidad_herramienta} </p>

                                <h5>Registro alterado por:</h5>
                                <p class="card-text">${row.alias_administrador}</p>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column ">
                                <div class="round bg-info rounded-3  mb-2">
                                    <h5 class="card-text py-2 px-2">${categoria}
                                    </h5>
                                </div>
                                <div class="round ${claseVisible} rounded-3 mb-2">
                                    <h5 class="card-text py-2 px-2">
                                        ${estadoVisible}
                                    </h5>
                                </div>
                                <fieldset ${claseVisible}>
                                    <button class="btn btn-primary mb-2"
                                    onclick="orderHerramienta(${row.id_herramienta})">
                                    <h4><i class="bi bi-clipboard-plus-fill"></i> Agregar Herramienta</h4>
                                    </button>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        })
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// función para modal de solicitud de herramienta
const orderHerramienta = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idHerramienta', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(HERRAMIENTA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PEDIDO.value = PARAMS.get('id');
        ID_HERRAMIENTA.value = ROW.id_herramienta;
        NOMBRE_HERRAMIENTA.textContent = ROW.nombre_herramienta;
        DESCRIPCION_HERRAMIENTA.textContent = ROW.descripcion_herramienta;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
// ? método para validad por lado del cliente un valor valido
CANTIDAD_HERRAMIENTA.addEventListener('input', () => {
    // Validar que la cantidad sea un número entero positivo
    if (CANTIDAD_HERRAMIENTA.value < 0) {
        CANTIDAD_HERRAMIENTA.value = 1; // Ajustar a 1 si es menor que 1
        sweetAlert(4, 'la cantidad tiene que ser mayor a 1', true);
    } else if (CANTIDAD_HERRAMIENTA.value > 2) {
        CANTIDAD_HERRAMIENTA.value = 2; // Ajustar a 2 si es mayor a 2
        // ? se muestra una alerta si la cantidad es mayor a 2
        sweetAlert(4, 'la cantidad tiene que ser menor a 2', true);
    }
});


// * función para mostrar el estado actual del pedido de herramientas
const readPedido = async () => {
    // Se define un objeto con los datos de la categoría seleccionada.  
    const FORM = new FormData();
    FORM.append('idPedido', PARAMS.get('id'));
    // Se realiza una petición para obtener los datos de la requisición.
    const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'readOne', FORM);
    if (DATA.status) {
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        let alerta = '';
        if (row.tiene_exceso > 0) {
            alerta = `<span class="badge bg-danger ms-2">¡Exceso de Herramientas!</span>`;
            alertaBoton = 'disabled';
        }
        else {
            alertaBoton = '';
            alerta = '';
        }
        console.log(alertaBoton);
        PEDIDO_BODY.innerHTML = `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.fecha_pedido_herramienta}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showHerramientas(${row.id_pedido_herramienta},1)">
                        <h4>
                            <i class="bi bi-eye-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-info" onclick="showHerramientas(${row.id_pedido_herramienta}, 2)">
                        <h4>
                            <i class="bi bi-pencil-fill"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-success" onclick="approvePedido(${row.id_pedido_herramienta})" ${alertaBoton}>
                        <h4>
                            <i class="bi bi-check-lg"></i>
                        </h4>
                    </button>
                    <button type="button" class="btn btn-primary" onclick="openReport(${row.id_pedido_herramienta})" ${alertaBoton} disabled>
                        <h4>
                            <i class='bi bi-filetype-pdf'></i>
                        </h4>
                    </button>
                    <span class="align-middle fs-4">${alerta}</span>
                </td>
            </tr>
            `;
    } else {
        sweetAlert(2, DATA.error, false);
    }
};

// *función asíncrona para llenar la tabla con los registros 
const showHerramientas = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // se inicializa la tabla de herramientas
    MODAL_BODY.innerHTML = ``;
    MODAL_HEADER.innerHTML = `<h1 class="modal-title fs-5" id="modalTitle">Herramientas solicitadas</h1>
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
        PEDIDO_MODAL.show();
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            if (row.cantidad_herramienta < row.cantidad_detalle_herramienta) {
                sweetAlert(3, 'Cantidad de herramientas del pedido superan la cantidad actual en bodega');
                MODAL_HEADER.innerHTML = `
                <h1 class="modal-title" id="modalTitle">herramientas solicitadas</h1>
                <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
                    data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="alert alert-danger" role="alert">
                    <h2 class="alert-heading">
                    <i class="bi bi-exclamation-octagon-fill"></i>
                    No hay suficientes herramientas en bodega para cumplir con el pedido!</h2>
                </div>`;
                alertaHerramienta = `
                    <i class="bi bi-exclamation-octagon-fill text-danger"></i>
                `;
            } else {
                MODAL_HEADER.innerHTML = `
                <h1 class="modal-title" id="modalTitle">Herramientas solicitadas</h1>
                <button type="button" class="btn-close position-absolute end-0 top-0 m-3"
                    data-bs-dismiss="modal" aria-label="Close"></button>`;
                alertaHerramienta = ``;
            }

            switch (botones) {
                case 1:
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_herramienta}</td>
                    <td>${row.cantidad_detalle_herramienta} ${alertaHerramienta}</td>
                </tr>
            `;
                    break;
                case 2:
                    MODAL_TABLE_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_herramienta}</td>
                    <td>${row.cantidad_detalle_herramienta} ${alertaHerramienta}</td>
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
        PEDIDO_MODAL.show();
    }
}


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
            window.open(`inicio.html`);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// * función asíncrona para llenar la tabla para alterar la cantidad de
// * herramientas de cada pedido
const openUpdate = (id, quantity, name, herramienta) => {
    // se oculta el primer modal para darle pase al segundo modal
    PEDIDO_MODAL.hide();
    if (id == null && quantity == null) {
        console.log('error en un valor null');
    } else {
        // se abre el segundo modal con el contendió
        ITEM_MODAL.show();
        ID_DETALLE_HERRAMIENTA.value = herramienta;
        document.getElementById('herramientaName').textContent = name;
        document.getElementById('idDetalle').value = id;
        CANTIDAD_ACTUALIZADA_HERRAMIENTA.value = quantity;
        console.log('id: ' + id + ' cantidad: ' + quantity + ' nombre: ' + name);
    }
}

// ? método para validad por lado del cliente un valor valido
CANTIDAD_ACTUALIZADA_HERRAMIENTA.addEventListener('input', () => {
    // Validar que la cantidad sea un número entero positivo
    if (CANTIDAD_ACTUALIZADA_HERRAMIENTA.value < 0) {
        CANTIDAD_ACTUALIZADA_HERRAMIENTA.value = 1; // Ajustar a 1 si es menor que 1
        sweetAlert(4, 'la cantidad tiene que ser mayor a 1', true);
    } else if (CANTIDAD_ACTUALIZADA_HERRAMIENTA.value > 2) {
        CANTIDAD_ACTUALIZADA_HERRAMIENTA.value = 2; // Ajustar a 2 si es mayor a 2
        // ? se muestra una alerta si la cantidad es mayor a 2
        sweetAlert(4, 'la cantidad tiene que ser menor a 2', true);
    }
});

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar un material de la requisición.
*   Parámetros: id (identificador del material).
*   Retorno: ninguno.
*/
async function openDeleteHerramienta(id, idPedido, botones) {
    const RESPONSE = await confirmAction('¿Está seguro de remover el material?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        const DATA = await fetchData(PEDIDOS_HERRAMIENTAS_API, 'deleteHerramienta', FORM);
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Vuelve a mostrar los materiales actualizados en el modal
            showHerramientas(idPedido, botones);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}