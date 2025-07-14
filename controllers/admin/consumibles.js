// ? constantes para completar las rutas api
const CONSUMIBLE_API = 'services/admin/consumibles.php',
    CATEGORIA_API = 'services/admin/categorias.php';
// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para mostrar el modal para actualizar la cantidad de los materiales.
const CONSUMIBLE_MODAL = new bootstrap.Modal('#consumibleModal'),
    ID_CONSUMIBLE_CANTIDAD = document.getElementById('idConsumibleCantidad'),
    TIPO_CONSUMIBLE_MODAL = new bootstrap.Modal('#TipoConsumibleModal');
// constantes para mostrar y preparar los datos PARA AGREGAR O RESTAR MATERIALES
const QUANTITY_FORM = document.getElementById('updateQuantityForm'),
    ID_TIPO_CONSUMIBLE_CANTIDAD = document.getElementById('idTipoConsumibleCantidad'),
    TITLE_TIPO_CONSUMIBLE = document.getElementById('TipoAltConsumible'),
    CANTIDAD_ACTUAL_CONSUMIBLE = document.getElementById('cantidadActualConsumible'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadActualizadaConsumible'),
    ALERTA_CANTIDAD = document.getElementById('alertaCantidad'),
    ACTUALIZAR_CONSUMIBLE = document.getElementById('actualizarConsumible');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_BUTTON = document.getElementById('modalButton');
//? constantes para poder mostrar la imagen seleccionada
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra');
// ? Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CONSUMIBLE = document.getElementById('idConsumible'),
    NOMBRE_CONSUMIBLE = document.getElementById('nombreConsumible'),
    DESCRIPCION_CONSUMIBLE = document.getElementById('descripcionConsumible'),
    LIMITE_CONSUMIBLE = document.getElementById('cantidadMinimaConsumible'),
    CANTIDAD_CONSUMIBLE = document.getElementById('cantidadConsumible'),
    IMAGEN_CONSUMIBLE = document.getElementById('imagenConsumible');

// se ejecuta un método al momento de cargar la pagina web
document.addEventListener('DOMContentLoaded', () => {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    // ? se agrega un encabezado y un pie de pagina
    loadTemplate();
    // Se carga la tabla con los registros disponibles.
    fillTable(1);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CONSUMIBLE.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CONSUMIBLE_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
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

// Método del evento para cuando se envía el formulario de guardar.
QUANTITY_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    if (tipoOperacionCantidad ==1) {
        action = 'addQuantity';
    } else {
        action = 'subtractQuantity';
    }
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(QUANTITY_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CONSUMIBLE_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        TIPO_CONSUMIBLE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable(1);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// método para verificar que la cantidad limite no sea mayor a la cantidad del consumible
LIMITE_CONSUMIBLE.addEventListener('input', function () {
    limite = parseInt(LIMITE_CONSUMIBLE.value);
    cantidad = parseInt(CANTIDAD_CONSUMIBLE.value);
    if (limite > cantidad) {
        // Si la cantidad limite es mayor a la cantidad del consumible, se muestra una alerta
        sweetAlert(2, 'La cantidad limite no puede ser mayor a la cantidad del consumible', false);
        statusModal(2); // Deshabilita el botón de guardar
    } else {
        statusModal(1); // Habilita el botón de guardar
    }
});


// ? función para mostrar la imagen del input en una etiqueta image
IMAGEN_CONSUMIBLE.addEventListener('change', function (event) {
    // Verifica si hay una imagen seleccionada
    if (event.target.files && event.target.files[0]) {
        // con el objeto FileReader lee el archivo seleccionado
        const reader = new FileReader();
        // Luego de haber leído la imagen seleccionada se nos devuelve un objeto de tipo blob
        // Con el método createObjectUrl de fileReader crea una url temporal para la imagen
        reader.onload = function (event) {
            // finalmente la url creada se le asigna el atributo de la etiqueta img
            IMAGEN_MUESTRA.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    MODAL_TITLE.textContent = 'Agregar Consumible';
    // habilita el modal
    statusModal(1);
    // * resetear los valores de cantidades
    SAVE_MODAL.show();
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(CATEGORIA_API, 'readAll', 'categoriaConsumible');
};

//  * función para habilitar el modal para alterar o crear un nuevo registros
const statusModal = (type) => {

    switch (type) {
        case 1:
            MODAL_BUTTON.innerHTML = `
                <i class="bi bi-file-earmark-plus-fill"></i> Guardar
            `;
            MODAL_BUTTON.disabled = false; // Habilitar el botón
            break;
        case 2:
            MODAL_BUTTON.disabled = true; // Deshabilitar el botón
            break;
        default:
            break;
    }
};

// ? función para validar desactivar el input del valor mínimo material
const statusAlert = (type) => {
    if (type == 1) {
        LIMITE_CONSUMIBLE.value = '0'; // Limpiar el valor del input
        LIMITE_CONSUMIBLE.readOnly = true; // Habilitar el input
        statusModal(1); // Habilitar el botón de guardar
    } else {
        LIMITE_CONSUMIBLE.readOnly = false; // deshabilitar el input
    }
}

// ? función para llenar la tabla con los datos de los consumibles
const fillTable = async (buscador, form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    let action = form ? 'searchRows' : 'readAll'; // Valor por defecto
    // Si el buscador tiene un valor válido (1-4), sobrescribe la acción
    if (buscador >= 1 && buscador <= 10) {
        switch (buscador) {
            case 1:
                action = 'readAll';
                break;
            default:
                break;
        }
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CONSUMIBLE_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            if (row.necesita_reposicion == 1) {
                cantidad = `<div class="round alert alert-danger rounded-3 mb-2" role="alert">
                                <i class="bi bi-exclamation-triangle-fill"></i> <strong class=''>¡Atención! Hay poca cantidad de material</strong>
                            </div>`;
                sweetAlert(3, 'consumible con poco stock');
            } else {
                cantidad = '';
            }
            if (row.cantidad_limite_consumible == 0) {
                estadoAlerta = `Cantidad minima no definida`;
            } else {
                estadoAlerta = row.cantidad_limite_consumible + ' ';
            }
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="card  mb-5">
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div class="col-lg-3 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/consumible/${row.imagen_consumible}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/images/error/404material.png';">
                        </div>
                        <div class="col-lg-3 col-md-8 col-sm-12 mb-4"> <!-- Añadí mb-4 para margen inferior -->
                            <div class="d-flex flex-column align-items-center text-center ">
                                <h5>Nombre del consumible</h5>
                                <p class="card-title">${row.nombre_consumible}</p>
                                
                                <h5>Descripción consumible</h5>
                                <p class="card-text">${row.descripcion_consumible}</p>
                                
                                <h5>Categoría consumible</h5>
                                <p class="card-text">${row.nombre_categoria}</p>
                            </div>
                        </div>
                        
                        <!-- Segunda columna -->
                        <div class="col-lg-3 col-md-8 col-sm-12">
                            <div class="d-flex flex-column align-items-center text-center "> 
                                <h5>Material necesario para solicitud</h5>
                                <p class="card-text">${estadoAlerta} </p>
                                
                                <h5>Cantidad actual consumible</h5>
                                <p class="card-text">${row.cantidad_consumible} </p>

                                <h5>Registro alterado por:</h5>
                                <p class="card-text">${row.alias_administrador}</p>
                            </div>
                        </div>

                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column ">
                                ${cantidad}

                                <button class="btn btn-outline-dark mb-2" onclick="openUpdate(${row.id_consumible})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-dark mb-2" onclick="openDelete(${row.id_consumible})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                                <button class="btn btn-outline-dark mb-2"
                                    onclick="openUpdateQuantity(${row.id_consumible})">
                                    <i class="bi bi-clipboard-plus-fill"></i> Editar Cantidad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        })
    } else {
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
            <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>
        `
        sweetAlert(4, DATA.error, true);
    }
}


// ? función para abrir el modal de actualización de un registro
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idConsumible', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CONSUMIBLE_API, 'readOne', FORM);
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar producto';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        statusModal(1);
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CONSUMIBLE.value = ROW.id_consumible;
        NOMBRE_CONSUMIBLE.value = ROW.nombre_consumible;
        DESCRIPCION_CONSUMIBLE.value = ROW.descripcion_consumible;
        LIMITE_CONSUMIBLE.value = ROW.cantidad_limite_consumible;
        CANTIDAD_CONSUMIBLE.value = ROW.cantidad_consumible;
        // Se establece la imagen del consumible.
        IMAGEN_MUESTRA.src = `${SERVER_URL}images/consumible/${ROW.imagen_consumible}`;
        fillSelect(CATEGORIA_API, 'readAll', 'categoriaConsumible', parseInt(ROW.id_categoria));
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// * Función asíncrona para preparar el formulario al momento de actualizar la cantidad de material
const openUpdateQuantity = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idConsumible', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CONSUMIBLE_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        CONSUMIBLE_MODAL.show();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CONSUMIBLE_CANTIDAD.value = ROW.id_consumible;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openQuantity = async (id, type) => {
    // <-- Guarda el tipo de operación
    tipoOperacionCantidad = type;
    // se inicializa el modal
    TITLE_TIPO_CONSUMIBLE.textContent = '';
    ACTUALIZAR_CONSUMIBLE.value = null;
    // se establece el titulo del modal dependiendo del tipo de acción
    switch (type) {
        case 1:
            // se muestra el titulo del modal para agregar cantidad
            TITLE_TIPO_CONSUMIBLE.textContent = 'Agregar cantidad';
            break;
        case 2:
            // se muestra el titulo del modal para restar cantidad
            TITLE_TIPO_CONSUMIBLE.textContent = 'Restar cantidad';
            break;
        default:
            break;
    }
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idConsumible', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CONSUMIBLE_API, 'readOne', FORM);
    if (DATA.status) {
        // Se muestra la caja de dialogo con su titulo
        const ROW = DATA.dataset;
        ID_TIPO_CONSUMIBLE_CANTIDAD.value = ROW.id_consumible;
        CANTIDAD_ACTUAL_CONSUMIBLE.textContent = ROW.cantidad_consumible;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

ACTUALIZAR_CONSUMIBLE.addEventListener('input', function () {
    const cantidadActual = parseInt(CANTIDAD_ACTUAL_CONSUMIBLE.textContent) || 0;
    const cantidadIngresada = parseInt(ACTUALIZAR_CONSUMIBLE.value);

    if (tipoOperacionCantidad === 2 && cantidadIngresada > cantidadActual) {
        sweetAlert(2, 'No puedes restar más de la cantidad actual', false);
        ACTUALIZAR_CONSUMIBLE.value = cantidadActual;
    } else {
        CANTIDAD_ACTUALIZADA_MATERIAL.textContent = cantidadActual + (tipoOperacionCantidad === 1 ? cantidadIngresada : -cantidadIngresada);
    }
});

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el consumible de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idConsumible', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CONSUMIBLE_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable(1);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}