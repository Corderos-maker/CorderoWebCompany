<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class EvidenciaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_evidencia = null;
    protected $id_detalle = null;
    protected $imagen1 = null;
    protected $imagen2 = null;
    protected $estado = null;
    protected $actualizacion = null;

    // ? Constructor: inicializa la fecha de actualización con la fecha y hora actual.
    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    // ? Devuelve la fecha de la última actualización del registro.
    public function getActualizacion()
    {
        return $this->actualizacion;
    }
    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN1 = '../../images/evidencia/';
    const RUTA_IMAGEN2 = '../../images/evidencia/';

    // ? método para comprobar si existe una imagen con el pedido actual.
    public function getEvidencia()
    {
        $this->estado = 1; // Estado por defecto: pendiente
        $sql = 'SELECT `id_evidencia_herramienta` FROM `tb_evidencias_herramientas` 
                WHERE `id_detalle_herramienta` = ? AND `estado_evidencia_herramienta` = ?';
        $params = array($this->id_detalle, $this->estado);
        if ($data = Database::getRow($sql, $params)) {
            $this->id_evidencia = $data['id_evidencia_herramienta'];
            return true;
        } else {
            // echo ('evidencia NO ENCONTRADA AAAAAA');
            return false;
        }
    }

    // * métodos SCRUD para manejar las imágenes de evidencia de herramientas.

    // método para crear un registro de evidencia de herramienta.
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_evidencias_herramientas`(
                    `fecha_evidencia_herramienta`,
                    `imagen_evidencia_herramienta1`,
                    `imagen_evidencia_herramienta2`,
                    `estado_evidencia_herramienta`,
                    `id_detalle_herramienta`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    1,
                    ?)';
        $params = array($this->actualizacion, $this->imagen1, $this->imagen2, $this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? método para leer las imágenes de un registro específico de herramienta.
    public function readDetail()
    {
        $sql = 'SELECT
                `id_evidencia_herramienta`,
                `imagen_evidencia_herramienta1`,
                `imagen_evidencia_herramienta2`
            FROM
                `tb_evidencias_herramientas`
            WHERE
                `id_detalle_herramienta` = ?;';
        $params = array($this->id_detalle);
        return Database::getRow($sql, $params);
    }

    // ? método para obtener una imagen de un registro específico de consumible.
    public function readFilename1()
    {
        $sql = 'SELECT `imagen_evidencia_herramienta1`
                FROM `tb_evidencias_herramientas` WHERE `id_evidencia_herramienta` = ? ';
        $params = array($this->id_evidencia);
        return Database::getRow($sql, $params);
    }

    public function readFilename2()
    {
        $sql = 'SELECT `imagen_evidencia_herramienta2`
                FROM `tb_evidencias_herramientas` WHERE `id_evidencia_herramienta` = ? ';
        $params = array($this->id_evidencia);
        return Database::getRow($sql, $params);
    }

    // método para editar un registro
    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_evidencias_herramientas`
                SET
                    `fecha_evidencia_herramienta` =  ?,
                    `imagen_evidencia_herramienta1` = ? ,
                    `imagen_evidencia_herramienta2` = ? ,
                    `estado_evidencia_herramienta` =  1
                WHERE
                    `id_evidencia_herramienta` = ?';
        $params = array($this->actualizacion, $this->imagen1, $this->imagen2, $this->id_evidencia);
        return Database::executeRow($sql, $params);
    }
}
