<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_consumible.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $consumible = new ConsumibleData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // ? Obtiene todos los registros de consumible de búsqueda.
            case 'searchRows':
                break;
            // ? Crea un nuevo registro de consumible.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$consumible->setNombre($_POST['nombreConsumible']) or
                    !$consumible->setDescripcion($_POST['descripcionConsumible']) or
                    !$consumible->setCategoria($_POST['categoriaConsumible']) or
                    !$consumible->setLimite($_POST['cantidadMinimaConsumible']) or
                    !$consumible->setCantidad($_POST['cantidadConsumible']) or
                    !$consumible->setImagen($_FILES['imagenConsumible'])
                ) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($consumible->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Consumible creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenConsumible'], $consumible::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el consumible';
                }
                break;
            // ? Obtiene todos los registros de la tabla tb_consumibles.
            case 'readAll':
                if ($result['dataset'] = $consumible->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen contenidos registrados';
                }
                break;
            // ? Obtiene un registro específico de la tabla tb_contenidos según el id_contenido.
            case 'readOne':
                if (!$consumible->setId($_POST['idConsumible'])) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($result['dataset'] = $consumible->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Consumible inexistente';
                }
                break;
            // ? Actualiza los datos de un consumible específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$consumible->setId($_POST['idConsumible']) or
                    !$consumible->setFilename() or
                    !$consumible->setNombre($_POST['nombreConsumible']) or
                    !$consumible->setDescripcion($_POST['descripcionConsumible']) or
                    !$consumible->setCategoria($_POST['categoriaConsumible']) or
                    !$consumible->setLimite($_POST['cantidadMinimaConsumible']) or
                    !$consumible->setCantidad($_POST['cantidadConsumible']) or
                    !$consumible->setImagen($_FILES['imagenConsumible'], $consumible->getFilename())
                ) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($consumible->UpdateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Consumible editado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenConsumible'], $consumible::RUTA_IMAGEN, $consumible->getFilename());
                } else {
                    $result['error'] = 'Error al editar el consumible';
                }
                break;
            // ? Suma una cantidad al stock de un consumible.
            case 'addQuantity':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$consumible->setId($_POST['idTipoConsumibleCantidad']) or
                    !$consumible->setCantidad($_POST['actualizarConsumible'])
                ) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($consumible->addQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Consumible agregado correctamente';
                } else {
                    $result['error'] = 'Error al agregar el consumible';
                }
                break;
            // ? Resta una cantidad al stock de un consumible.
            case 'subtractQuantity':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$consumible->setId($_POST['idTipoConsumibleCantidad']) or
                    !$consumible->setCantidad($_POST['actualizarConsumible'])
                ) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($consumible->subtractQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Consumible restado correctamente';
                } else {
                    $result['error'] = 'Error al restar el consumible';
                }
                break;
            // ? Elimina un consumible específico de la base de datos.
            case 'deleteRow':
                if (
                    !$consumible->setId($_POST['idConsumible'])
                ) {
                    $result['error'] = $consumible->getDataError();
                } elseif ($consumible->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'consumible eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el consumible';
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
