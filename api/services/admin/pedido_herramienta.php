<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_pedido_herramienta.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new PedidoHerramientaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            // TODO casos de ordenes de pedidos de herramientas
            // ? Busca en el historial de requisiciones según el término de búsqueda.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $pedido->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'searchRowsCancel':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $pedido->searchRowsCancel()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'searchRowsHistory':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $pedido->searchRowsHistory()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Creación de un nuevo pedido
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setDupla($_POST['duplaPedido'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($id = $pedido->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido creado correctamente';
                    $result['pedidoId'] = $id; // <-- Aquí se envía el id de la requisición creada
                } else {
                    $result['error'] = 'Ocurrió un problema al crear un pedido';
                }
                break;
            // ? obtiene todos los registros que están pendientes a aprobar
            case 'readAll':
                if ($result['dataset'] = $pedido->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen pedidos de herramientas pendientes...';
                }
                break;
            // ? obtiene todos los registros que están pendientes a aprobar
            case 'readAllCancel':
                if ($result['dataset'] = $pedido->readAllCancel()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen pedidos de herramientas pendientes...';
                }
                break;
            // ? Obtiene el historial de todas los pedidos.
            case 'readAllHistory':
                if ($result['dataset'] = $pedido->readAllHistory()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Error en buscar los pedidos...';
                }
                break;
            // ? Obtiene 5 pedidos de herramientas de una dupla específica.
            case 'readBy10':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readBy10()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos pedidos de herramientas de una dupla específica.
            case 'readAllDuplaHistory':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readAllDuplaHistory()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos pedidos de herramientas de una dupla específica.
            case 'readByPendiente':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByPendiente()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos pedidos de herramientas de una dupla específica.
            case 'readByProcesando':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByProcesando()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos pedidos de herramientas de una dupla específica.
            case 'readByAprobada':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByAprobada()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene todos pedidos de herramientas de una dupla específica.
            case 'readByAnulada':
                if (
                    !$pedido->setDupla($_POST['idDupla'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByAnulada()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No es posible encontrar el historial';
                }
                break;
            // ? Obtiene los datos de un pedido especifico
            case 'readOne':
                if (!$pedido->setIdPedido($_POST['idPedido'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Error al leer los detalles del pedido';
                }
                break;
            // ? Anula (remueve) un pedido cambiando su estado.
            case 'removePedido':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdPedido($_POST['idPedido'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->removePedido()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido de herramientas removida correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el pedido';
                }
                break;
            // ? Restaura un pedido de herramientas anulada.
            case 'restorePedido':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdPedido($_POST['idPedido'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->restorePedido()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido restaurado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al restaurar el pedido';
                }
                break;
            // ? Aprueba una requisición y descuenta materiales del inventario.
            case 'approvePedido':
                if (
                    !$pedido->setIdPedido($_POST['idPedido'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->approvePedido()) {
                    $result['status'] = 1;
                    $result['message'] = 'pedido de herramientas aprobada';
                } else {
                    $result['error'] = 'Ocurrió un problema al aprobar el pedido';
                }
                break;
            // TODO casos de detalles sobre los pedidos de herramientas
            // ? Agrega un material a una requisición específica.
            case 'createDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdPedido($_POST['idPedido']) or
                    !$pedido->setHerramienta($_POST['idHerramienta']) or
                    !$pedido->setCantidad($_POST['cantidadHerramienta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->createAdminDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta agregada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar la herramienta';
                }
                break;
            // ? Obtiene los detalles de las herramientas de un pedido específico, ordenados.
            case 'readByOrder':
                if (!$pedido->setIdPedido($_POST['idPedido'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByOrder()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'pedido sin herramientas';
                }
                break;
            // ? Actualiza la cantidad de un material en la requisición.
            case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdDetalle($_POST['idDetalle']) or
                    !$pedido->setCantidad($_POST['cantidadHerramienta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->updateQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }

                break;
            // ? Elimina una herramienta del pedido (por id de detalle).
            case 'deleteHerramienta':
                if (!$pedido->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->deleteHerramienta()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta removida correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover la Herramienta';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible';
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
