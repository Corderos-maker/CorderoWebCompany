<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_evidencia.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $evidencia = new EvidenciaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus1' => null, 'fileStatus2' => null);
    if (isset($_SESSION['idDupla'])) {
        switch ($_GET['action']) {
            // ? Crea un nuevo material.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    // !$evidencia->setIdDetalle($_POST['idEvidencia']) or
                    // !$evidencia->setImagen1($_FILES['imagenEvidencia1']) or
                    // !$evidencia->setImagen2($_FILES['imagenEvidencia2'])
                    !$evidencia->setIdDetalle($_POST['idEvidencia']) or
                    !$evidencia->setImagen1($_FILES['imagenEvidencia1']) or
                    !$evidencia->setImagen2($_FILES['imagenEvidencia2'])
                ) {
                    $result['error'] = $evidencia->getDataError();
                } elseif ($evidencia->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Evidencia agregada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus1'] = Validator::saveFile($_FILES['imagenEvidencia1'], $evidencia::RUTA_IMAGEN1);
                    $result['fileStatus2'] = Validator::saveFile2($_FILES['imagenEvidencia2'], $evidencia::RUTA_IMAGEN2);
                } else {
                    $result['error'] = 'Ocurrió un problema al guardar la imagen';
                }
                break;
            // ? acción para obtener las evidencias de la dupla
            case 'readDetail':
                if (!$evidencia->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $evidencia->getDataError();
                } elseif ($evidencia->getEvidencia()) {
                    $result['status'] = 1; // <-- IMPORTANTE
                    $result['message'] = 'Evidencia encontrada';
                } else {
                    $result['error'] = 'No existen imágenes';
                }
                break;
            // ? acción para obtener las evidencias de una herramienta
            case 'readPictures':
                if (!$evidencia->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $evidencia->readDetail()) {
                    $result['status'] = 1; // <-- IMPORTANTE
                    $result['message'] = 'Evidencia encontrada';
                } else {
                    $result['error'] = 'No existen imágenes';
                }
                break;
            // ? acción para actualizar un registro
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$evidencia->setIdEvidencia($_POST['idEvidencia']) or
                    !$evidencia->setImagen1($_FILES['imagenEvidencia1'], $evidencia->getFilename1()) or
                    !$evidencia->setImagen2($_FILES['imagenEvidencia2'], $evidencia->getFilename2())
                ) {
                    $result['error'] = $evidencia->getDataError();
                } elseif ($evidencia->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Evidencias actualizadas correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus1'] = Validator::changeFile($_FILES['imagenEvidencia1'], $evidencia::RUTA_IMAGEN1, $evidencia->getFilename1());
                    $result['fileStatus2'] = Validator::changeFile2($_FILES['imagenEvidencia2'], $evidencia::RUTA_IMAGEN2, $evidencia->getFilename2());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar las imágenes';
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
