<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_evidencia.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla evidencia.
 */

class EvidenciaData extends EvidenciaHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename1 = null;
    private $filename2 = null;

    /*
     * Método para validar y establecer el ID de las imágenes.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setIdEvidencia($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_evidencia = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de las imágenes es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el ID del detalle de las herramientas.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setIdDetalle($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_detalle = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer la imagen n°1 del las evidencias.
     * Verifica que el archivo sea una imagen válida, o asigna una imagen por defecto si no hay archivo.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setImagen1($file, $filename1 = null)
    {
        if (Validator::validateImageFile($file)) {
            $this->imagen1 = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename1) {
            $this->imagen1 = $filename1;
            return true;
        } else {
            $this->imagen1 = 'default.png';
            return true;
        }
    }

    /*
     * Método para validar y establecer la imagen n°1 del las evidencias.
     * Verifica que el archivo sea una imagen válida, o asigna una imagen por defecto si no hay archivo.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setImagen2($file, $filename2 = null)
    {
        if (Validator::validateImageFile2($file)) {
            $this->imagen2 = Validator::getFileName2();
            return true;
        } elseif (Validator::getFileError2()) {
            $this->data_error = Validator::getFileError2();
            return false;
        } elseif ($filename2) {
            $this->imagen2 = $filename2;
            return true;
        } else {
            $this->imagen2 = 'default.png';
            return true;
        }
    }

    /*
     * Método para obtener el nombre del archivo de imagen del consumible desde la base de datos.
     * Retorna true si existe, de lo contrario false y guarda el error.
     */
    public function setFilename1()
    {
        if ($data = $this->readFilename1()) {
            $this->filename1 = $data['imagen_evidencia_herramienta1'];
            return true;
        } else {
            $this->data_error = 'Imagen 1 inexistente';
            return false;
        }
    }

    public function setFilename2()
    {
        if ($data = $this->readFilename2()) {
            $this->filename2 = $data['imagen_evidencia_herramienta2'];
            return true;
        } else {
            $this->data_error = 'Imagen 2 inexistente';
            return false;
        }
    }

    // ? método para tener los datos adicionales del error
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename1()
    {
        return $this->filename1;
    }

    public function getFilename2()
    {
        return $this->filename2;
    }
}
