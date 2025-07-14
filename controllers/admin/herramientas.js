// Constantes para completar las rutas de la API.
const HERRAMIENTA_API = 'services/admin/herramienta.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para mostrar el modal para actualizar la cantidad de los materiales.
const HERRAMIENTA_MODAL = new bootstrap.Modal('#herramientaModal'),
    ID_HERRAMIENTA_CANTIDAD = document.getElementById('idHerramientaCantidad'),
    TIPO_HERRAMIENTA_MODAL = new bootstrap.Modal('#TipoHerramientaModal');
// constantes para mostrar y preparar los datos PARA AGREGAR O RESTAR MATERIALES
const QUANTITY_FORM = document.getElementById('updateQuantityForm'),
    ID_TIPO_HERRAMIENTA_CANTIDAD = document.getElementById('idTipoHerramientaCantidad'),
    TITLE_TIPO_HERRAMIENTA = document.getElementById('TipoAltHerramienta'),
    CANTIDAD_ACTUAL_HERRAMIENTA = document.getElementById('cantidadActualHerramienta'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadActualizadaHerramienta'),
    ALERTA_CANTIDAD = document.getElementById('alertaCantidad'),
    ACTUALIZAR_HERRAMIENTA = document.getElementById('actualizarHerramienta');
// constantes para poder mostrar la imagen seleccionada
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_BUTTON = document.getElementById('modalButton');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_HERRAMIENTA = document.getElementById('idHerramienta'),
    NOMBRE_HERRAMIENTA = document.getElementById('nombreHerramienta'),
    DESCRIPCION_HERRAMIENTA = document.getElementById('descripcionHerramienta'),
    CATEGORIA_HERRAMIENTA = document.getElementById('categoriaHerramienta'),
    SUB_MANUAL_HERRAMIENTA0 = document.getElementById('subManualHerramienta0'),
    SUB_MANUAL_HERRAMIENTA1 = document.getElementById('subManualHerramienta1'),
    SUB_MANUAL_HERRAMIENTA2 = document.getElementById('subManualHerramienta2'),
    SUB_MANUAL_HERRAMIENTA3 = document.getElementById('subManualHerramienta3'),
    CANTIDAD_HERRAMIENTA = document.getElementById('cantidadHerramienta'),
    VISIBILIDAD_HERRAMIENTA = document.getElementById('visibilidadHerramienta'),
    IMAGEN_HERRAMIENTA = document.getElementById('imagenHerramienta');
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
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    // ? se carga el encabezado y pie de la página
    loadTemplate();
    // ? se llena la tabla con los registros disponibles
    fillTable(null, 1);;
});

