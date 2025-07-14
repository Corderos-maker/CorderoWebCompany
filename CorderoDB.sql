DROP DATABASE if EXISTS CorderoDB;

CREATE DATABASE CorderoDB;

USE CorderoDB;

CREATE TABLE
    tb_administradores (
        id_administrador INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_administrador VARCHAR(50) NOt NULL,
        apellido_administrador VARCHAR(50) NOT NULL,
        correo_administrador VARCHAR(60) NOT NULL UNIQUE,
        telefono_administrador VARCHAR(10),
        alias_administrador VARCHAR(50) NOT NULL UNIQUE,
        clave_administrador VARCHAR(500) NOT NULL,
        tipo_administrador TINYINT (1) NOT NULL,
        fecha_clave DATE NOT NULL,
        codigo_clave VARCHAR(6) NOT NULL,
        imagen_administrador VARCHAR(300)
    );

CREATE TABLE
    tb_empleados (
        id_empleado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_empleado VARCHAR(50) NOT NULL,
        apellido_empleado VARCHAR(50),
        DUI_empleado VARCHAR(15) NOT NULL UNIQUE,
        telefono_personal_empleado varchar(10) NOT NULL,
        imagen_empleado VARCHAR(500),
        departamento_trabajo_empleado VARCHAR(100),
        municipio_trabajo_empleado VARCHAR(100),
        fecha_actualizacion_empleado DATETIME
    );

CREATE TABLE
    tb_duplas (
        id_dupla INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        usuario_dupla VARCHAR(100) UNIQUE,
        clave_dupla VARCHAR(500),
        telefono_empresa_dupla varchar(10) NOT NULL,
        tipo_dupla TINYINT (1) not NULL,
        id_empleado1 INT NOT NULL,
        id_empleado2 INT NULL,
        FOREIGN KEY (id_empleado1) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE,
        FOREIGN KEY (id_empleado2) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE,
        fecha_actualizacion_dupla DATETIME
    );

CREATE TABLE
    tb_trabajo_duplas (
        id_trabajo_dupla INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        -- latitud_inicio_trabajo_dupla varchar(300),
        -- longitud_inicio_trabajo_dupla varchar(300),
        hora_inicio_trabajo_dupla DATETIME,
        -- latitud_final_trabajo_dupla varchar(300),
        -- longitud_final_trabajo_dupla varchar(300),
        hora_final_trabajo_dupla DATETIME,
        estado_trabajo_dupla TINYINT (1) not NULL,
        id_dupla INT NOT NULL UNIQUE,
        FOREIGN KEY (id_dupla) REFERENCES tb_duplas (id_dupla) ON DELETE CASCADE,
        fecha_actualizacion_trabajo_dupla DATETIME
    );

CREATE TABLE
    tb_trabajo_historial (
        id_trabajo_historial INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        fecha_trabajo_historial DATETIME default CURRENT_TIMESTAMP(),
        -- inicio jornada: 1. fin de jornada: 0
        tipo_trabajo_historial TINYINT (1) default 1,
        id_dupla INT NOT NULL,
        FOREIGN KEY (id_dupla) REFERENCES tb_duplas (id_dupla) ON DELETE CASCADE
    );

CREATE TABLE
    tb_contenidos (
        id_contenido INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_contenido ENUM ('Empaque', 'Rollos', 'Bobinas', 'Otros') NOT NULL,
        unidad_contenido ENUM ('Piezas', 'Metros', 'Rollos'),
        cantidad_contenido INT
    );

CREATE TABLE
    tb_materiales (
        id_material INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_material VARCHAR(50) NOT NULL,
        descripcion_material VARCHAR(300),
        categoria_material ENUM (
            'Uso habitual',
            'Material para CL200',
            'Acometida especial',
            'Subterráneo',
            'Antihurto y telegestión'
        ) NOT NULL,
        codigo_material VARCHAR(6),
        id_contenido INT,
        FOREIGN KEY (id_contenido) REFERENCES tb_contenidos (id_contenido),
        cantidad_minima_material INT,
        cantidad_material INT,
        imagen_material VARCHAR(300),
        fecha_material DATETIME NOT NULL,
        visibilidad_material TINYINT (1) NOT NULL,
        id_administrador INT NULL,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE SET NULL
    );

