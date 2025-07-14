// Constantes para completar las rutas de la API.
const HERRAMIENTA_API = 'services/public/herramienta.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_HERRAMIENTA = document.getElementById('idHerramienta'),
    NOMBRE_HERRAMIENTA = document.getElementById('nombreHerramienta'),
    DESCRIPCION_HERRAMIENTA = document.getElementById('descripcionHerramienta'),
    CANTIDAD_HERRAMIENTA = document.getElementById('cantidadHerramienta');
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
    fillTable(null, 1);;
});

// ? Método del evento para cuando se envía el formulario de buscar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_HERRAMIENTA_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false);
        SAVE_MODAL.hide();
    } else if (DATA.session) {
        sweetAlert(2, DATA.error, false);
    } else {
        sweetAlert(3, DATA.error, true);
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

            if (row.visibilidad_herramienta == 0) {
                visibilidadMaterial = 'No disponible';
                claseVisibilidad = 'text-danger';
                estadoMaterial = 'disabled';
            } else {
                visibilidadMaterial = 'Disponible';
                claseVisibilidad = '';
                estadoMaterial = '';
            }

            TABLE_BODY.innerHTML += `
            <!-- Tarjeta 1 -->
            <fieldset ${estadoMaterial}>
                <div class="col">
                    <div class="card h-80">
                        <div class="card-body">
                            <img src="${SERVER_URL}images/herramientas/${row.imagen_herramienta}" 
                            style="width:200px; height:200px; object-fit:contain; background:#f8f9fa;" 
                            class="card-img-top d-block mx-auto" alt="Imagen de la herramienta"
                            onerror="this.onerror=null; this.src='../../resources/images/error/404Herramienta.png';">
                            <h5 class="card-title mt-2">${row.nombre_herramienta}</h5>
                            <div class="round bg-info rounded-3 text-dark px-2 my-2">
                                <h5 class="card-text">${categoria}</h5>
                            </div>
                            <p class="card-text">${row.descripcion_herramienta}</p>
                            <h5 class="card-text ${claseVisibilidad}">${visibilidadMaterial}</h5>
                            <button type="button" class="btn btn-primary"
                                onclick="orderMaterial(${row.id_herramienta})"><h2>Solicitar herramienta</h2></button>
                        </div>
                    </div>
                </div>
            </fieldset>`;
        })
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// ? método para abrir modal de solicitar herramienta
const orderMaterial = async (id) => {
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