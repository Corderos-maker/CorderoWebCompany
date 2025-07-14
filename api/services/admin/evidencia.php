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
    if (isset($_SESSION['idAdministrador'])) {
        switch ($_GET['action']) {
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
