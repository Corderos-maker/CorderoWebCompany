<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_requisicion.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $requisicion = new requisicionData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            // ? Busca en el historial de requisiciones según el término de búsqueda.
            case 'searchRowsHistory':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $requisicion->searchRowsHistory()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Busca requisiciones anuladas según el término de búsqueda.
            case 'searchRowsCancel':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $requisicion->searchRowsCancel()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Creación de una nueva requisición
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setDupla($_POST['duplaRequisicion'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($id = $requisicion->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Requisición creada correctamente';
                    $result['requisicionId'] = $id; // <-- Aquí se envía el id de la requisición creada
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la requisición';
                }
                break;
            // ? Agrega un material a una requisición específica.
            case 'createDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdRequisicion($_POST['idRequisicion']) or
                    !$requisicion->setMaterial($_POST['idMaterial']) or
                    !$requisicion->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->createAdminDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar el material';
                }
                break;
            // ? Obtiene todas las requisiciones pendientes.
            case 'readAll':
                if ($result['dataset'] = $requisicion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen requisiciones pendientes...';
                }
                break;
            // ? Obtiene las 5 requisiciones pendientes más antiguas.
            case 'readAll5':
                if ($result['dataset'] = $requisicion->readAll5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen requisiciones pendientes...';
                }
                break;
            // ? Obtiene el historial de todas las requisiciones.
            case 'readAllHistory':
                if ($result['dataset'] = $requisicion->readAllHistory()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Error en buscar las requisiciones...';
                }
                break;
            // ? Obtiene todas las requisiciones canceladas.
            case 'readAllCancel':
                if ($result['dataset'] = $requisicion->readAllCancel()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen requisiciones canceladas...';
                }
                break;
            // ? Obtiene los datos de una requisición específica.
            case 'readOne':
                if (!$requisicion->setIdRequisicion($_POST['idRequisicion'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'error al leer la requisicion';
                }
                break;
            // ? Obtiene 5 requisiciones de una dupla específica.
            case 'readBy10':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readBy10()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Anula (remueve) una requisición cambiando su estado.
            case 'removeRequisicion':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdRequisicion($_POST['idRequisicion'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->removeRequisicion()) {
                    $result['status'] = 1;
                    $result['message'] = 'Requisición removida correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover la requisición';
                }
                break;
            // ? Restaura una requisición anulada.
            case 'restoreRequisicion':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdRequisicion($_POST['idRequisicion'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->restoreRequisicion()) {
                    $result['status'] = 1;
                    $result['message'] = 'Requisición restaurada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al restaurar la requisición';
                }
                break;
            // ? Aprueba una requisición y descuenta materiales del inventario.
            case 'approveRequisicion':
                if (
                    !$requisicion->setIdRequisicion($_POST['idRequisicion'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->approveRequisicion()) {
                    $result['status'] = 1;
                    $result['message'] = 'Requisición aprobada';
                } else {
                    $result['error'] = 'Ocurrió un problema al restaurar la requisición';
                }
                break;
            // ? Obtiene los detalles de materiales de una requisición específica, ordenados.
            case 'readByOrder':
                if (!$requisicion->setIdRequisicion($_POST['idRequisicion'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByOrder()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Requisición sin materiales';
                }
                break;
            // ? Actualiza la cantidad de un material en la requisición.
            case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdDetalle($_POST['idDetalle']) or
                    !$requisicion->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->updateQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }

                break;
            // ? Elimina un material de la requisición (por id de detalle).
            case 'deleteMaterial':
                if (!$requisicion->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->deleteMaterial()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material removido correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el material';
                }
                break;
            // todo Peticiones para la visualización de información de una dupla especifica
            // ? Obtiene todos las requisiciones de una dupla específica.
            case 'readAllDuplaHistory':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readAllDuplaHistory()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos las requisiciones de una dupla específica.
            case 'readByPendiente':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByPendiente()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos las requisiciones de una dupla específica.
            case 'readByProcesando':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByProcesando()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos las requisiciones de una dupla específica.
            case 'readByAprobada':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByAprobada()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos las requisiciones de una dupla específica.
            case 'readByAnulada':
                if (
                    !$requisicion->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByAnulada()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible';
        }
    } else {
        print(json_encode('Acceso denegado'));
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
