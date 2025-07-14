<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_herramienta.php');
/*
 *  Clase para manejar el encasamiento de los datos de la tabla Herramientas.
 */
class HerramientaData extends HerramientaHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la herramienta';
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

    public function setCategoria($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'La categoría debe ser un valor valido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El categoria debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setSubCategoria($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->sub = $value;
            return true;
        } else {
            $this->data_error = 'Sub categoría incorrecta';
            echo($value);
            return false;
        }
    }

    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'Las existencias debe ser un número entero positivo';
            return false;
        }
    }

    public function setVisibilidad($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->visibilidad = $value;
            return true;
        } else {
            $this->data_error = 'Visibilidad incorrecta';
            return false;
        }
    }

    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
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

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_herramienta'];
            return true;
        } else {
            $this->data_error = 'Herramienta inexistente';
            return false;
        }
    }

    /*
     *  Métodos para obtener el valor de los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}
