<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas Consumibles
*/
class ConsumiblesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $limite = null;
    protected $cantidad = null;
    protected $categoria = null;
    protected $imagen = null;
    protected $administrador = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/consumible/';

    // * métodos SCRUD (SEARCH. CREATE, READ, UPDATE, DELETE) para la tabla de contenido.

    // ? metodo para crear un nuevo registro de consumible.
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_consumibles`(
                    `nombre_consumible`,
                    `descripcion_consumible`,
                    `cantidad_limite_consumible`,
                    `cantidad_consumible`,
                    `imagen_consumible`,
                    `id_categoria`,
                    `id_administrador`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->descripcion, $this->limite, $this->cantidad, $this->imagen, $this->categoria, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // ? metodo para obtener todos los registros de consumibles.
    public function readAll()
    {
        $sql = 'SELECT
                    `id_consumible`,
                    `nombre_consumible`,
                    `descripcion_consumible`,
                    `cantidad_limite_consumible`,
                    `cantidad_consumible`,
                    `imagen_consumible`,
                    CASE WHEN cantidad_consumible <= cantidad_limite_consumible THEN 1 ELSE 0
                END AS necesita_reposicion,
                cs.`id_categoria`,
                cc.nombre_categoria,
                cc.descripcion_categoria,
                cs.`id_administrador`,
                ad.nombre_administrador,
                ad.apellido_administrador,
                ad.alias_administrador
                FROM
                    `tb_consumibles` cs
                INNER JOIN tb_categoria_consumibles cc ON
                    cs.id_categoria = cc.id_categoria
                INNER JOIN tb_administradores ad ON
                    cs.id_administrador = ad.id_administrador';
        return Database::getRows($sql);
    }

    // ? método para obtener un registro específico de consumible.
    public function readOne()
    {
        $sql = 'SELECT
                    `id_consumible`,
                    `nombre_consumible`,
                    `descripcion_consumible`,
                    `cantidad_limite_consumible`,
                    `cantidad_consumible`,
                    `imagen_consumible`,
                    `id_categoria`,
                    `id_administrador`
                FROM
                    `tb_consumibles`
                WHERE
                    `id_consumible` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? método para obtener una imagen de un registro específico de consumible.
    public function readFilename()
    {
        $sql = 'SELECT `imagen_consumible`
                FROM
                    `tb_consumibles` WHERE `id_consumible` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? método para actualizar un registro de consumible.
    public function updateRow(){
        $sql = 'UPDATE `tb_consumibles`
                SET
                    `nombre_consumible` = ?,
                    `descripcion_consumible` = ?,
                    `cantidad_limite_consumible` = ?,
                    `cantidad_consumible` = ?,
                    `imagen_consumible` = ?,
                    `id_categoria` = ?,
                    `id_administrador` = ?
                WHERE
                    `id_consumible` = ?';
        $params = array($this->nombre, $this->descripcion, $this->limite, $this->cantidad, $this->imagen, $this->categoria, $_SESSION['idAdministrador'], $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? método para agregar cantidad a un consumible.
    public function addQuantity()
    {
        $sql = 'UPDATE `tb_consumibles`
                SET `cantidad_consumible` = `cantidad_consumible` + ?
                WHERE `id_consumible` = ?';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? método para restar cantidad a un consumible.
    public function subtractQuantity()
    {
        $sql = 'UPDATE `tb_consumibles`
                SET `cantidad_consumible` = `cantidad_consumible` - ?
                WHERE `id_consumible` = ?';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? método para eliminar un registro de consumible.
    public function deleteRow()
    {
        $sql = 'DELETE FROM `tb_consumibles` WHERE `id_consumible` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
