// ? rutas de direcciones de apis
const CATEGORIA_API = 'services/admin/categorias.php';
// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// ?  Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    MODAL_BUTTON = document.getElementById('modalButton');
// ? constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
//? constantes para poder mostrar la imagen seleccionada
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra');
// ? Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CATEGORIA = document.getElementById('idCategoria'),
    NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
    DESCRIPCION_CATEGORIA = document.getElementById('descripcionCategoria'),
    IMAGEN_CATEGORIA = document.getElementById('imagenCategoria');

// se carga método al terminar de cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función de la tabla para llenar con registros
    fillTable();
});

// ? función para mostrar la imagen del input en una etiqueta image
IMAGEN_CATEGORIA.addEventListener('change', function (event) {
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

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    closeModal();
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CATEGORIA.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CATEGORIA_API, action, FORM);
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
        enableModal();
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

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CATEGORIA_API, action, form);
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 d-flex">
                <div class="card flex-fill">
                    <div class="card-body">
                        <div class="row justify-content-center">
                            <div class="col-12 d-flex justify-content-center align-items-center">
                                <img src="${SERVER_URL}images/categoria/${row.imagen_categoria}" width="150"
                                    class="rounded border border-primary" alt="Imagen de error"
                                    onerror="this.onerror=null; this.src='../../resources/images/error/404material.png';">
                            </div>
                            <div class="col-12 my-4">
                                <div class="d-flex flex-column align-items-center text-center ">
                                    <h5>Nombre Categoría</h5>
                                    <p class="card-title">${row.nombre_categoria}</p>
                                    <h5>Descripción Categoría</h5>
                                    <p class="card-text text-center">${row.descripcion_categoria}</p>
                                </div>
                            </div>
                            <div class="col-md-12 text-center">
                                <div class="d-flex flex-column ">
                                    <button class="btn btn-outline-dark mb-2" onclick="openUpdate(${row.id_categoria})">
                                        <i class="bi bi-pencil-square"></i> Editar Registro
                                    </button>
                                    <button class="btn btn-outline-dark mb-2" onclick="openDelete(${row.id_categoria})">
                                        <i class="bi bi-trash"></i> Eliminar Registro
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
            <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>`;
        sweetAlert(4, DATA.error);
    }
};

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear categoría';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    enableModal();
}

// * función para deshabilitar el formulario para guardarlo
const closeModal = () => {
    // se deshabilita el modal 
    NOMBRE_CATEGORIA.readOnly = true;
    DESCRIPCION_CATEGORIA.readOnly = true;
    // Cambia el contenido del botón (icono de spinner + texto)
    MODAL_BUTTON.innerHTML = `
            <span class="visually-hidden">Loading...</span> Guardar
    `;
};

//  * función para habilitar el modal para alterar o crear un nuevo registros
const enableModal = () => {
    // se deshabilita el modal 
    NOMBRE_CATEGORIA.readOnly = false;
    DESCRIPCION_CATEGORIA.readOnly = false;
    // Cambia el contenido del botón (icono de spinner + texto)
    MODAL_BUTTON.innerHTML = `
        <i class="bi bi-file-earmark-plus-fill"></i> Guardar
    `;
};

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idCategoria', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CATEGORIA_API, 'readOne', FORM);
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar producto';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        enableModal();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CATEGORIA.value = ROW.id_categoria;
        NOMBRE_CATEGORIA.value = ROW.nombre_categoria;
        DESCRIPCION_CATEGORIA.value = ROW.descripcion_categoria;
    } else {
        sweetAlert(2, DATA.error, false);
    }
};

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la categoría de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCategoria', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CATEGORIA_API, 'deleteRow', FORM);
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