<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_pedido_herramientas.php');
/*
*	Clase para manejar el encapsulamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class PedidoHerramientaData extends PedidoHerramientasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
    *   Métodos para validar y establecer los datos.
    */
    public function setIdPedido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_pedido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del pedido';
            return false;
        }
    }
    
    /*
     * Método para validar y establecer el ID del detalle de la requisición.
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
     * Método para validar y establecer el ID de la dupla asociada a la requisición.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setDupla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dupla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la dupla es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer el ID de la herramienta solicitado en el pedido.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setHerramienta($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->herramienta = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la herramienta es incorrecto';
            return false;
        }
    }

    /*
     * Método para validar y establecer la cantidad de material solicitada.
     * Retorna true si el valor es un número natural válido, de lo contrario false y guarda el error.
     */
    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad de material es tiene que ser mayor o igual a 1';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}