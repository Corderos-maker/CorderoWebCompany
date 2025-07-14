const TRABAJO_DUPLA_API = 'services/admin/trabajo_dupla.php';
// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

// Método del eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // carga el encabezado y el pie de pagina
    loadTemplate();
    // se llena la tabla con la información
    fillTable(1);
    fillButtons();
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
            <li><a class="dropdown-item" onclick="fillTable(2)">Inicios jornadas</a></li>
            <li><a class="dropdown-item" onclick="fillTable(3)">Finalizaciones jornadas</a></li>
        </ul>
    </div>

    `;
};

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (type, form) => {

    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    switch (type) {
        case 1:
            action = 'readAllJourney'
            break;
        case 2:
            action = 'readJourneyStart'
            break;
        case 3:
            action = 'readJourneyEnds'
            break;
        case "1":
            action = 'readAllJourney'
            break;
        case "2":
            action = 'readJourneyStart'
            break;
        case "3":
            action = 'readJourneyEnds'
            break;
        default:
            action = 'readAll'
            sweetAlert(4, 'Error al cargar información', true);
            break;
    }
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, action, FORM);
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    if (DATA.status) {
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        DATA.dataset.forEach(row => {
            switch (row.tipo_trabajo_historial) {
                case 1:
                    STATE = "primary'>Jornada Iniciada";
                    break;
                case 0:
                    STATE = "success'>Jornada Finalizada";
                    break;
                case "1":
                    STATE = "primary'>Jornada Iniciada";
                    break;
                case "0":
                    STATE = "success'>Jornada Finalizada";
                    break;
                default:
                    STATE = "danger'>Error tipo Jornada";
                    break;
            }
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.codigo_dupla}</td>
                <td class='text-${STATE}</td>
                <td>${row.fecha_trabajo_historial}</td>
            </tr>`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
};