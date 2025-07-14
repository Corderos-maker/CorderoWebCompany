<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class EmpleadoHandler
{
    // ? declaración de variables de la base ded datos
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $dui = null;
    protected $telefono = null;
    protected $actualizacion = null;
    protected $imagen = null;
    protected $departamento = null;
    protected $municipio = null;

    // ? Constructor: inicializa la fecha de actualización con la fecha y hora actual.
    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    // ? Devuelve la fecha de la última actualización del empleado.
    public function getActualizacion()
    {
        return $this->actualizacion;
    }

    const RUTA_IMAGEN = '../../images/empleados/';

    //* métodos SCRUD (search, create, read, update, and delete) para el manejo de variables 

    // ? Busca empleados por nombre, apellido, DUI o teléfono.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_empleado`,
                    `departamento_empleado`,
                    `municipio_empleado`,
                    `estado_empleado`
                FROM
                    `tb_empleados`
                WHERE
                    `nombre_empleado` LIKE ? OR 
                    `apellido_empleado` LIKE ? OR 
                    `DUI_empleado` LIKE ? OR 
                    `telefono_empleado` LIKE ? 
        ';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    // ? Inserta un nuevo empleado en la base de datos.
    public function createRow()
    {
        $sql = 'INSERT INTO `tb_empleados`(
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
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
        $params = array($this->nombre, $this->apellido, $this->dui, $this->telefono, $this->imagen, $this->departamento, $this->municipio, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    // ? Obtiene todos los empleados, indicando si están agregados a una dupla.
    public function readAll()
    {
        $sql = 'SELECT
                    e.`id_empleado`,
                    e.`nombre_empleado`,
                    e.`apellido_empleado`,
                    e.`DUI_empleado`,
                    e.`telefono_personal_empleado`,
                    e.`imagen_empleado`,
                    e.`departamento_trabajo_empleado`,
                    e.`municipio_trabajo_empleado`,
                    e.`fecha_actualizacion_empleado`,
                    CASE 
                        WHEN d1.id_empleado1 IS NOT NULL OR d2.id_empleado2 IS NOT NULL THEN 1
                        ELSE 0
                    END AS `empleado_agregado`
                FROM
                    `tb_empleados` e
                LEFT JOIN
                    `tb_duplas` d1 ON e.`id_empleado` = d1.`id_empleado1`
                LEFT JOIN
                    `tb_duplas` d2 ON e.`id_empleado` = d2.`id_empleado2`
                GROUP BY
                    e.`id_empleado`';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los empleados ordenados por nombre.
    public function readByName()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `nombre_empleado`;';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los empleados ordenados por nombre descendente.
    public function readByNameDesc()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `nombre_empleado` DESC';
        return Database::getRows($sql);
    }

    // ? Obtiene todos los empleados ordenados por fecha de actualización descendente.
    public function readByModify()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `fecha_actualizacion_empleado` DESC';
        return Database::getRows($sql);
    }
    // ! TERMINAR ESTO CON DUPLAS
    // public function readByInformation()
    // {
    //     $sql = 'SELECT
    //                 e.id_empleado,
    //                 e.nombre_empleado,
    //                 e.apellido_empleado,
    //                 e.DUI_empleado,
    //                 e.telefono_personal_empleado,
    //                 e.imagen_empleado,
    //                 e.fecha_actualizacion_empleado,
    //                 CASE WHEN t.id_empleado IS NOT NULL THEN 1 ELSE 0
    //             END AS empleado_agregado,
    //             COALESCE(t.estado_trabajo_empleado, 0) AS estado_trabajo_empleado
    //             FROM
    //                 tb_empleados e
    //             LEFT JOIN tb_trabajo_empleado t ON
    //                 e.id_empleado = t.id_empleado
    //             WHERE
    //                 t.id_empleado IS NOT NULL; -- Filtra solo los empleados agregados';
    //     return Database::getRows($sql);
    // }

    // public function readByNoInformation()
    // {
    //     $sql = 'SELECT
    //                 e.id_empleado,
    //                 e.nombre_empleado,
    //                 e.apellido_empleado,
    //                 e.DUI_empleado,
    //                 e.telefono_personal_empleado,
    //                 e.imagen_empleado,
    //                 e.fecha_actualizacion_empleado,
    //                 CASE WHEN t.id_empleado IS NOT NULL THEN 1 ELSE 0
    //             END AS empleado_agregado,
    //             COALESCE(t.estado_trabajo_empleado, 0) AS estado_trabajo_empleado
    //             FROM
    //                 tb_empleados e
    //             LEFT JOIN tb_trabajo_empleado t ON
    //                 e.id_empleado = t.id_empleado
    //             WHERE
    //                 t.id_empleado IS NULL; -- Filtra solo los empleados agregados';
    //     return Database::getRows($sql);
    // }

    // ? Obtiene el nombre del archivo de imagen del empleado según su ID.
    public function readFilename()
    {
        $sql = 'SELECT
                    `imagen_empleado`
                FROM
                    `tb_empleados`
                WHERE
                    `id_empleado` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? Obtiene los datos de un empleado específico por su ID.
    public function readOne()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados`
                WHERE `id_empleado` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? Actualiza los datos de un empleado específico.
    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_empleados`
                SET
                    `nombre_empleado` = ?,
                    `apellido_empleado` = ?,
                    `DUI_empleado` = ?,
                    `telefono_personal_empleado` = ?,
                    `imagen_empleado` = ?,
                    `departamento_trabajo_empleado` = ?,
                    `municipio_trabajo_empleado` = ?,
                    `fecha_actualizacion_empleado` = ?
                WHERE
                    `id_empleado` = ?';
        $params = array($this->nombre, $this->apellido, $this->dui, $this->telefono, $this->imagen, $this->departamento, $this->municipio, $this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    // ? Elimina un empleado específico de la base de datos.
    public function deleteRow()
    {
        $sql = '  DELETE FROM `tb_empleados` 
                WHERE `id_empleado` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
