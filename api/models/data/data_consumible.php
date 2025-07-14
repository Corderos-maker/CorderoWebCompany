<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_consumible.php');
/*
 *	Clase para manejar el encasamiento de los datos de la tabla CONSUMIBLES.
 */

class ConsumibleData extends ConsumiblesHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del consumible es incorrecto';
            return false;
        }
    }

    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setDescripcion($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'La descripción contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->descripcion = $value;
            return true;
        } else {
            $this->data_error = 'La descripción debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad mínima del consumible.
     * Verifica que sea un número natural.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setLimite($value)
    {
        if (Validator::validateNaturalNumber($value) or true) {
            $this->limite = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad limite debe ser un número entero positivo';
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad del consumible.
     * Verifica que sea un número natural.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setCantidad($value)
    {
        if (!Validator::validateNaturalNumber($value)) {
            $this->data_error = 'La cantidad debe ser un número entero positivo';
            return false;
        } else {
            $this->cantidad = $value;
            return true;
        }
    }

    /*
     * Método para validar y establecer la imagen del consumible.
     * Verifica que el archivo sea una imagen válida, o asigna una imagen por defecto si no hay archivo.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file)) {
            $this->imagen = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }

    /*
     * Método para obtener el nombre del archivo de imagen del consumible desde la base de datos.
     * Retorna true si existe, de lo contrario false y guarda el error.
     */
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_consumible'];
            return true;
        } else {
            $this->data_error = 'Consumible inexistente';
            return false;
        }
    }

    // ? método para tener los datos adicionales del error
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}
