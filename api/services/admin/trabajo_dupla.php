<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_trabajo_dupla.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $trabajoDP = new TrabajoDuplaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        //? se realiza una acción cuando el administrador tiene la sesión iniciada
        switch ($_GET['action']) {
            // ? acciones de servidor para administrador
            // ? Busca trabajos de dupla según el término de búsqueda.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $trabajoDP->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene la información de trabajo de la dupla actual.
            case 'readInformation':
                if ($result['dataset'] = $trabajoDP->readInformation()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información conseguida con éxito';
                } else {
                    $result['error'] = 'No existe información registrada';
                }
                break;
            // ? Obtiene los 5 trabajos de dupla más recientes (activos).
            case 'readByActive5':
                if ($result['dataset'] = $trabajoDP->readByActive5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            // ? Obtiene los 5 trabajos de dupla más recientes (inactivos/finalizados).
            case 'readByInactive5':
                if ($result['dataset'] = $trabajoDP->readByInactive5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;

            // ? Obtiene toda la información de trabajo de la dupla actual.
            case 'readAllJourney':
                if (
                    !$trabajoDP->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($result['dataset'] = $trabajoDP->readAllJourney()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información conseguida con éxito';
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene la información de los inicios trabajo de la dupla actual.
            case 'readJourneyStart':
                if (
                    !$trabajoDP->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($result['dataset'] = $trabajoDP->readJourneyStart()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información conseguida con éxito';
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;

            // ? Obtiene toda la información de trabajo de la dupla actual.
            case 'readJourneyEnds':
                if (
                    !$trabajoDP->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($result['dataset'] = $trabajoDP->readJourneyEnds()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información conseguida con éxito';
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? obtiene los últimos 5 registros mas recientes de los inicios de jornadas
            case 'readBy5Inicio':
                if (
                    !$trabajoDP->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($result['dataset'] = $trabajoDP->readBy5Inicio()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? obtiene los últimos 5 registros mas recientes de las finalizaciones de jornadas
            case 'readBy5Fin':
                if (
                    !$trabajoDP->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($result['dataset'] = $trabajoDP->readBy5Fin()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
                break;
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