CREATE TABLE
    tb_requisiciones (
        id_requisicion INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        fecha_requisicion DATETIME default CURRENT_TIMESTAMP(),
        fecha_accion_requisicion DATETIME default CURRENT_TIMESTAMP() NULL,
        -- estado_requisicion ENUM ('Pendiente', 'Finalizada', 'Aprobada', 'Anulada') NOT NULL,
        estado_requisicion ENUM ('Pendiente', 'Procesando', 'Aprobada', 'Anulada') NOT NULL,
        id_dupla INT,
        FOREIGN KEY (id_dupla) REFERENCES tb_duplas (id_dupla) ON DELETE CASCADE,
        id_administrador INT NULL,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE SET NULL
    );

CREATE TABLE
    tb_detalle_requisiciones (
        id_detalle_requisicion INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        cantidad_detalle_requisicion INT NOT NULL,
        id_material INT,
        FOREIGN KEY (id_material) REFERENCES tb_materiales (id_material) ON DELETE CASCADE,
        id_requisicion INT,
        FOREIGN KEY (id_requisicion) REFERENCES tb_requisiciones (id_requisicion) ON DELETE SET NULL
    );

CREATE TABLE
    tb_categoria_consumibles (
        id_categoria INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_categoria varchar(50) NOt NULL,
        descripcion_categoria varchar(200),
        imagen_categoria varchar(100)
    );

CREATE TABLE
    tb_consumibles (
        id_consumible INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_consumible VARCHAR(50) NOT NULL,
        descripcion_consumible VARCHAR(200),
        cantidad_limite_consumible INT,
        cantidad_consumible INT NOT NULL,
        imagen_consumible VARCHAR(200),
        id_categoria INT NULL,
        FOREIGN KEY (id_categoria) REFERENCES tb_categoria_consumibles (id_categoria) on DELETE SET NULL,
        id_administrador INT NULL,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE SET NULL
    );

CREATE TABLE
    tb_herramientas (
        id_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_herramienta VARCHAR(50) NOT NULL,
        descripcion_herramienta VARCHAR(300),
        categoria_herramienta ENUM ('Manual', 'Electricas', 'EPP') NOT NULL,
        sub_manual_herramienta TINYINT (1),
        cantidad_herramienta INT NOT NULL,
        visibilidad_herramienta TINYINT (1),
        imagen_herramienta VARCHAR(300),
        id_administrador INT NULL,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE SET NULL
    );

CREATE TABLE
    tb_pedidos_herramientas (
        id_pedido_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        fecha_pedido_herramienta DATETIME default CURRENT_TIMESTAMP(),
        fecha_accion_pedido DATETIME default CURRENT_TIMESTAMP() NULL,
        estado_pedido_herramienta ENUM ('Pendiente', 'Procesando', 'Aprobada', 'Anulada') NOT NULL,
        id_dupla INT,
        FOREIGN KEY (id_dupla) REFERENCES tb_duplas (id_dupla) ON DELETE SET NULL,
        id_administrador INT NULL,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE SET NULL
    );

CREATE TABLE
    tb_detalles_herramientas (
        id_detalle_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        id_pedido_herramienta INT,
        id_herramienta INT,
        cantidad_detalle_herramienta INT NOT NULL,
        FOREIGN KEY (id_pedido_herramienta) REFERENCES tb_pedidos_herramientas (id_pedido_herramienta) ON DELETE CASCADE,
        FOREIGN KEY (id_herramienta) REFERENCES tb_herramientas (id_herramienta) ON DELETE CASCADE
    );

CREATE TABLE
    tb_evidencias_herramientas (
        id_evidencia_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        fecha_evidencia_herramienta DATETIME default CURRENT_TIMESTAMP(),
        imagen_evidencia_herramienta1 VARCHAR(300) NULL,
        imagen_evidencia_herramienta2 VARCHAR(300) NULL,
        estado_evidencia_herramienta TINYINT (1) NOt NULL DEFAULT 0,
        id_detalle_herramienta INT,
        FOREIGN KEY (id_detalle_herramienta) REFERENCES tb_detalles_herramientas (id_detalle_herramienta) ON DELETE CASCADE
    );
