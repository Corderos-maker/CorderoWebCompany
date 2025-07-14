<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradorHandler
{
    //* declaración de variables de la tabla administrador
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $telefono = null;
    protected $alias = null;
    protected $clave = null;
    protected $tipo = null;
    protected $fecha_clave = null;
    protected $codigo = null;
    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/admin/';

    // Constructor: inicializa el código aleatorio y la fecha de la clave.
    public function __construct()
    {
        // Generar un código aleatorio de 6 dígitos y asignarlo a $codigo
        $this->codigo = rand(100000, 999999);
        $this->fecha_clave = date('Y-m-d'); // Formato año-mes-día
    }

    // Devuelve el código generado para el administrador.
    public function getCodigo()
    {
        return $this->codigo;
    }

    // Devuelve la fecha de la última actualización de la contraseña.
    public function getFechaContrasenia()
    {
        return $this->fecha_clave;
    }

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_administrador, alias_administrador, clave_administrador, tipo_administrador
                FROM tb_administradores 
                WHERE alias_administrador=?';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_administrador'])) {
            $_SESSION['idAdministrador'] = $data['id_administrador'];
            $_SESSION['aliasAdministrador'] = $data['alias_administrador'];
            $_SESSION['tipoAdministrador'] = $data['tipo_administrador'];
            return true;
        } else {
            return false;
        }
    }

    // Verifica si la contraseña proporcionada es correcta para el administrador actual.
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_administrador
                FROM tb_administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_administrador'])) {
            return true;
        } else {
            return false;
        }
    }

    //* métodos SCRUD (search, create, read, update, and delete) para el manejo de variables 

    // Busca administradores por nombre, apellido, correo o teléfono (excepto el actual).
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, telefono_administrador
                FROM tb_administradores
                WHERE apellido_administrador LIKE ? OR nombre_administrador LIKE ? OR correo_administrador LIKE ? OR telefono_administrador LIKE ? AND id_administrador <> ?
                ORDER BY id_administrador';
        $params = array($value, $value, $value, $value, $_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }
    // Crea el primer registro de administrador en la base de datos.
    public function createNewRow()
    {
        $this->tipo = 1;
        $sql = 'INSERT INTO tb_administradores(nombre_administrador, apellido_administrador, telefono_administrador, correo_administrador, alias_administrador, clave_administrador, tipo_administrador, fecha_clave, codigo_clave, imagen_administrador)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->correo, $this->alias, $this->clave, $this->tipo, $this->fecha_clave, $this->codigo, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // Crea un nuevo registro de administrador en la base de datos.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_administradores(nombre_administrador, apellido_administrador, telefono_administrador, correo_administrador, alias_administrador, clave_administrador, tipo_administrador, fecha_clave, codigo_clave, imagen_administrador)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->correo, $this->alias, $this->clave, $this->tipo, $this->fecha_clave, $this->codigo, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // Obtiene todos los IDs de administradores.
    public function readAll()
    {
        $sql = 'SELECT `id_administrador` FROM `tb_administradores`';
        return Database::getRows($sql);
    }

    // Obtiene todos los administradores excepto el de la sesión iniciada.
    public function readAllOne()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, telefono_administrador, alias_administrador, correo_administrador, imagen_administrador FROM tb_administradores
        where id_administrador<>?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    // Obtiene todos los administradores ordenados por nombre, excepto el actual.
    public function readByName()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, telefono_administrador, alias_administrador, correo_administrador, imagen_administrador FROM tb_administradores
        where id_administrador<>? ORDER BY nombre_administrador';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    // Obtiene todos los administradores ordenados por correo, excepto el actual.
    public function readByEmail()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, telefono_administrador, alias_administrador, correo_administrador, imagen_administrador FROM tb_administradores
        where id_administrador<>? ORDER BY correo_administrador';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    // Obtiene el perfil del administrador actual.
    public function readProfile()
    {
        $sql = '  SELECT
                    `id_administrador`,
                    `nombre_administrador`,
                    `apellido_administrador`,
                    `alias_administrador`,
                    `correo_administrador`,
                    `telefono_administrador`,
                    `imagen_administrador`
                FROM
                    `tb_administradores`
                WHERE
                    `id_administrador` = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE
                    `tb_administradores`
                SET
                    `nombre_administrador` = ?,
                    `apellido_administrador` = ?,
                    `correo_administrador` = ?,
                    `telefono_administrador` = ?,
                    `imagen_administrador` = ?,
                    `alias_administrador` = ?
                WHERE
                    `id_administrador` = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->telefono, $this->imagen, $this->alias, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // Actualiza el perfil del administrador actual.
    public function changePassword()
    {
        $sql = 'UPDATE
                    `tb_administradores`
                SET
                    `clave_administrador` = ?,
                    `fecha_clave` = ?,
                    `codigo_clave` = ?
                WHERE
                    `id_administrador`=?';
        $params = array($this->clave, $this->fecha_clave, $this->codigo, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // Cambia la contraseña del administrador actual y actualiza la fecha y el código.
    public function readFilename()
    {
        $sql = 'SELECT imagen_administrador
                FROM tb_administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    // elimina un administrador de todo la base de datos
    public function deleteRow(){
        $sql ='DELETE FROM `tb_administradores` WHERE `id_administrador` = ? ';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
