<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_trabajo_dupla.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class TrabajoDuplaData extends TrabajoDuplaHandler
{
    // atributo genérico para manejo de errores
    private $data_error = null;
    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    /*
     * Método para validar y establecer el ID del registro de trabajo de la dupla.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la información es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el estado del trabajo de la dupla.
     * Verifica que sea un valor booleano.
     * Retorna true si es válido, de lo contrario false y guarda el error.
     */
    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el ID de la dupla asociada al trabajo.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setDupla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dupla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la información es incorrecto';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
