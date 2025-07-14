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
    if (isset($_SESSION['idDupla'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            case 'createDetail':
                $_POST = Validator::validateForm($_POST);
                if (!$pedido->startOrder()) {
                    $result['error'] = 'Ocurrió un problema al iniciar el pedido';
                } elseif (
                    !$pedido->setHerramienta($_POST['idHerramienta']) or
                    !$pedido->setCantidad($_POST['cantidadHerramienta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->createDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar el material';
                }
                break;
            // ? Acción para obtener los productos agregados en el pedido de herramientas.
            case 'readDetail':
                if (!$pedido->getOrder()) {
                    $result['error'] = 'No ha agregado herramientas al pedido';
                } elseif ($result['dataset'] = $pedido->readDetail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen herramientas en el pedido';
                }
                break;
            // ? Acción para actualizar la cantidad de un material en el pedido de herramientas.
            case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdDetalle($_POST['idDetalle']) or
                    !$pedido->setCantidad($_POST['cantidadHerramienta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->updateDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }
                break;
            // ? Acción para remover un material del pedido
            case 'deleteDetail':
                if (!$pedido->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->deleteDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta removida correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover la herramienta';
                }
                break;
            // ? Acción para finalizar el carrito de compras.
            case 'finishOrder':
                if ($pedido->finishOrder()) {
                    $result['status'] = 1;
                    $result['message'] = 'pedido solicitado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al solicitar el pedido de herramientas';
                }
                break;
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'createDetail':
                $result['error'] = 'Debe iniciar sesión para agregar una herramienta al pedido';
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
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
