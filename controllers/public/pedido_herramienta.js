// ? Constante para el uso de las APIs
const HERRAMIENTA_API = 'services/public/herramienta.php';
const EVIDENCIA_HERRAMIENTA_API = 'services/public/evidencia.php';
// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody');
//? constantes para poder mostrar la imagen seleccionada
const IMAGEN_MUESTRA1 = document.getElementById('imagenMuestra1'),
    IMAGEN_MUESTRA2 = document.getElementById('imagenMuestra2');
// Constante para establecer la caja de diálogo de cambiar la cantidad.
const ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    ALERT_MODAL = new bootstrap.Modal('#alertModal'),
    PICTURES_MODAL = new bootstrap.Modal('#picturesModal');
// Constante para establecer el formulario de cambiar producto.
const ITEM_FORM = document.getElementById('itemForm'),
    CANTIDAD_HERRAMIENTA = document.getElementById('cantidadHerramienta');
// constantes para el manejo de imágenes de evidencia
const PICTURES_FORM = document.getElementById('picturesForm'),
    ID_EVIDENCIA = document.getElementById('idEvidencia'),
    TYPE_IMAGE = document.getElementById('typeImage'),
    IMAGEN_EVIDENCIA1 = document.getElementById('imagenEvidencia1'),
    IMAGEN_EVIDENCIA2 = document.getElementById('imagenEvidencia2');

document.addEventListener('DOMContentLoaded', function () {
    // se carga en encabezado y el footer
    loadTemplate();
    MAIN_TITLE.innerHTML = 'Pedido de herramientas';
    // Se carga el detalle del carrito de compras.
    readDetail();
});

// ? función para mostrar la imagen del input en una etiqueta image
IMAGEN_EVIDENCIA1.addEventListener('change', function (event) {
    // Verifica si hay una imagen seleccionada
    if (event.target.files && event.target.files[0]) {
        // con el objeto FileReader lee el archivo seleccionado
        const reader = new FileReader();
        // Luego de haber leído la imagen seleccionada se nos devuelve un objeto de tipo blob
        // Con el método createObjectUrl de fileReader crea una url temporal para la imagen
        reader.onload = function (event) {
            // finalmente la url creada se le asigna el atributo de la etiqueta img
            IMAGEN_MUESTRA1.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

IMAGEN_EVIDENCIA2.addEventListener('change', function (event) {
    // Verifica si hay una imagen seleccionada
    if (event.target.files && event.target.files[0]) {
        // con el objeto FileReader lee el archivo seleccionado
        const reader = new FileReader();
        // Luego de haber leído la imagen seleccionada se nos devuelve un objeto de tipo blob
        // Con el método createObjectUrl de fileReader crea una url temporal para la imagen
        reader.onload = function (event) {
            // finalmente la url creada se le asigna el atributo de la etiqueta img
            IMAGEN_MUESTRA2.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

// Método del evento para cuando se envía el formulario de cambiar cantidad de producto.
ITEM_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ITEM_FORM);
    // Petición para actualizar la cantidad de producto.
    const DATA = await fetchData(PEDIDO_HERRAMIENTA_API, 'updateDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se actualiza la tabla para visualizar los cambios.
        readDetail();
        // Se cierra la caja de diálogo del formulario.
        ITEM_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// método del evento para cuando se envía el formulario, pueda guardar las imágenes de evidencia
PICTURES_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PICTURES_FORM);
    if (TYPE_IMAGE.value == 1) {
        action = 'createRow';
    } else {
        action = 'updateRow';
    }
    // Petición para actualizar las imágenes de producto.
    const DATA = await fetchData(EVIDENCIA_HERRAMIENTA_API, action, FORM);
    if (DATA.status) {
        // Se cierra la caja de diálogo del formulario.
        PICTURES_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se actualiza la tabla para visualizar los cambios.
        readDetail();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función para obtener el detalle del carrito de compras.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
async function readDetail() {
    // petición para obtener los datos del pedido en proceso.
    const DATA = await fetchData(PEDIDO_HERRAMIENTA_API, 'readDetail');
    if (DATA.status) {
        TABLE_BODY.innerHTML = '';
        // Usar Promise.all para esperar todas las sub-consultas
        const rowsHtml = await Promise.all(DATA.dataset.map(async row => {
            // Sub-consulta para evidencia
            const formData = new FormData();
            formData.append('idDetalle', row.id_detalle_herramienta);
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

            // Categoría
            let categoria;
            switch (row.sub_manual_herramienta) {
                case 1:
                case "1":
                    categoria = '<i class="bi bi-wrench"></i> Manual ligera';
                    break;
                case 2:
                case "2":
                    categoria = '<i class="bi bi-hammer"></i> Manual pesada';
                    break;
                default:
                    categoria = '<i class="bi bi-lightning-charge-fill"></i> Eléctrica';
                    break;
            }

            // Retorna el HTML de la fila
            return `
                <tr>
                    <td>${row.nombre_herramienta}</td>
                    <td>${categoria}</td>
                    <td>${row.cantidad_detalle_herramienta}</td>
                    <td>${evidenciaBtn}</td>
                    <td>
                        <button type="button" onclick="openUpdate(${row.id_detalle_herramienta}, ${row.cantidad_detalle_herramienta})" class="btn btn-info btn-lg">
                            <i class="bi bi-plus-slash-minus"></i>
                        </button>
                        <button type="button" onclick="openDelete(${row.id_detalle_herramienta})" class="btn btn-danger btn-lg">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `;
        }));
        TABLE_BODY.innerHTML = rowsHtml.join('');
    } else {
        sweetAlert(4, DATA.error, false, 'index.html');
    }
}

/*
*   Función para abrir la caja de diálogo con el formulario de cambiar cantidad de producto.
*   Parámetros: id (identificador del producto) y quantity (cantidad actual del producto).
*   Retorno: ninguno.
*/
function openUpdate(id, quantity) {
    // Se abre la caja de diálogo que contiene el formulario.
    ITEM_MODAL.show();
    // Se inicializan los campos del formulario con los datos del registro seleccionado.
    document.getElementById('idDetalle').value = id;
    CANTIDAD_HERRAMIENTA.value = quantity;
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

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar una herramienta del pedido.
*   Parámetros: id (identificador del material).
*   Retorno: ninguno.
*/
async function openDelete(id) {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de remover la herramienta?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        // Petición para eliminar un producto del carrito de compras.
        const DATA = await fetchData(PEDIDO_HERRAMIENTA_API, 'deleteDetail', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            readDetail();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// * funcion para mostrar las consecuencias de finalizar el pedido
const openFinishOrder = () => {
    // Se abre la caja de diálogo que contiene el mensaje de confirmación.
    ALERT_MODAL.show();
};

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de finalizar el pedido.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
async function finishOrder() {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de finalizar el pedido de herramientas?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Petición para finalizar el pedido en proceso.
        const DATA = await fetchData(PEDIDO_HERRAMIENTA_API, 'finishOrder');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true, 'inicio.html');
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

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
        console.log('este es el id del detalle '+ ROW.id_evidencia_herramienta)
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