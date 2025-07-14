<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_contenido.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $contenido = new ContenidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // ! BUSCAR MANERA DE OPTIMIZAR ESTO 
            // ? Obtiene todos los registros cuyo campo unidad_contenido es 'Piezas'.
            case 'readRowsPiezas':
                if ($result['dataset'] = $contenido->readRowsPiezas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene todos los registros cuyo campo unidad_contenido es 'Metros'.
            case 'readRowsMetros':
                if ($result['dataset'] = $contenido->readRowsMetros()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Empaque'.
            case 'readRowsEmpaque':
                if ($result['dataset'] = $contenido->readRowsEmpaque()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Rollos'.
            case 'readRowsRollos':
                if ($result['dataset'] = $contenido->readRowsRollos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Bobinas'.
            case 'readRowsBobinas':
                if ($result['dataset'] = $contenido->readRowsBobinas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Otros'.
            case 'readRowsOtros':
                if ($result['dataset'] = $contenido->readRowsOtros()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Empaque'.
            case 'readOnlyEmpaque':
                if ($result['dataset'] = $contenido->readOnlyEmpaque()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Rollos'.
            case 'readOnlyRollos':
                if ($result['dataset'] = $contenido->readOnlyRollos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Bobinas'.
            case 'readOnlyBobinas':
                if ($result['dataset'] = $contenido->readOnlyBobinas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Otros'.
            case 'readOnlyOtros':
                if ($result['dataset'] = $contenido->readOnlyOtros()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Crea un nuevo registro de contenido.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$contenido->setNombre($_POST['nombreContenido']) or
                    !$contenido->setUnidad($_POST['unidadContenido']) or
                    !$contenido->setCantidad($_POST['cantidadContenido'])
                ) {
                    $result['error'] = $contenido->getDataError();
                } elseif ($contenido->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contenido creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la categoría';
                }
                break;
            // ? Obtiene todos los registros de la tabla tb_contenidos.
            case 'readAll':
                if ($result['dataset'] = $contenido->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen contenidos registrados';
                }
                break;
            // ? Obtiene un registro específico de la tabla tb_contenidos según el id_contenido.
            case 'readOne':
                if (!$contenido->setId($_POST['idContenido'])) {
                    $result['error'] = $contenido->getDataError();
                } elseif ($result['dataset'] = $contenido->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Contenido inexistente';
                }
                break;
            // ? Actualiza un registro específico de la tabla tb_contenidos.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$contenido->setId($_POST['idContenido']) or
                    !$contenido->setNombre($_POST['nombreContenido']) or
                    !$contenido->setUnidad($_POST['unidadContenido']) or
                    !$contenido->setCantidad($_POST['cantidadContenido'])
                ) {
                    $result['error'] = $contenido->getDataError();
                } elseif ($contenido->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contenido modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el contenido';
                }
                break;
                break;
            // ? Elimina un registro específico de la tabla tb_contenidos.
            case 'deleteRow':
                if (
                    !$contenido->setId($_POST['idContenido'])
                ) {
                    $result['error'] = $contenido->getDataError();
                } elseif ($contenido->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contenido eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el contenido';
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
