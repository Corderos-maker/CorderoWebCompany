<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
* Clase para manejar el comportamiento de los datos de la tabla herramientas.
*/
class HerramientaHandler
{
    //* declaración de variables de la tabla herramientas
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $categoria = null;
    protected $sub = null;
    protected $cantidad = null;
    protected $visibilidad = null;
    protected $imagen = null;
    protected $administrador = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/herramientas/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //  ? función para buscar un registro 
    public function searchRows()
{
    $value = '%' . Validator::getSearchValue() . '%';
    $sql = 'SELECT
                `id_herramienta`,
                `nombre_herramienta`,
                `descripcion_herramienta`,
                `categoria_herramienta`,
                `sub_manual_herramienta`,
                `cantidad_herramienta`,
                `visibilidad_herramienta`,
                `imagen_herramienta`,
                hr.`id_administrador`,
                ad.nombre_administrador,
                ad.apellido_administrador,
                ad.alias_administrador
            FROM
                `tb_herramientas` hr
            INNER JOIN tb_administradores ad ON
                hr.id_administrador = ad.id_administrador
            WHERE nombre_herramienta LIKE ? 
            OR descripcion_herramienta LIKE ? 
            OR alias_administrador LIKE ? 
            OR nombre_administrador LIKE ? 
            OR apellido_administrador LIKE ?';
    $params = array($value, $value, $value, $value, $value);
    return Database::getRows($sql, $params);
}

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_herramientas`(
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    `id_administrador`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->descripcion, $this->categoria, $this->sub, $this->cantidad, $this->visibilidad, $this->imagen, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // ? función para leer todos los registros
    public function readAll()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    hr.`id_administrador`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    ad.alias_administrador
                FROM
                    `tb_herramientas` hr
                INNER JOIN tb_administradores ad ON
                    hr.id_administrador = ad.id_administrador';
        return Database::getRows($sql);
    }

    // ? función para leer todos los registros de categoría manual ligera
    public function readByLight()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    hr.`id_administrador`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    ad.alias_administrador
                FROM
                    `tb_herramientas` hr
                INNER JOIN tb_administradores ad ON
                    hr.id_administrador = ad.id_administrador
                    where `sub_manual_herramienta` = 1';
        return Database::getRows($sql);
    }

    // ? función para leer todos los registros
    public function readByHeavy()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    hr.`id_administrador`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    ad.alias_administrador
                FROM
                    `tb_herramientas` hr
                INNER JOIN tb_administradores ad ON
                    hr.id_administrador = ad.id_administrador
                    where `sub_manual_herramienta` = 2';
        return Database::getRows($sql);
    }

    // ? función para leer todos los registros
    public function readByElectric()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    hr.`id_administrador`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    ad.alias_administrador
                FROM
                    `tb_herramientas` hr
                INNER JOIN tb_administradores ad ON
                    hr.id_administrador = ad.id_administrador
                    where `sub_manual_herramienta` = 0';
        return Database::getRows($sql);
    }

    // ? función para leer todos los registros
    public function readByEPP()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`,
                    hr.`id_administrador`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    ad.alias_administrador
                FROM
                    `tb_herramientas` hr
                INNER JOIN tb_administradores ad ON
                    hr.id_administrador = ad.id_administrador
                    where `sub_manual_herramienta` = 3';
        return Database::getRows($sql);
    }

    // ? función para leer un registro específico
    public function readOne()
    {
        $sql = 'SELECT
                    `id_herramienta`,
                    `nombre_herramienta`,
                    `descripcion_herramienta`,
                    `categoria_herramienta`,
                    `sub_manual_herramienta`,
                    `cantidad_herramienta`,
                    `visibilidad_herramienta`,
                    `imagen_herramienta`
                FROM
                    `tb_herramientas`
                WHERE
                    `id_herramienta` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? función para leer la imagen de un registro
    public function readFilename()
    {
        $sql = 'SELECT`imagen_herramienta` FROM `tb_herramientas` WHERE `id_herramienta` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? función para actualizar un registro
    public function updateRow()
    {
        $sql = 'UPDATE `tb_herramientas`
                SET
                    `nombre_herramienta` = ?,
                    `descripcion_herramienta` = ?,
                    `categoria_herramienta` = ?,
                    `sub_manual_herramienta` = ?,
                    `cantidad_herramienta` = ?,
                    `visibilidad_herramienta` = ?,
                    `imagen_herramienta` = ?,
                    `id_administrador` = ?
                WHERE
                    `id_herramienta` = ?';
        $params = array($this->nombre, $this->descripcion, $this->categoria, $this->sub, $this->cantidad, $this->visibilidad, $this->imagen, $this->id, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // ? función para eliminar un registro
    public function deleteRow()
    {
        $sql = 'DELETE FROM `tb_herramientas` WHERE `id_herramienta` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // * métodos para actualizar agregar o restar herramientas

    public function addQuantity()
    {
        $sql = 'UPDATE `tb_herramientas`
                SET `cantidad_herramienta` = `cantidad_herramienta` + ?
                WHERE `id_herramienta` = ?';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }   

    public function subtractQuantity()
    {
        $sql = 'UPDATE `tb_herramientas`
                SET `cantidad_herramienta` = `cantidad_herramienta` - ?
                WHERE `id_herramienta` = ?';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }
}
