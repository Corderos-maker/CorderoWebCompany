<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_herramienta.php');

//? Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    //? Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    //? Se instancia la clase correspondiente.
    $herramienta = new HerramientaData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        switch ($_GET['action']) {
            // ? Busca un registro según el término de búsqueda.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $herramienta->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            // ? Crea un nuevo registro.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$herramienta->setNombre($_POST['nombreHerramienta']) or
                    !$herramienta->setDescripcion($_POST['descripcionHerramienta']) or
                    !$herramienta->setCategoria($_POST['categoriaHerramienta']) or
                    !$herramienta->setSubCategoria($_POST['subManualHerramienta']) or
                    !$herramienta->setCantidad($_POST['cantidadHerramienta']) or
                    !$herramienta->setCantidad($_POST['cantidadHerramienta']) or
                    !$herramienta->setVisibilidad(isset($_POST['visibilidadHerramienta']) ? 1 : 0) or
                    !$herramienta->setImagen($_FILES['imagenHerramienta'])
                ) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($herramienta->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta agregada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenHerramienta'], $herramienta::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar la Herramienta';
                }
                break;
            // ? Obtiene todos los registros.
            case 'readAll':
                if ($result['dataset'] = $herramienta->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen herramientas registrados';
                }
                break;

            // ? Obtiene todos los registros.
            case 'readByLight':
                if ($result['dataset'] = $herramienta->readByLight()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen herramientas registrados';
                }
                break;
            // ? Obtiene todos los registros.
            case 'readByHeavy':
                if ($result['dataset'] = $herramienta->readByHeavy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen herramientas registrados';
                }
                break;
            // ? Obtiene todos los registros.
            case 'readByElectric':
                if ($result['dataset'] = $herramienta->readByElectric()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen herramientas registrados';
                }
                break;
            // ? Obtiene todos los registros.
            case 'readByEPP':
                if ($result['dataset'] = $herramienta->readByEPP()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen herramientas registrados';
                }
                break;
            // ? Obtiene los datos de un registro específico por su ID.
            case 'readOne':
                if (!$herramienta->setId($_POST['idHerramienta'])) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($result['dataset'] = $herramienta->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen un dato';
                } else {
                    $result['error'] = 'Herramienta no encontrada';
                }
                break;
            // ? Actualiza los datos de un registro específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$herramienta->setId($_POST['idHerramienta']) or
                    !$herramienta->setFilename() or
                    !$herramienta->setNombre($_POST['nombreHerramienta']) or
                    !$herramienta->setDescripcion($_POST['descripcionHerramienta']) or
                    !$herramienta->setCategoria($_POST['categoriaHerramienta']) or
                    !$herramienta->setSubCategoria($_POST['subManualHerramienta']) or
                    !$herramienta->setCantidad($_POST['cantidadHerramienta']) or
                    !$herramienta->setVisibilidad(isset($_POST['visibilidadHerramienta']) ? 1 : 0) or
                    !$herramienta->setImagen($_FILES['imagenHerramienta'], $herramienta->getFilename())
                ) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($herramienta->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta actualizada correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenHerramienta'], $herramienta::RUTA_IMAGEN, $herramienta->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al actualizar la herramienta';
                }
                break;
            // ? Suma una cantidad al stock de un registro.
            case 'addQuantity':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$herramienta->setId($_POST['idTipoHerramientaCantidad']) or
                    !$herramienta->setCantidad($_POST['actualizarHerramienta'])
                ) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($herramienta->addQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramientas agregado correctamente';
                } else {
                    $result['error'] = 'Error al agregar la herramienta';
                }
                break;
            // ? Resta una cantidad al stock de un consumible.
            case 'subtractQuantity':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$herramienta->setId($_POST['idTipoHerramientaCantidad']) or
                    !$herramienta->setCantidad($_POST['actualizarHerramienta'])
                ) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($herramienta->subtractQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramientas restadas correctamente';
                } else {
                    $result['error'] = 'Error al restar la herramienta';
                }
                break;
            // ? Elimina un registro específico de la base de datos.
            case 'deleteRow':
                if (
                    !$herramienta->setId($_POST['idHerramienta'])
                ) {
                    $result['error'] = $herramienta->getDataError();
                } elseif ($herramienta->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Herramienta eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la herramienta';
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
