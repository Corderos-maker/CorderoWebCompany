<?php
// se incluye la clase para  trabaja con la base de datos 
require_once('../../helpers/database.php');
// ? clase para controlar el comportamiento de la tabla de la base de datos
class MaterialHandler
{
    // ? declaración de atributos para el manejo de la base de datos  
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $categoria = null;
    protected $codigo = null;
    protected $nombre_contenido = null;
    protected $cantidad_contenido = null;
    protected $minima = null;
    protected $cantidad = null;
    protected $imagen = null;
    protected $visible = null;
    protected $fecha = null;
    protected $administrador = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/material/';

    // ? Constructor: inicializa la fecha del material con la fecha y hora actual.
    public function __construct()
    {
        $this->fecha = date('Y-m-d H:i:s'); // Formato año-mes-día
    }

    // ? Devuelve la fecha actual asignada al material.
    public function getFecha()
    {
        return $this->fecha;
    }

    // * Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).

    // ? Busca materiales por nombre, descripción, código, categoría o fecha.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT`id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE
                    `nombre_material` LIKE ? OR `descripcion_material` LIKE ? OR `codigo_material` LIKE ? OR `categoria_material` LIKE ? OR `fecha_material` LIKE ?';
        $params = array($value, $value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    // ? Inserta un nuevo material en la base de datos.
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_materiales`(
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `id_contenido`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    `id_administrador`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    (
                    SELECT
                        `id_contenido`
                    FROM
                        `tb_contenidos`
                    WHERE
                        `nombre_contenido` = ? AND `cantidad_contenido` = ?
                ),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
                )';
        $params = array(
            $this->nombre,
            $this->descripcion,
            $this->categoria,
            $this->codigo,
            $this->nombre_contenido,
            $this->cantidad_contenido,
            $this->minima,
            $this->cantidad,
            $this->imagen,
            $this->fecha,
            $this->visible,
            $_SESSION['idAdministrador']
        );
        return Database::executeRow($sql, $params);
    }

    // ? métodos para mostrar todos los datos
    public function readAll()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                ORDER BY
                    necesita_reposicion
                DESC
                    ,
                    (
                        cantidad_minima_material - cantidad_material
                    )
                DESC;';
        return Database::getRows($sql);
    }

    // ? Obtiene el nombre del archivo de imagen del material según su ID.
    public function readFilename()
    {
        $sql = 'SELECT imagen_material
                FROM tb_materiales
                WHERE id_material = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? Obtiene los datos de un material específico por su ID.
    public function readOne()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `visibilidad_material`
                FROM
                    `tb_materiales` mt
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE
                    mt.id_material = ?;';
        $params = array($this->id);
        return database::getRow($sql, $params);
    }

    // * métodos para todos mostrar los datos ordenados por las categorías

    // ? Obtiene todos los materiales de la categoría "Uso habitual".
    public function readByCategory1()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE categoria_material= "Uso habitual" 
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales de la categoría "Material para CL200".
    public function readByCategory2()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE categoria_material= "Material para CL200"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales de la categoría "Acometida especial".
    public function readByCategory3()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE categoria_material= "Acometida especial"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales de la categoría "Subterráneo".
    public function readByCategory4()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE categoria_material= "Subterráneo"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales de la categoría "Antihurto y telegestión".
    public function readByCategory5()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE categoria_material= "Antihurto y telegestión"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'Agregados o alterados recientemente'
    public function readByModify()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                ORDER BY
                    mt.`fecha_material` desc';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'Agregados o alterados recientemente'
    public function readByStock5()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                WHERE
                    cantidad_material <= cantidad_minima_material
                ORDER BY
                    necesita_reposicion
                DESC
                    ,
                    (
                        cantidad_minima_material - cantidad_material
                    )
                DESC
                LIMIT 5;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales ordenados por mayor cantidad en stock.
    public function readByMax()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                ORDER BY
                    `cantidad_material` DESC';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los materiales ordenados por menor cantidad en stock.
    public function readByMin()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    ct.cantidad_contenido,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `fecha_material`,
                    `visibilidad_material`,
                    mt.id_administrador,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                    CASE WHEN cantidad_material <= cantidad_minima_material THEN 1 ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                INNER JOIN tb_contenidos ct ON
                    mt.id_contenido = ct.id_contenido
                ORDER BY
                    `cantidad_material` ASC';
        return Database::getRows($sql);
    }

    // ? Actualiza los datos de un material específico.
    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_materiales`
                SET
                    `nombre_material` = ?,
                    `descripcion_material` = ?,
                    `categoria_material` = ?,
                    `codigo_material` = ?,
                    `id_contenido` =(
                    SELECT
                        `id_contenido`
                    FROM
                        `tb_contenidos`
                    WHERE
                        `nombre_contenido` = ? AND `cantidad_contenido` = ?
                ),
                `cantidad_minima_material` = ?,
                `cantidad_material` = ?,
                `imagen_material` = ?,
                `fecha_material` = ?,
                `visibilidad_material` = ?,
                `id_administrador` = ?
                WHERE
                    `id_material` = ?';
        $params = array(
            $this->nombre,
            $this->descripcion,
            $this->categoria,
            $this->codigo,
            $this->nombre_contenido,
            $this->cantidad_contenido,
            $this->minima,
            $this->cantidad,
            $this->imagen,
            $this->fecha,
            $this->visible,
            $_SESSION['idAdministrador'],
            $this->id
        );
        return Database::executeRow($sql, $params);
    }

    // ? Suma una cantidad al stock de un material.
    public function addQuantity()
    {
        $sql = 'UPDATE `tb_materiales` 
        SET `cantidad_material` = 
        `cantidad_material` + ?,
        `fecha_material` = ?,
        `id_administrador` = ?
        WHERE `id_material` = ?
        ';
        $params = array($this->cantidad, $this->fecha, $_SESSION['idAdministrador'], $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? Resta una cantidad al stock de un material.
    public function restQuantity()
    {
        $sql = 'UPDATE `tb_materiales` 
        SET `cantidad_material` = 
        `cantidad_material` - ?,
        `fecha_material` = ?,
        `id_administrador` = ?
        WHERE `id_material` = ?
        ';
        $params = array($this->cantidad, $this->fecha, $_SESSION['idAdministrador'], $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? Elimina un material específico de la base de datos.
    public function DeleteRow()
    {
        $sql = 'DELETE FROM `tb_materiales` WHERE `id_material` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
