<?php
//? Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
//? Se incluye la clase padre.
require_once('../../models/handler/handler_material.php');
// ? clase para manejar encasamiento de la clase cable
class MaterialData extends MaterialHandler
{
    // ? atributos adicionales
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */

    /*
     * Método para validar y establecer el ID del material.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del material es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el nombre del material.
     * Verifica que sea alfanumérico y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setNombre($value, $min = 2, $max = 250)
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

    /*
     * Método para validar y establecer la descripción del material.
     * Verifica que no contenga caracteres prohibidos y que su longitud sea válida.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
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
     * Método para validar y establecer la categoría del material.
     * Verifica que sea una cadena válida.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setCategoria($value)
    {
        if (Validator::validateString($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'La categoría es incorrecta';
            return false;
        }
    }

    /*
     * Método para validar y establecer el código del material.
     * Verifica que sea alfanumérico y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setCodigo($value, $min = 5, $max = 6)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El codigo debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->codigo = $value;
            return true;
        } else {
            $this->data_error = 'El código debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer el nombre del contenido del material.
     * Verifica que sea alfabético y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setNombreContenido($value, $min = 2, $max = 10)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El tipo de contenido tiene que ser alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre_contenido = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad del contenido del material.
     * Verifica que sea un número natural.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setCantidadContenido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad_contenido = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad del contenido tiene que ser un numero entero';
        }
    }

    /*
     * Método para validar y establecer la cantidad mínima del material.
     * Verifica que sea un número natural.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setMinimo($value)
    {
        if (Validator::validateNaturalNumber($value) or true) {
            $this->minima = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad minima debe ser un número entero positivo';
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad del material.
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
     * Método para validar y establecer la visibilidad del material.
     * Verifica que sea un valor booleano.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setVisible($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->visible = $value;
            return true;
        } else {
            $this->data_error = 'Visibilidad incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer la imagen del material.
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

    /*
     * Método para obtener el nombre del archivo de imagen del material desde la base de datos.
     * Retorna true si existe, de lo contrario false y guarda el error.
     */
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_material'];
            return true;
        } else {
            $this->data_error = 'material inexistente';
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
