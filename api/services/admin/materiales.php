<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_material.php');

//? Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    //? Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    //? Se instancia la clase correspondiente.
    $material = new MaterialData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        // if (isset($_SESSION['idAdministrador'])) {
        // ? se compara la acción del administrador con la session iniciada
        switch ($_GET['action']) {
            // ? Busca materiales según el término de búsqueda.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $material->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Crea un nuevo material.
            case 'createRow':
                // echo(($_POST['visibilidadMaterial'])  ? 1 : 0);
                // die;
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setNombre($_POST['nombreMaterial']) or
                    !$material->setDescripcion($_POST['descripcionMaterial']) or
                    !$material->setCategoria($_POST['categoriaMaterial']) or
                    !$material->setCodigo($_POST['codigoMaterial']) or
                    !$material->setNombreContenido($_POST['contenidoMaterial']) or
                    !$material->setCantidadContenido($_POST['cantidadTipoMaterial']) or
                    !$material->setMinimo($_POST['cantidadMinimaMaterial']) or
                    !$material->setCantidad($_POST['cantidadMaterial']) or
                    !$material->setVisible(isset($_POST['visibilidadMaterial']) ? 1 : 0) or
                    !$material->setImagen($_FILES['imagenMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->CreateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenMaterial'], $material::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar el material';
                }
                break;
            // ? Obtiene todos los materiales registrados.
            case 'readAll':
                if ($result['dataset'] = $material->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales de la categoría "Uso habitual".
            case 'readByCategory1':
                if ($result['dataset'] = $material->readByCategory1()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales de la categoría "Material para CL200".
            case 'readByCategory2':
                if ($result['dataset'] = $material->readByCategory2()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales de la categoría "Acometida especial".
            case 'readByCategory3':
                if ($result['dataset'] = $material->readByCategory3()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales de la categoría "Subterráneo".
            case 'readByCategory4':
                if ($result['dataset'] = $material->readByCategory4()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales de la categoría "Antihurto y telegestión".
            case 'readByCategory5':
                if ($result['dataset'] = $material->readByCategory5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales ordenados por mayor cantidad en stock.
            case 'readByMax':
                if ($result['dataset'] = $material->readByMax()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales ordenados por menor cantidad en stock.
            case 'readByMin':
                if ($result['dataset'] = $material->readByMin()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene todos los materiales ordenados por fecha de modificación descendente.
            case 'readByModify':
                if ($result['dataset'] = $material->readByModify()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene los 5 materiales con menor stock (por debajo del mínimo).
            case 'readByStock5':
                if ($result['dataset'] = $material->readByStock5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            // ? Obtiene los datos de un material específico por su ID.
            case 'readOne':
                if (!$material->setId($_POST['idMaterial'])) {
                    $result['error'] = $material->getDataError();
                } elseif ($result['dataset'] = $material->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen un dato';
                } else {
                    $result['error'] = 'Material no reconocido';
                }
                break;
            // ? Actualiza los datos de un material específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setId($_POST['idMaterial']) or
                    !$material->setFilename() or
                    !$material->setNombre($_POST['nombreMaterial']) or
                    !$material->setDescripcion($_POST['descripcionMaterial']) or
                    !$material->setCategoria($_POST['categoriaMaterial']) or
                    !$material->setCodigo($_POST['codigoMaterial']) or
                    !$material->setNombreContenido($_POST['contenidoMaterial']) or
                    !$material->setCantidadContenido($_POST['cantidadTipoMaterial']) or
                    !$material->setMinimo($_POST['cantidadMinimaMaterial']) or
                    !$material->setCantidad($_POST['cantidadMaterial']) or
                    !$material->setVisible(isset($_POST['visibilidadMaterial']) ? 1 : 0) or
                    !$material->setImagen($_FILES['imagenMaterial'], $material->getFilename())
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->UpdateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material editado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenMaterial'], $material::RUTA_IMAGEN, $material->getFilename());
                } else {
                    $result['error'] = 'Error al editar el material';
                }
                break;
            // ? Suma una cantidad al stock de un material.
            case 'addQuantity':
                // echo ($_POST['hola']);
                // die;
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setId($_POST['idMaterial']) or
                    !$material->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->addQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                } else {
                    $result['error'] = 'Error al agregar el material';
                }
                break;
            // ? Resta una cantidad al stock de un material.
            case 'restQuantity':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setId($_POST['idMaterial']) or
                    !$material->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->restQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material restado correctamente';
                } else {
                    $result['error'] = 'Error al restar el material';
                }
                break;
            // ? Elimina un material específico de la base de datos.
            case 'deleteRow':
                if (
                    !$material->setId($_POST['idMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el material';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
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
