<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *	Clase para manejar el comportamiento de los datos de las tablas pedidos herramientas y detalles_herramientas.
 */
class PedidoHerramientasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_pedido = null;
    protected $id_detalle = null;
    protected $dupla = null;
    protected $herramienta = null;
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

    // TODO funciones del lado del trabajador

    // Método para verificar si existe un pedido en proceso con el fin de iniciar o continuar una compra.
    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT `id_pedido_herramienta` FROM `tb_pedidos_herramientas` 
        WHERE `estado_pedido_herramienta` = ? AND `id_dupla` = ?';

        $params = array($this->estado, $_SESSION['idDupla']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['id_pedido_herramienta'];
            return true;
        } else {
            return false;
        }
    }

    // Método para iniciar un pedido en proceso.
    public function startOrder()
    {
        $this->estado = 'Pendiente';
        if ($this->getOrder()) {
            return true;
        } else {
            $sql = 'INSERT INTO `tb_pedidos_herramientas`(`id_dupla`, `estado_pedido_herramienta`)
                    VALUES(?, ?)';
            $params = array($_SESSION['idDupla'], $this->estado);
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedido.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar herramientas al pedido actual.
    public function createDetail()
    {
        $sql = 'INSERT INTO `tb_detalles_herramientas`(
                    `id_herramienta`,
                    `cantidad_detalle_herramienta`,
                    `id_pedido_herramienta`
                )
                VALUES(
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->herramienta, $this->cantidad, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // ? método para leer los detalles de la requisición actual
    public function readDetail()
    {
        $sql = 'SELECT
                    `id_detalle_herramienta`,
                    `id_pedido_herramienta`,
                    hr.nombre_herramienta,
                    hr.sub_manual_herramienta,
                    hr.imagen_herramienta,
                    `cantidad_detalle_herramienta`
                FROM
                    `tb_detalles_herramientas` dhr
                INNER JOIN tb_herramientas hr ON
                    dhr.id_herramienta = hr.id_herramienta
                WHERE dhr.id_pedido_herramienta = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    // ? método para actualizar la cantidad de un material en la requisición actual
    public function updateDetail()
    {
        $sql = 'UPDATE `tb_detalles_herramientas`
                SET `cantidad_detalle_herramienta` = ?
                WHERE `id_detalle_herramienta` = ? AND `id_pedido_herramienta` = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // ? método para eliminar un material de la requisición actual
    public function deleteDetail()
    {
        $sql = 'DELETE FROM `tb_detalles_herramientas`
                WHERE `id_detalle_herramienta` = ? AND `id_pedido_herramienta` = ?';
        $params = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // ? método para finalizar el pedido de herramientas
    public function finishOrder()
    {
        $this->estado = 'Procesando';
        $sql = 'UPDATE `tb_pedidos_herramientas`
                SET `estado_pedido_herramienta` = ?
                WHERE `id_pedido_herramienta` = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // * métodos SCRUD (Select, Create, Read, Update, Delete) para manejar las requisiciones y detalles de requisiciones
    // TODO (MÉTODOS para el manejo de pedidos por parte del administrador)

    // método para buscar registros en la tabla del historial
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
            ph.`id_pedido_herramienta`,
            ph.`fecha_pedido_herramienta`,
            ph.`estado_pedido_herramienta`,
            dp.usuario_dupla,
            (
                SELECT COUNT(*)
                FROM tb_detalles_herramientas dh
                INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
            ) AS tiene_exceso
        FROM
            `tb_pedidos_herramientas` ph
        INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
        WHERE (ph.`fecha_accion_pedido` LIKE ? OR dp.usuario_dupla LIKE ?)
        AND ph.`estado_pedido_herramienta` = "Procesando"
        ORDER BY ph.`fecha_accion_pedido` DESC';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    // método para buscar registros en la tabla del historial
    public function searchRowsCancel()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
            ph.`id_pedido_herramienta`,
            ph.`fecha_pedido_herramienta`,
            ph.`fecha_accion_pedido`,
            ph.`estado_pedido_herramienta`,
            dp.usuario_dupla,
            (
                SELECT COUNT(*)
                FROM tb_detalles_herramientas dh
                INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
            ) AS tiene_exceso
        FROM
            `tb_pedidos_herramientas` ph
        INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
        WHERE (ph.`fecha_accion_pedido` LIKE ? OR dp.usuario_dupla LIKE ?)
        AND ph.`estado_pedido_herramienta` = "Anulada"
        ORDER BY ph.`fecha_accion_pedido` DESC';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    // método para buscar registros en la tabla del historial
    public function searchRowsHistory()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
            ph.`id_pedido_herramienta`,
            ph.`fecha_pedido_herramienta`,
            ph.`fecha_accion_pedido`,
            ph.`estado_pedido_herramienta`,
            dp.usuario_dupla,
            ad.nombre_administrador,
            (
                SELECT COUNT(*)
                FROM tb_detalles_herramientas dh
                INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
            ) AS tiene_exceso
        FROM
            `tb_pedidos_herramientas` ph
        INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
        inner JOIN tb_administradores ad ON ph.id_administrador = ad.id_administrador
        WHERE ph.`fecha_accion_pedido` LIKE ? OR dp.usuario_dupla LIKE ? OR  ph.`estado_pedido_herramienta` LIKE ?
        ORDER BY ph.`fecha_accion_pedido` DESC';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    // ? El administrador crea un pedido sin guardarla en un registro
    public function createRow()
    {
        $this->estado = 'Procesando';
        $sql = 'INSERT INTO `tb_pedidos_herramientas`(`id_dupla`, `estado_pedido_herramienta`)
                VALUES(?, ?)';
        $params = array($this->dupla, $this->estado);
        return Database::getLastRow($sql, $params);
    }

    // ? Método para agregar herramienta al pedido actual.
    public function createAdminDetail()
    {
        $sql = 'INSERT INTO `tb_detalles_herramientas`(
                    `id_pedido_herramienta`,
                    `id_herramienta`,
                    `cantidad_detalle_herramienta`
                )
                VALUES(
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->id_pedido, $this->herramienta, $this->cantidad);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT
                    ph.`id_pedido_herramienta`,
                    ph.`fecha_pedido_herramienta`,
                    ph.`fecha_accion_pedido`,
                    ph.`estado_pedido_herramienta`,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
                FROM
                    `tb_pedidos_herramientas` ph
                INNER JOIN tb_duplas dp
                WHERE ph.`estado_pedido_herramienta` = "Procesando"';
        return Database::getRows($sql);
    }

    public function readAllCancel()
    {
        $sql = 'SELECT
                    ph.`id_pedido_herramienta`,
                    ph.`fecha_pedido_herramienta`,
                    ph.`fecha_accion_pedido`,
                    ph.`estado_pedido_herramienta`,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
                FROM
                    `tb_pedidos_herramientas` ph
                INNER JOIN tb_duplas dp
                WHERE ph.`estado_pedido_herramienta` = "Anulada"';
        return Database::getRows($sql);
    }

    public function readAllHistory()
    {
        $sql = 'SELECT
                    ph.`id_pedido_herramienta`,
                    ph.`fecha_pedido_herramienta`,
                    ph.`fecha_accion_pedido`,
                    ph.`estado_pedido_herramienta`,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
                FROM
                    `tb_pedidos_herramientas` ph
                INNER JOIN tb_duplas dp
                ORDER BY ph.`fecha_accion_pedido` DESC;';
        return Database::getRows($sql);
    }

    // ? método para mostrar 10 registros de una dupla especifica 
    public function readBy10()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta`,
                ph.`fecha_pedido_herramienta`,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta`,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            ORDER BY ph.`fecha_pedido_herramienta` DESC
            LIMIT 10';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para mostrar todos registros de una dupla especifica 
    public function readAllDuplaHistory()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta` as id_historial,
                ph.`fecha_pedido_herramienta` as fecha_historial,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta` as estado_historial,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            ORDER BY ph.`fecha_pedido_herramienta` DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para mostrar todos registros de una dupla especifica 
    public function readByPendiente()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta` as id_historial,
                ph.`fecha_pedido_herramienta` as fecha_historial,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta` as estado_historial,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            AND estado_pedido_herramienta = "Pendiente"
            ORDER BY ph.`fecha_pedido_herramienta` DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para mostrar todos registros de una dupla especifica 
    public function readByProcesando()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta` as id_historial,
                ph.`fecha_pedido_herramienta` as fecha_historial,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta` as estado_historial,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            AND estado_pedido_herramienta = "Procesando"
            ORDER BY ph.`fecha_pedido_herramienta` DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para mostrar todos registros de una dupla especifica 
    public function readByAprobada()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta` as id_historial,
                ph.`fecha_pedido_herramienta` as fecha_historial,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta` as estado_historial,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            AND estado_pedido_herramienta = "Aprobada"
            ORDER BY ph.`fecha_pedido_herramienta` DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    // ? método para mostrar todos registros de una dupla especifica 
    public function readByAnulada()
    {
        $sql = 'SELECT
                ph.`id_pedido_herramienta` as id_historial,
                ph.`fecha_pedido_herramienta` as fecha_historial,
                ph.`fecha_accion_pedido`,
                ph.`estado_pedido_herramienta` as estado_historial,
                dp.usuario_dupla,
                (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
            FROM
                `tb_pedidos_herramientas` ph
            INNER JOIN tb_duplas dp ON ph.id_dupla = dp.id_dupla
            WHERE ph.`id_dupla` = ?
            AND estado_pedido_herramienta = "Anulada"
            ORDER BY ph.`fecha_pedido_herramienta` DESC';
        $params = array($this->dupla);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    ph.`id_pedido_herramienta`,
                    ph.`fecha_pedido_herramienta`,
                    ph.`fecha_accion_pedido`,
                    ph.`estado_pedido_herramienta`,
                    dp.usuario_dupla,
                    -- Subquery: 1 si hay exceso, 0 si no
                    (
                    SELECT COUNT(*)
                    FROM tb_detalles_herramientas dh
                    INNER JOIN tb_herramientas hr ON dh.id_herramienta = hr.id_herramienta
                    WHERE dh.id_pedido_herramienta = ph.`id_pedido_herramienta` AND dh.cantidad_detalle_herramienta > hr.cantidad_herramienta
                ) AS tiene_exceso
                FROM
                    `tb_pedidos_herramientas` ph
                INNER JOIN tb_duplas dp
                WHERE ph.`id_pedido_herramienta` = ?';
        $params = array($this->id_pedido);
        return Database::getRow($sql, $params);
    }

    // ? Obtiene los detalles de las herramientas de un pedido.
    public function readByOrder()
    {
        $sql = 'SELECT
                    dhr.id_detalle_herramienta,
                    hr.id_herramienta,
                    hr.nombre_herramienta,
                    hr.categoria_herramienta,
                    hr.cantidad_herramienta,
                    hr.sub_manual_herramienta,
                    dhr.cantidad_detalle_herramienta,
                    phr.fecha_pedido_herramienta,
                    phr.id_pedido_herramienta
                FROM
                    `tb_detalles_herramientas` dhr
                INNER JOIN tb_herramientas hr ON
                    dhr.id_herramienta = hr.id_herramienta
                INNER JOIN tb_pedidos_herramientas phr ON
                    phr.id_pedido_herramienta = dhr.id_pedido_herramienta
                    WHERE dhr.id_pedido_herramienta = ?';
        $params = array($this->id_pedido);
        return Database::getRows($sql, $params);
    }

    // ? función que actualiza la cantidad de herramientas del pedido
    public function updateQuantity()
    {
        $sql = 'UPDATE `tb_detalles_herramientas`
                SET `cantidad_detalle_herramienta` = ?
                WHERE `id_detalle_herramienta` = ?';
        $params = array($this->cantidad, $this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? elimina una herramienta especifica de un pedido
    public function deleteHerramienta()
    {
        $sql = 'DELETE FROM `tb_detalles_herramientas`
                WHERE `id_detalle_herramienta` = ?';
        $params = array($this->id_detalle);
        return Database::executeRow($sql, $params);
    }

    // ? método para remover un pedido a papelera
    public function removePedido()
    {
        $this->estado = 'Anulada';
        $sql = 'UPDATE `tb_pedidos_herramientas`
                SET `estado_pedido_herramienta` = ?,
                fecha_accion_pedido = NOW()
                WHERE `id_pedido_herramienta` = ?';
        $params = array($this->estado, $this->id_pedido);
        return Database::executeRow($sql, $params);
    }

    // ? método para remover un pedido a papelera
    public function restorePedido()
    {
        $this->estado = 'Procesando';
        $sql = 'UPDATE `tb_pedidos_herramientas`
                SET `estado_pedido_herramienta` = ?,
                fecha_accion_pedido = NOW()
                WHERE `id_pedido_herramienta` = ?';
        $params = array($this->estado, $this->id_pedido);
        return Database::executeRow($sql, $params);
    }

    // ? método para activar disparador al actualizar un pedido
    public function approvePedido()
    {
        $this->estado = 'Aprobada';
        $sql = 'UPDATE `tb_pedidos_herramientas`
                SET `estado_pedido_herramienta` = ?,
                id_administrador = ?,
                fecha_accion_pedido = NOW()
                WHERE id_pedido_herramienta = ?';
        $params = array($this->estado, $_SESSION['idAdministrador'], $this->id_pedido);
        $result = Database::executeRow($sql, $params);
        // Descontar materiales solo si la actualización fue exitosa
        if ($result) {
            $this->descontarMateriales();
        }
        return $result;
    }

    // ? Obtiene todas las herramientas y cantidades del pedido para descontarlos
    public function descontarMateriales()
    {
        $sql = 'SELECT `id_herramienta`, `cantidad_detalle_herramienta`
            FROM tb_detalles_herramientas
            WHERE id_pedido_herramienta = ?';
        $params = array($this->id_pedido);
        $detalles = Database::getRows($sql, $params);

        // Descuenta cada material
        foreach ($detalles as $detalle) {
            $sqlUpdate = 'UPDATE tb_herramientas
                            SET cantidad_herramienta = cantidad_herramienta - ?
                            WHERE id_herramienta = ?';
            $paramsUpdate = array($detalle['cantidad_detalle_herramienta'], $detalle['id_herramienta']);
            Database::executeRow($sqlUpdate, $paramsUpdate);
        }
        return true;
    }
}
