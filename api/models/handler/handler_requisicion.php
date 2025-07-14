<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *	Clase para manejar el comportamiento de los datos de las tablas Requisición y DETALLE_REQUISICIÓN.
 */
class requisicionHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_requisicion = null;
    protected $id_detalle = null;
    protected $dupla = null;
    protected $material = null;
    protected $cantidad = null;
    protected $estado = null;

    // Aquí puedes implementar los métodos que interactúan con las propiedades de requisiciónHandler

    /*
     *   ESTADOS DE LA REQUISICIÓN
     *   Pendiente (valor por defecto en la base de datos). requisición en proceso y se puede modificar el detalle.
     *   Finalizado. requisición terminada por la dupla y ya no es posible modificar el detalle.
     *   Aproada. requisición enviado la dupla.
     *   Anulado. requisición cancelado por la dupla después de ser finalizado.
     */

    // * métodos SCRUD (Select, Create, Read, Update, Delete) para manejar las requisiciones y detalles de requisiciones

    // método para verificar si existe una requisición o se inicia una nueva
    public function getRequisicion()
    {
        $this->estado = 'Pendiente';
        $sql = "SELECT id_requisicion FROM tb_requisiciones WHERE estado_requisicion = ? AND id_dupla = ?";
        $params = array($this->estado, $_SESSION['idDupla']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idRequisicion'] = $data['id_requisicion'];
            return true;
        } else {
            return false;
        }
    }

    // * método para iniciar una nueva requisición en proceso
    public function startRequisicion()
    {
        if ($this->getRequisicion()) {
            return true;
        } else {
            $sql = 'INSERT INTO `tb_requisiciones`(`id_dupla`)
                    VALUES(?)';
            $params = array($_SESSION['idDupla']);
            if ($_SESSION['idRequisicion'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // método para buscar registros en la tabla del historial
    public function searchRowsHistory()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_requisicion`,
                    `fecha_requisicion`,
                    `fecha_accion_requisicion`,
                    `estado_requisicion`,
                    dp.usuario_dupla,
                    ad.nombre_administrador,
                    ad.apellido_administrador
                FROM
                    `tb_requisiciones` rq
                    INNER JOIN tb_duplas dp on 
                    rq.id_dupla = dp.id_dupla
                    inner JOIN tb_administradores ad ON
                    ad.id_administrador = rq.id_administrador
                    WHERE `estado_requisicion` LIKE ? OR dp.usuario_dupla LIKE ? OR ad.nombre_administrador LIKE ?';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    // ? El administrador crea una requisición sin guardarla en un registro
    public function createRow()
    {
        $this->estado = 'Procesando';
        $sql = 'INSERT INTO `tb_requisiciones`(`id_dupla`, `estado_requisicion`)
                    VALUES(?, ?)';
        $params = array($this->dupla, $this->estado);
        return Database::getLastRow($sql, $params);
    }

    // ? Busca requisiciones anuladas por el administrador.
    public function searchRowsCancel()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = ' SELECT
                    `id_requisicion`,
                    `fecha_requisicion`,
                    `fecha_accion_requisicion`,
                    `estado_requisicion`,
                    dp.usuario_dupla,
                    ad.nombre_administrador,
                    ad.apellido_administrador
                FROM
                    `tb_requisiciones` rq
                    INNER JOIN tb_duplas dp on 
                    rq.id_dupla = dp.id_dupla
                    inner JOIN tb_administradores ad ON
                    ad.id_administrador = rq.id_administrador
                    WHERE dp.usuario_dupla LIKE ? OR ad.nombre_administrador LIKE ? AND estado_requisicion = "Anulada"';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    // ? Método para agregar material a la requisición actual.
    public function createDetail()
    {
        $sql = 'INSERT INTO `tb_detalle_requisiciones`(
                            `cantidad_detalle_requisicion`,
                            `id_material`,
                            `id_requisicion`
                        )
                        VALUES(
                            ?,
                            ?,
                            ?
                        )';
        $params = array($this->cantidad, $this->material, $_SESSION['idRequisicion']);
        return Database::executeRow($sql, $params);
    }

    // ? Método para agregar material a la requisición actual.
    public function createAdminDetail()
    {
        $sql = 'INSERT INTO `tb_detalle_requisiciones`(
                            `cantidad_detalle_requisicion`,
                            `id_material`,
                            `id_requisicion`
                        )
                        VALUES(
                            ?,
                            ?,
                            ?
                        )';
        $params = array($this->cantidad, $this->material, $this->id_requisicion);
        return Database::executeRow($sql, $params);
    }

    // ? método para leer todas las requisiciones en proceso de todas las duplas
    public function readAll()
    {
        $sql = 'SELECT
                    rq.id_requisicion,
                    rq.fecha_requisicion,
                    rq.estado_requisicion,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.estado_requisicion = "Procesando"
                ORDER BY
                    rq.fecha_requisicion ASC;  -- ASC (ascendente) = de más antiguo a más nuevo';
        return Database::getRows($sql);
    }

    // ? Obtiene las 5 requisiciones más antiguas en proceso.
    public function readAll5()
    {
        $sql = 'SELECT
                    rq.id_requisicion,
                    rq.fecha_requisicion,
                    rq.estado_requisicion,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.estado_requisicion = "Procesando"
                ORDER BY
                    rq.fecha_requisicion DESC
                LIMIT 5;  -- ASC (ascendente) = de más antiguo a más nuevo';
        return Database::getRows($sql);
    }

    // ? Obtiene el historial de todas las acciones de requisiciones.
    public function readAllHistory()
    {
        $sql = 'SELECT
                    `id_requisicion`,
                    `fecha_requisicion`,
                    `fecha_accion_requisicion`,
                    `estado_requisicion`,
                    dp.usuario_dupla,
                    ad.alias_administrador
                FROM
                    `tb_requisiciones` rq
                    INNER JOIN tb_duplas dp on 
                    rq.id_dupla = dp.id_dupla
                    inner JOIN tb_administradores ad ON
                    ad.id_administrador = rq.id_administrador';
        return Database::getRows($sql);
    }

    // ? método para leer una requisición en proceso
    public function readOne()
    {
        $sql = 'SELECT
                    rq.`id_requisicion`,
                    rq.`fecha_requisicion`,
                    rq.`estado_requisicion`,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    `tb_requisiciones` rq
                INNER JOIN tb_duplas dp ON
                    rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_requisicion` = ?';
        $params = array($this->id_requisicion);
        return Database::getRow($sql, $params);
    }

    // ? método para obtener 10 requisiciones de una dupla (sin importar el estado de esta)
    public function readBy10()
    {
        $sql = 'SELECT
                    rq.id_requisicion,
                    rq.fecha_requisicion,
                    rq.estado_requisicion,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                    SELECT
                        COUNT(*)
                    FROM
                        tb_detalle_requisiciones dr
                    INNER JOIN tb_materiales m ON
                        dr.id_material = m.id_material
                    WHERE
                        dr.id_requisicion = rq.id_requisicion AND dr.cantidad_detalle_requisicion > m.cantidad_material
                ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON
                    rq.id_dupla = dp.id_dupla
                WHERE rq.id_dupla = ?
                ORDER BY
                    rq.fecha_requisicion
                DESC
                LIMIT 10;';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para leer todas las requisiciones en proceso de todas las duplas
    public function readAllCancel()
    {
        $sql = 'SELECT
                    rq.`id_requisicion`,
                    rq.estado_requisicion,
                    rq.`fecha_requisicion`,
                    rq.`estado_requisicion`,
                    dp.usuario_dupla
                FROM
                    `tb_requisiciones` rq
                INNER JOIN tb_duplas dp ON
                    rq.id_dupla = dp.id_dupla
                INNER JOIN tb_detalle_requisiciones dr ON
                    rq.id_requisicion = dr.id_requisicion
                WHERE
                    rq.`estado_requisicion` = "Anulada"
                GROUP BY
                    rq.id_requisicion
                ORDER BY
                    rq.fecha_requisicion ASC  -- ASC (ascendente) = de más antiguo a más nuevo';
        return Database::getRows($sql);
    }

    // ? método para leer los detalles de la requisición actual
    public function readDetail()
    {
        $sql = 'SELECT
                    `id_detalle_requisicion`,
                    `cantidad_detalle_requisicion`,
                    m.nombre_material,
                    m.categoria_material,
                    ct.nombre_contenido,
                    ct.unidad_contenido,
                    `id_requisicion`
                FROM
                    `tb_detalle_requisiciones` dr
                INNER JOIN tb_materiales m ON
                    m.id_material = dr.id_material
                INNER JOIN tb_contenidos ct ON
                ct.id_contenido = m.id_contenido
                WHERE dr.id_requisicion = ?';
        $params = array($_SESSION['idRequisicion']);
        return Database::getRows($sql, $params);
    }

    // ? método para leer los detalles de la requisición de una dupla
    public function readAllDupla()
    {
        $sql = 'SELECT
                    rq.`id_requisicion`,
                    `fecha_requisicion`,
                    `estado_requisicion`,
                    dp.usuario_dupla
                FROM
                    `tb_requisiciones` rq
                    INNER JOIN tb_duplas dp on rq.id_dupla = dp.id_dupla
                INNER JOIN tb_detalle_requisiciones dr ON
                    rq.id_requisicion = dr.id_requisicion
                WHERE
                    rq.`id_dupla` = ?';
        $params = array($_SESSION['idDupla']);
        return Database::getRows($sql, $params);
    }

    // ? Obtiene los detalles de materiales de una requisición específica, ordenados.
    public function readByOrder()
    {
        $sql = 'SELECT
                    dr.id_detalle_requisicion,
                    m.id_material,
                    m.nombre_material,
                    m.categoria_material,
                    m.codigo_material,
                    dr.cantidad_detalle_requisicion AS cantidad_total,
                    ct.unidad_contenido,
                    fecha_requisicion AS ultima_fecha_requisicion,
                    -- Opcional: muestra la fecha más reciente
                    dr.id_requisicion
                FROM
                    `tb_detalle_requisiciones` dr
                INNER JOIN tb_materiales m ON
                    dr.id_material = m.id_material
                INNER JOIN tb_requisiciones r ON
                    dr.id_requisicion = r.id_requisicion
                INNER JOIN tb_contenidos ct ON
                    ct.id_contenido = m.id_contenido
                WHERE r.id_requisicion = ?';
        $params = array($this->id_requisicion);
        return Database::getRows($sql, $params);
    }

    // ? método para actualizar la cantidad de un material en la requisición actual
    public function updateDetail()
    {
        $sql = 'UPDATE tb_detalle_requisiciones
                SET cantidad_detalle_requisicion = ?
                WHERE id_requisicion = ? AND id_detalle_requisicion = ?';
        $params = array($this->cantidad, $_SESSION['idRequisicion'], $this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? método para actualizar la cantidad de un material en la requisición actual
    public function updateQuantity()
    {
        $sql = 'UPDATE tb_detalle_requisiciones
                SET cantidad_detalle_requisicion = ?
                WHERE id_detalle_requisicion = ?';
        $params = array($this->cantidad, $this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? método para remover una requisicion a papelera
    public function removeRequisicion()
    {
        $this->estado = 'Anulada';
        $sql = 'UPDATE tb_requisiciones
                SET estado_requisicion = ?,
                fecha_accion_requisicion = NOW()
                WHERE id_requisicion = ?';
        $params = array($this->estado, $this->id_requisicion);
        return Database::executeRow($sql, $params);
    }

    // ? método para restaurar una requisicion removida
    public function restoreRequisicion()
    {
        $this->estado = 'Procesando';
        $sql = 'UPDATE tb_requisiciones
                SET estado_requisicion = ?
                WHERE id_requisicion = ?';
        $params = array($this->estado, $this->id_requisicion);
        return Database::executeRow($sql, $params);
    }

    // ? método para eliminar un material de la requisición actual
    public function deleteDetail()
    {
        $sql = 'DELETE FROM tb_detalle_requisiciones
                WHERE id_detalle_requisicion = ? AND id_requisicion = ?';
        $params = array($this->id_detalle, $_SESSION['idRequisicion']);
        return Database::executeRow($sql, $params);
    }

    // ? método para eliminar un material de la requisición actual
    public function deleteMaterial()
    {
        $sql = 'DELETE FROM tb_detalle_requisiciones
                WHERE id_detalle_requisicion = ?';
        $params = array($this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? método para finalizar la requisición actual
    public function finishOrder()
    {
        $this->estado = 'Procesando';
        $sql = 'UPDATE tb_requisiciones
                SET estado_requisicion = ?,
                fecha_accion_requisicion = NOW()
                WHERE id_requisicion = ?';
        $params = array($this->estado, $_SESSION['idRequisicion']);
        return Database::executeRow($sql, $params);
    }

    // ? método para activar disparador al actualizar la requisicion
    public function approveRequisicion()
    {
        $this->estado = 'Aprobada';
        $sql = 'UPDATE tb_requisiciones
                SET estado_requisicion = ?,
                id_administrador = ?,
                fecha_accion_requisicion = NOW()
                WHERE id_requisicion = ?';
        $params = array($this->estado, $_SESSION['idAdministrador'], $this->id_requisicion);
        $result = Database::executeRow($sql, $params);

        // Descontar materiales solo si la actualización fue exitosa
        if ($result) {
            $this->descontarMateriales();
        }
        return $result;
    }

    // ? Obtiene todos los materiales y cantidades de la requisición
    public function descontarMateriales()
    {
        $sql = 'SELECT id_material, cantidad_detalle_requisicion
            FROM tb_detalle_requisiciones
            WHERE id_requisicion = ?';
        $params = array($this->id_requisicion);
        $detalles = Database::getRows($sql, $params);

        // Descuenta cada material
        foreach ($detalles as $detalle) {
            $sqlUpdate = 'UPDATE tb_materiales
                            SET cantidad_material = cantidad_material - ?
                            WHERE id_material = ?';
            $paramsUpdate = array($detalle['cantidad_detalle_requisicion'], $detalle['id_material']);
            Database::executeRow($sqlUpdate, $paramsUpdate);
        }
        return true;
    }

    // * método para generar reportes
    public function detalleMaterial()
    {
        $sql = 'SELECT
                    `id_detalle_requisicion`,
                    `cantidad_detalle_requisicion`,
                    `id_material`,
                    `id_requisicion`
                FROM
                    `tb_detalle_requisiciones`
                    INNER JOIN tb_materiales USING (id_material)
                    WHERE id_material = ?';
        $params = array($this->material);
        return Database::getRows($sql, $params);
    }

    // todo funciones para mostrar toda la información de requisiciones de una dupla especifica

    // ? método para leer los detalles de la requisición de una dupla especifica
    public function readAllDuplaHistory()
    {
        $sql = 'SELECT
                    rq.id_requisicion as id_historial,
                    rq.fecha_requisicion as fecha_historial,
                    rq.estado_requisicion as estado_historial,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_dupla` = ?
                ORDER BY
                    rq.fecha_requisicion DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para leer los detalles de la requisición de una dupla especifica
    public function readByPendiente()
    {
        $sql = 'SELECT
                    rq.id_requisicion as id_historial,
                    rq.fecha_requisicion as fecha_historial,
                    rq.estado_requisicion as estado_historial,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_dupla` = ?
                AND estado_requisicion = "Pendiente"
                ORDER BY
                    rq.fecha_requisicion DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para leer los detalles de la requisición de una dupla especifica
    public function readByProcesando()
    {
        $sql = 'SELECT
                    rq.id_requisicion as id_historial,
                    rq.fecha_requisicion as fecha_historial,
                    rq.estado_requisicion as estado_historial,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_dupla` = ?
                AND estado_requisicion = "Procesando"
                ORDER BY
                    rq.fecha_requisicion DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para leer los detalles de la requisición de una dupla especifica
    public function readByAprobada()
    {
        $sql = 'SELECT
                    rq.id_requisicion as id_historial,
                    rq.fecha_requisicion as fecha_historial,
                    rq.estado_requisicion as estado_historial,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_dupla` = ?
                AND estado_requisicion = "Aprobada"
                ORDER BY
                    rq.fecha_requisicion DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para leer los detalles de la requisición de una dupla especifica
    public function readByAnulada()
    {
        $sql = 'SELECT
                    rq.id_requisicion as id_historial,
                    rq.fecha_requisicion as fecha_historial,
                    rq.estado_requisicion as estado_historial,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                        SELECT COUNT(*)
                        FROM tb_detalle_requisiciones dr
                        INNER JOIN tb_materiales m ON dr.id_material = m.id_material
                        WHERE dr.id_requisicion = rq.id_requisicion
                        AND dr.cantidad_detalle_requisicion > m.cantidad_material
                    ) AS tiene_exceso
                FROM
                    tb_requisiciones rq
                INNER JOIN tb_duplas dp ON rq.id_dupla = dp.id_dupla
                WHERE
                    rq.`id_dupla` = ?
                AND estado_requisicion = "Anulada"
                ORDER BY
                    rq.fecha_requisicion DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }
}
