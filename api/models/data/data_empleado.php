<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_empleado.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class EmpleadoData extends EmpleadoHandler
{

    // atributo genérico para manejo de errores
    private $data_error = null;
    private $filename = null;
    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    /*
     * Método para validar y establecer el ID del empleado.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del empleado es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el nombre del empleado.
     * Verifica que sea alfabético y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
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
     * Método para validar y establecer el apellido del empleado.
     * Verifica que sea alfabético y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setApellido($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El apellido debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->apellido = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer el DUI del empleado.
     * Verifica que el formato sea ########-#.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setDUI($value)
    {
        if (!Validator::validateDUI($value)) {
            $this->data_error = 'El DUI debe tener el formato ########-#';
            return false;
        } else {
            $this->dui = $value;
            return true;
        }
    }

    /*
     * Método para validar y establecer el teléfono del empleado.
     * Verifica que el formato sea (2, 6, 7)###-####.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setTelefono($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    /*
     * Método para validar y establecer la imagen del empleado.
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
            $this->imagen = '404Empleado.png';
            return true;
        }
    }

    /*
     * Método para validar y establecer el departamento del empleado.
     * Verifica que sea alfabético y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setDepartamento($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El departamento debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->departamento = $value;
            return true;
        } else {
            $this->data_error = 'El departamento debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer el municipio del empleado.
     * Verifica que sea alfabético y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setMunicipio($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El municipio debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->municipio = $value;
            return true;
        } else {
            $this->data_error = 'El municipio debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para obtener el nombre del archivo de imagen del empleado desde la base de datos.
     * Retorna true si existe, de lo contrario false y guarda el error.
     */
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_empleado'];
            return true;
        } else {
            $this->data_error = 'Empleado inexistente';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
    public function getFilename()
    {
        return $this->filename;
    }
}
