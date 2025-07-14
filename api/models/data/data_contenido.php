<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_cotenido.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla CATEGORIA.
 */
class ContenidoData extends ContenidoHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;

    /*
     *  Métodos para validar y establecer los datos.
     */

    /*
     * Método para validar y establecer el ID del contenido.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenido es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el nombre del contenido.
     * Verifica que sea alfanumérico y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
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

    /*
     * Método para validar y establecer la unidad del contenido.
     * Verifica que sea alfanumérico y que su longitud esté entre los valores permitidos.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setUnidad($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'La unidad debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->unidad = $value;
            return true;
        } else {
            $this->data_error = 'La Unidad debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad del contenido.
     * Verifica que sea un número natural.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad  = $value;;
            return true;
        } else {
            $this->data_error = 'La cantidad tiene que ser un numero entero';
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
}
