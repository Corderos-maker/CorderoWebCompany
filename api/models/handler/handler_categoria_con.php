<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla categorías consumibles.
 */
class CategoriaHandler
{
    //* declaración de variables de la tabla categorías
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $imagen = null;
    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/categoria/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_categoria`,
                    `nombre_categoria`,
                    `descripcion_categoria`,
                    `imagen_categoria`
                FROM
                    `tb_categoria_consumibles`
                WHERE
                    `nombre_categoria` LIKE ? OR `descripcion_categoria` LIKE ?
                ORDER BY nombre_categoria';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    // ? función para crear un nuevo registros
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_categoria_consumibles`(
                    `nombre_categoria`,
                    `descripcion_categoria`,
                    `imagen_categoria`
                )
                VALUES(
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // ? función para leer todos los registros
    public function readAll()
    {
        $sql = 'SELECT `id_categoria`, `nombre_categoria`, `descripcion_categoria`, `imagen_categoria` FROM `tb_categoria_consumibles`';
        return Database::getRows($sql);
    }

    // ? función para leer un registro
    public function readOne()
    {
        $sql = 'SELECT `id_categoria`, `nombre_categoria`, `descripcion_categoria`, `imagen_categoria` FROM `tb_categoria_consumibles` WHERE `id_categoria` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? función para leer la imagen de un registro
    public function readFilename()
    {
        $sql = 'SELECT`imagen_categoria` FROM `tb_categoria_consumibles` WHERE `id_categoria` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? función para editar un registro
    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_categoria_consumibles`
                SET
                    
                    `nombre_categoria` = ?,
                    `descripcion_categoria` = ?,
                    `imagen_categoria` = ?
                WHERE
                    `id_categoria` = ?';
        $params = array($this->nombre, $this->descripcion, $this->imagen, $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? función para eliminar un registro de la tabla
    public function deleteRow()
    {
        $sql = 'DELETE FROM `tb_categoria_consumibles` WHERE `id_categoria` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
