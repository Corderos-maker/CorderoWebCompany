INSERT INTO
    tb_empleados (
        nombre_empleado,
        apellido_empleado,
        DUI_empleado,
        telefono_personal_empleado,
        imagen_empleado,
        departamento_trabajo_empleado,
        municipio_trabajo_empleado,
        fecha_actualizacion_empleado
    )
VALUES
    (
        'Juan',
        'Pérez',
        '12345678-9',
        '7123-4567',
        'empleado1.jpg',
        'San Salvador',
        'San Salvador',
        NOW ()
    ),
    (
        'María',
        'Rodríguez',
        '23456789-0',
        '7234-5678',
        'empleado2.jpg',
        'La Libertad',
        'Santa Tecla',
        NOW ()
    ),
    (
        'Carlos',
        'Hernández',
        '34567890-1',
        '7345-6789',
        'empleado3.jpg',
        'Santa Ana',
        'Santa Ana',
        NOW ()
    ),
    (
        'Ana',
        'Martínez',
        '45678901-2',
        '7456-7890',
        'empleado4.jpg',
        'Sonsonate',
        'Sonsonate',
        NOW ()
    ),
    (
        'Luis',
        'Gómez',
        '56789012-3',
        '7567-8901',
        'empleado5.jpg',
        'San Miguel',
        'San Miguel',
        NOW ()
    ),
    (
        'Sofía',
        'Vásquez',
        '67890123-4',
        '7678-9012',
        'empleado6.jpg',
        'Ahuachapán',
        'Ahuachapán',
        NOW ()
    ),
    (
        'José',
        'Flores',
        '78901234-5',
        '7789-0123',
        'empleado7.jpg',
        'Usulután',
        'Usulután',
        NOW ()
    ),
    (
        'Carmen',
        'Reyes',
        '89012345-6',
        '7890-1234',
        'empleado8.jpg',
        'La Paz',
        'Zacatecoluca',
        NOW ()
    ),
    (
        'Miguel',
        'Díaz',
        '90123456-7',
        '7901-2345',
        'empleado9.jpg',
        'Cabañas',
        'Sensuntepeque',
        NOW ()
    ),
    (
        'Laura',
        'Morales',
        '01234567-8',
        '7012-3456',
        'empleado10.jpg',
        'Chalatenango',
        'Chalatenango',
        NOW ()
    );

INSERT INTO
    tb_contenidos (
        nombre_contenido,
        unidad_contenido,
        cantidad_contenido
    )
VALUES
    ('Empaque', 'Piezas', 100),
    ('Rollos', 'Metros', 500),
    ('Bobinas', 'Rollos', 50),
    ('Empaque', 'Piezas', 75),
    ('Rollos', 'Metros', 300),
    ('Bobinas', 'Rollos', 30),
    ('Otros', 'Piezas', 200),
    ('Empaque', 'Piezas', 150),
    ('Rollos', 'Metros', 400),
    ('Bobinas', 'Rollos', 25);

INSERT INTO
    tb_materiales (
        nombre_material,
        descripcion_material,
        categoria_material,
        codigo_material,
        id_contenido,
        cantidad_minima_material,
        cantidad_material,
        imagen_material,
        fecha_material,
        visibilidad_material,
        id_administrador
    )
VALUES
    (
        'Cable THW 12 AWG',
        'Cable para instalaciones eléctricas 12 AWG',
        'Uso habitual',
        'THW012',
        1,
        50,
        150,
        'thw12.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Tubería EMT 1/2"',
        'Tubería conduit metálica 1/2 pulgada',
        'Material para CL200',
        'EMT012',
        2,
        30,
        85,
        'emt12.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Caja octogonal 4x2"',
        'Caja octogonal metálica para instalaciones',
        'Uso habitual',
        'OCT042',
        3,
        20,
        60,
        'octo42.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Medidor monofásico',
        'Medidor de energía monofásico 120/240V',
        'Antihurto y telegestión',
        'MED001',
        4,
        10,
        25,
        'medidor.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Cable subterráneo USE-2',
        'Cable para enterrado directo 6 AWG',
        'Subterráneo',
        'USE006',
        5,
        40,
        120,
        'use2.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Breaker 20A 1P',
        'Disyuntor termomagnético 20 amperios',
        'Uso habitual',
        'BRK020',
        6,
        25,
        75,
        'breaker.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Transformador 75kVA',
        'Transformador de distribución 75kVA',
        'Acometida especial',
        'TRA075',
        7,
        5,
        12,
        'trafo75.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Poste de concreto 9m',
        'Poste para distribución eléctrica',
        'Acometida especial',
        'PST009',
        8,
        15,
        30,
        'poste9.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Candado antihurto',
        'Candado de seguridad para medidores',
        'Antihurto y telegestión',
        'CAN001',
        9,
        100,
        250,
        'candado.jpg',
        NOW (),
        1,
        1
    ),
    (
        'Conector prensado 6AWG',
        'Conector para cables de 6 AWG',
        'Uso habitual',
        'CON006',
        10,
        200,
        500,
        'conector.jpg',
        NOW (),
        1,
        1
    );