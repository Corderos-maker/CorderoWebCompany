<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class TrabajoDuplaHandler
{
    // ? declaración de variables de la base ded datos
    protected $id = null;
    protected $horaInicio = null;
    protected $horaFinal = null;
    protected $estado = null;
    protected $dupla = null;
    protected $actualizacion = null;
    // protected $estado = null;

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

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_trabajo_duplas`(
                    `estado_trabajo_dupla`,
                    `id_dupla`,
                    `fecha_actualizacion_trabajo_dupla`
                )
                VALUES(
                    0,
                    ?,
                    ?
                )';
        $params = array($_SESSION['idDupla'], $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    // ? Crea un nuevo registro de trabajo de dupla para la dupla en sesión.
    public function adminCreateRow()
    {
        $sql = 'INSERT INTO `tb_trabajo_duplas`(
                    `estado_trabajo_dupla`,
                    `id_dupla`,
                    `fecha_actualizacion_trabajo_dupla`
                )
                VALUES(
                    0,
                    ?,
                    ?
                )';
        $params = array($this->dupla, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    // ? Obtiene el estado de trabajo de la dupla en sesión.
    public function readInformation()
    {
        $sql = 'SELECT
                    `id_trabajo_dupla`,
                    `estado_trabajo_dupla`
                FROM
                    `tb_trabajo_duplas` tdp
                INNER JOIN tb_duplas dp ON
                    tdp.id_dupla = dp.id_dupla
                WHERE
                    dp.id_dupla = ?';
        $params = array($_SESSION['idDupla']);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene todos los empleados registrados.
    public function readAll()
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
                    `tb_empleados`';
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

    // ? Obtiene los 5 trabajos de dupla más recientes (activos).
    public function readByActive5()
    {
        $sql = 'SELECT
                    tdp.id_trabajo_dupla,
                    tdp.hora_inicio_trabajo_dupla,
                    dp.usuario_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    dp.id_dupla
                FROM tb_trabajo_duplas tdp
                INNER JOIN tb_duplas dp ON tdp.id_dupla = dp.id_dupla
                INNER JOIN tb_empleados e1 ON dp.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON dp.id_empleado2 = e2.id_empleado
                ORDER BY tdp.hora_inicio_trabajo_dupla DESC 
                LIMIT 5;';
        return Database::getRows($sql);
    }

    // ? Obtiene los 5 trabajos de dupla más recientes (inactivos/finalizados).
    public function readByInactive5()
    {
        $sql = 'SELECT
                    tdp.id_trabajo_dupla,
                    tdp.hora_final_trabajo_dupla,
                    dp.usuario_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    dp.id_dupla
                FROM tb_trabajo_duplas tdp
                INNER JOIN tb_duplas dp ON tdp.id_dupla = dp.id_dupla
                INNER JOIN tb_empleados e1 ON dp.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON dp.id_empleado2 = e2.id_empleado
                ORDER BY tdp.hora_final_trabajo_dupla DESC 
                LIMIT 5;';
        return Database::getRows($sql);
    }

    // ? Inicia el trabajo de la dupla actual, registrando la hora de inicio y cambiando el estado a activo.
    public function startWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_duplas`
                SET
                    `hora_inicio_trabajo_dupla` = ?,
                    `estado_trabajo_dupla` = 1
                WHERE
                `id_dupla` = ?';
        $params = array($this->actualizacion, $_SESSION['idDupla']);
        return Database::executeRow($sql, $params);
    }

    // ? Finaliza el trabajo de la dupla actual, registrando la hora de finalización y cambiando el estado a inactivo.
    public function endWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_duplas`
                SET
                    `hora_final_trabajo_dupla` = ?,
                    `estado_trabajo_dupla` = 0
                WHERE
                    `id_dupla` = ?';
        $params = array($this->actualizacion, $_SESSION['idDupla']);
        return Database::executeRow($sql, $params);
    }

    // todo Métodos para el manejo del histórico de las jornadas de trabajo
    // método para registrar  los datos del inicio o fin de la jornada laboral dupla
    public function historyWork($type)
    {
        $this->estado = $type;
        $sql = 'INSERT INTO `tb_trabajo_historial`(
                    `fecha_trabajo_historial`,
                    `tipo_trabajo_historial`,
                    `id_dupla`
                )
                VALUES(
                    ?,
                    ?,
                    ?)';
        $params = array($this->actualizacion, $this->estado, $_SESSION['idDupla']);
        return DATABASE::executeRow($sql, $params);
    }

    // ? Obtiene toda la información de trabajos de dupla más recientes (activos).
    public function readAllJourney()
    {
        $sql = 'SELECT
                    th.id_trabajo_historial,
                    th.tipo_trabajo_historial,
                    th.fecha_trabajo_historial,
                    d.usuario_dupla AS codigo_dupla
                FROM
                    tb_trabajo_historial th
                INNER JOIN tb_duplas d ON th.id_dupla = d.id_dupla
                WHERE th.id_dupla = ?
                ORDER BY
                    th.fecha_trabajo_historial DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene los inicios trabajos de dupla más recientes (activos).
    public function readJourneyStart()
    {
        $sql = 'SELECT
                    th.id_trabajo_historial,
                    th.tipo_trabajo_historial,
                    th.fecha_trabajo_historial,
                    d.usuario_dupla AS codigo_dupla
                FROM
                    tb_trabajo_historial th
                INNER JOIN tb_duplas d ON th.id_dupla = d.id_dupla
                WHERE th.tipo_trabajo_historial = 1
                AND th.id_dupla = ?
                ORDER BY
                    th.fecha_trabajo_historial DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene los inicios trabajos de dupla más recientes (activos).
    public function readJourneyEnds()
    {
        $sql = 'SELECT
                    th.id_trabajo_historial,
                    th.tipo_trabajo_historial,
                    th.fecha_trabajo_historial,
                    d.usuario_dupla AS codigo_dupla
                FROM
                    tb_trabajo_historial th
                INNER JOIN tb_duplas d ON th.id_dupla = d.id_dupla
                WHERE th.tipo_trabajo_historial = 0
                AND th.id_dupla = ?
                ORDER BY
                    th.fecha_trabajo_historial DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // método para mostrar los 5 inicios de jornadas mas recientes
    public function readBy5Inicio()
    {
        $sql = 'SELECT
                th.id_trabajo_historial,
                th.fecha_trabajo_historial,
                d.usuario_dupla AS codigo_dupla
            FROM
                tb_trabajo_historial th
            INNER JOIN tb_duplas d ON th.id_dupla = d.id_dupla
            WHERE
                th.tipo_trabajo_historial = 1
                AND th.id_dupla = ?
            ORDER BY
                th.fecha_trabajo_historial DESC
            LIMIT 5';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // método para mostrar los 5 finalizaciones de jornadas mas recientes
    public function readBy5Fin()
    {
        $sql = 'SELECT
                th.id_trabajo_historial,
                th.fecha_trabajo_historial,
                d.usuario_dupla AS codigo_dupla
            FROM
                tb_trabajo_historial th
            INNER JOIN tb_duplas d ON th.id_dupla = d.id_dupla
            WHERE
                th.tipo_trabajo_historial = 0
                AND th.id_dupla = ?
            ORDER BY
                th.fecha_trabajo_historial DESC
            LIMIT 5';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }
}