// ? función para mostrar la imagen del input en una etiqueta image
IMAGEN_HERRAMIENTA.addEventListener('change', function (event) {
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
    // Se verifica la acción a realizar.
    (ID_HERRAMIENTA.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(HERRAMIENTA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable(null, 1);;
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Método del evento para cuando se envía el formulario de guardar.
QUANTITY_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    if (tipoOperacionCantidad == 1) {
        action = 'addQuantity';
    } else {
        action = 'subtractQuantity';
    }
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(QUANTITY_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(HERRAMIENTA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        TIPO_HERRAMIENTA_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable(null, 1);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// MÉTODO PARA ACTIVAR LAS OPCIONES  DE LA SUB CATEGORÍA MANUAL
CATEGORIA_HERRAMIENTA.addEventListener('change', () => {
    const selectedValue = CATEGORIA_HERRAMIENTA.value;

    // Habilitar o deshabilitar el campo según la categoría seleccionada
    if (selectedValue == 'Manual') {
        SUB_MANUAL_HERRAMIENTA0.disabled = true;
        SUB_MANUAL_HERRAMIENTA1.disabled = false;
        SUB_MANUAL_HERRAMIENTA2.disabled = false;
        SUB_MANUAL_HERRAMIENTA3.disabled = true;
    } else if (selectedValue == 'EPP') {
        SUB_MANUAL_HERRAMIENTA0.disabled = true;
        SUB_MANUAL_HERRAMIENTA0.checked = false;
        SUB_MANUAL_HERRAMIENTA1.disabled = true;
        SUB_MANUAL_HERRAMIENTA1.checked = false;
        SUB_MANUAL_HERRAMIENTA2.disabled = true;
        SUB_MANUAL_HERRAMIENTA2.checked = false;
        SUB_MANUAL_HERRAMIENTA3.disabled = false;
        SUB_MANUAL_HERRAMIENTA3.checked = true;
    }
    else {
        SUB_MANUAL_HERRAMIENTA0.checked = true;
        SUB_MANUAL_HERRAMIENTA0.disabled = false;
        SUB_MANUAL_HERRAMIENTA1.disabled = true;
        SUB_MANUAL_HERRAMIENTA2.disabled = true;
        SUB_MANUAL_HERRAMIENTA3.disabled = true;
    }
});

// * función que se ejecuta al momento de crear un registro
// * preparando los campos de las subcategories a un valor predeterminado 
const subCategoriaInicio = () => {
    // Se inicializan los campos de la sub categoría manual al cargar la página.
    SUB_MANUAL_HERRAMIENTA0.checked = true;
    SUB_MANUAL_HERRAMIENTA0.disabled = false;
    SUB_MANUAL_HERRAMIENTA1.disabled = true;
    SUB_MANUAL_HERRAMIENTA2.disabled = true;
    SUB_MANUAL_HERRAMIENTA3.disabled = true;
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar herramienta';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    subCategoriaInicio();
};

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null, type) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
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
            TABLE_BODY.innerHTML += `
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
                                <button class="btn btn-outline-dark mb-2" onclick="openUpdate(${row.id_herramienta})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-dark mb-2" onclick="openDelete(${row.id_herramienta})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                                <button class="btn btn-outline-dark mb-2"
                                    onclick="openUpdateQuantity(${row.id_herramienta})">
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
        sweetAlert(4, DATA.error, true);
    }
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idHerramienta', id);
    // Petición para obtener los datos del registro seleccionado.
    const DATA = await fetchData(HERRAMIENTA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar herramienta';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_HERRAMIENTA.value = ROW.id_herramienta;
        NOMBRE_HERRAMIENTA.value = ROW.nombre_herramienta;
        DESCRIPCION_HERRAMIENTA.value = ROW.descripcion_herramienta;
        CATEGORIA_HERRAMIENTA.value = ROW.categoria_herramienta;
        switch (ROW.sub_manual_herramienta) {
            case 1:
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.checked = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = false;
                SUB_MANUAL_HERRAMIENTA2.disabled = false;
                SUB_MANUAL_HERRAMIENTA3.disabled = true;
                break;
            case 2:
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = false;
                SUB_MANUAL_HERRAMIENTA2.checked = true;
                SUB_MANUAL_HERRAMIENTA2.disabled = false;
                SUB_MANUAL_HERRAMIENTA3.disabled = true;
                break;
            case 3:
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = true;
                SUB_MANUAL_HERRAMIENTA2.disabled = true;
                SUB_MANUAL_HERRAMIENTA3.checked = true;
                SUB_MANUAL_HERRAMIENTA3.disabled = false;
                break;
            case "1":
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.checked = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = false;
                SUB_MANUAL_HERRAMIENTA2.disabled = false;
                break;
            case "2":
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = false;
                SUB_MANUAL_HERRAMIENTA2.checked = true;
                SUB_MANUAL_HERRAMIENTA2.disabled = false;
                break;
            case "3":
                SUB_MANUAL_HERRAMIENTA0.disabled = true;
                SUB_MANUAL_HERRAMIENTA1.disabled = true;
                SUB_MANUAL_HERRAMIENTA2.disabled = true;
                SUB_MANUAL_HERRAMIENTA3.checked = true;
                SUB_MANUAL_HERRAMIENTA3.disabled = false;
                break;
            default: // Para cualquier otro valor (ej: 0)
                SUB_MANUAL_HERRAMIENTA0.checked = true;
                SUB_MANUAL_HERRAMIENTA0.disabled = false;
                SUB_MANUAL_HERRAMIENTA1.disabled = true;
                SUB_MANUAL_HERRAMIENTA2.disabled = true;
                SUB_MANUAL_HERRAMIENTA3.disabled = true;
                break;
        }
        CANTIDAD_HERRAMIENTA.value = ROW.cantidad_herramienta;
        VISIBILIDAD_HERRAMIENTA.checked = ROW.visibilidad_herramienta;
        IMAGEN_MUESTRA.src = `${SERVER_URL}images/herramientas/${ROW.imagen_herramienta}`;
    } else {
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
    const RESPONSE = await confirmAction('¿Desea eliminar la herramienta de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idHerramienta', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(HERRAMIENTA_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable(null, 1);;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// * Función asíncrona para preparar el formulario al momento de actualizar la cantidad de material
const openUpdateQuantity = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idHerramienta', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(HERRAMIENTA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        HERRAMIENTA_MODAL.show();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_HERRAMIENTA_CANTIDAD.value = ROW.id_herramienta;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openQuantity = async (id, type) => {
    // <-- Guarda el tipo de operación
    tipoOperacionCantidad = type;
    // se inicializa el modal
    TITLE_TIPO_HERRAMIENTA.textContent = '';
    ACTUALIZAR_HERRAMIENTA.value = null;
    // se establece el titulo del modal dependiendo del tipo de acción
    switch (type) {
        case 1:
            // se muestra el titulo del modal para agregar cantidad
            TITLE_TIPO_HERRAMIENTA.textContent = 'Agregar cantidad';
            break;
        case 2:
            // se muestra el titulo del modal para restar cantidad
            TITLE_TIPO_HERRAMIENTA.textContent = 'Restar cantidad';
            break;
        default:
            break;
    }
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idHerramienta', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(HERRAMIENTA_API, 'readOne', FORM);
    if (DATA.status) {
        // Se muestra la caja de dialogo con su titulo
        const ROW = DATA.dataset;
        ID_TIPO_HERRAMIENTA_CANTIDAD.value = ROW.id_herramienta;
        CANTIDAD_ACTUAL_HERRAMIENTA.textContent = ROW.cantidad_herramienta;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

ACTUALIZAR_HERRAMIENTA.addEventListener('input', function () {
    const cantidadActual = parseInt(CANTIDAD_ACTUAL_HERRAMIENTA.textContent) || 0;
    const cantidadIngresada = parseInt(ACTUALIZAR_HERRAMIENTA.value);

    if (tipoOperacionCantidad === 2 && cantidadIngresada > cantidadActual) {
        sweetAlert(2, 'No puedes restar más de la cantidad actual', false);
        ACTUALIZAR_HERRAMIENTA.value = cantidadActual;
    } else {
        CANTIDAD_ACTUALIZADA_MATERIAL.textContent = cantidadActual + (tipoOperacionCantidad === 1 ? cantidadIngresada : -cantidadIngresada);
    }
});