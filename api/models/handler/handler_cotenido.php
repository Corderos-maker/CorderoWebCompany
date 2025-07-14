<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas Requisición y DETALLE_REQUISICIÓN.
*/
class ContenidoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $unidad = null;
    protected $cantidad = null;

    // * métodos SCRUD (SEARCH. CREATE, READ, UPDATE, DELETE) para la tabla de contenido.

    // ? Obtiene todos los registros cuyo campo unidad_contenido es 'Piezas'.
    public function readRowsPiezas()
    {
        $this->unidad = 'Piezas';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `unidad_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los registros cuyo campo unidad_contenido es 'Metros'.
    public function readRowsMetros()
    {
        $this->unidad = 'Metros';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `unidad_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Empaque'.
    public function readRowsEmpaque()
    {
        $this->unidad = 'Empaque';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `nombre_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Rollos'.
    public function readRowsRollos()
    {
        $this->unidad = 'Rollos';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `nombre_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Bobinas'.
    public function readRowsBobinas()
    {
        $this->unidad = 'Bobinas';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `nombre_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los registros cuyo campo nombre_contenido es 'Otros'.
    public function readRowsOtros()
    {
        $this->unidad = 'Otros';
        $sql = 'SELECT * FROM `tb_contenidos` WHERE `nombre_contenido` =?';
        $params = array($this->unidad);
        return Database::getRows($sql, $params);
    }

    // ? Inserta un nuevo registro en la tabla tb_contenidos.
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_contenidos`(
                    `nombre_contenido`,
                    `unidad_contenido`,
                    `cantidad_contenido`
                )
                VALUES(
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->unidad, $this->cantidad);
        return Database::executeRow($sql, $params);
    }

    // ? Obtiene todos los registros de la tabla tb_contenidos.
    public function readAll()
    {
        $sql = 'SELECT * FROM `tb_contenidos`';
        return Database::getRows($sql);
    }

    // ? Obtiene un registro específico de la tabla tb_contenidos según el id_contenido.
    public function readOne()
    {
        $sql = 'SELECT * FROM `tb_contenidos` WHERE
                    `id_contenido` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Empaque'.
    public function readOnlyEmpaque()
    {
        $this->nombre = 'Empaque';
        $sql = 'SELECT
                    `unidad_contenido`,
                    `cantidad_contenido`
                FROM
                    `tb_contenidos`
                WHERE
                    `nombre_contenido` = ?';
        $params = array($this->nombre);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Rollos'.
    public function readOnlyRollos()
    {
        $this->nombre = 'Rollos';
        $sql = 'SELECT
                    `unidad_contenido`,
                    `cantidad_contenido`
                FROM
                    `tb_contenidos`
                WHERE
                    `nombre_contenido` = ?';
        $params = array($this->nombre);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Bobinas'.
    public function readOnlyBobinas()
    {
        $this->nombre = 'Bobinas';
        $sql = 'SELECT
                    `unidad_contenido`,
                    `cantidad_contenido`
                FROM
                    `tb_contenidos`
                WHERE
                    `nombre_contenido` = ?';
        $params = array($this->nombre);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene solo la unidad y cantidad de los registros cuyo nombre_contenido es 'Otros'.
    public function readOnlyOtros()
    {
        $this->nombre = 'Otros';
        $sql = 'SELECT
                    `unidad_contenido`,
                    `cantidad_contenido`
                FROM
                    `tb_contenidos`
                WHERE
                    `nombre_contenido` = ?';
        $params = array($this->nombre);
        return Database::getRows($sql, $params);
    }

    // ? Actualiza un registro específico de la tabla tb_contenidos según el id_contenido.
    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_contenidos`
                SET
                    `nombre_contenido` = ?,
                    `unidad_contenido` = ?,
                    `cantidad_contenido` = ?
                WHERE
                    `id_contenido` = ?';
        $params = array($this->nombre, $this->unidad, $this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? Elimina un registro específico de la tabla tb_contenidos según el id_contenido.
    public function deleteRow()
    {
        $sql = 'DELETE FROM `tb_contenidos` WHERE `id_contenido` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
