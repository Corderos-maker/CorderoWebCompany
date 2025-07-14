CorderoWeb

Descripción: 

    CorderoWeb es un sistema web para la gestión de materiales, requisiciones, empleados, duplas y recursos
    de una empresa. Permite administrar inventarios, generar reportes en PDF, controlar usuarios y 
    búsquedas avanzadas de registros.

Estructura del Proyecto:

api/
    helpers/         # Funciones y clases auxiliares (DB, validadores, reportes)
    libraries/       # Librerías externas (ej. FPDF)
    models/          # Modelos de datos y lógica de negocio
    reports/         # Generación de reportes PDF
    services/        # Servicios/API RESTful
controllers/
    admin/           # Controladores JS para el panel de administración
    public/          # Controladores JS para usuarios públicos
    utils/           # Utilidades JS compartidas
resources/
    css/             # Hojas de estilo (Bootstrap, estilos generales)
    images/          # Imágenes del sistema
    js/              # Scripts JS adicionales
views/
    admin/           # Vistas HTML para administración
    public/          # Vistas HTML públicas

Instalación:

        1- Clona el repositorio en tu servidor local (ejemplo: XAMPP).
        2- Importa la base de datos:
        3- Usa el archivo CorderoDB.sql para crear las tablas y datos iniciales en MySQL.
        4- Configura la conexión a la base de datos en config.php según tus credenciales.
        5- Asegúrate de tener PHP y MySQL activos (por ejemplo, usando XAMPP o similar).
        6- Accede a las vistas desde tu navegador, por ejemplo:
        "http://localhost/corderoWeb/views/admin/index.html"

Funcionalidades principales:

    - Gestión de materiales, empleados, duplas y requisiciones.
    - Control de stock y alertas de inventario.
    - Generación de reportes PDF.
    - Búsqueda y filtrado avanzado.
    - Panel de administración y vistas públicas.
    - Seguridad básica con sesiones y validaciones.

Créditos:
Desarrollado por el equipo de CorderoWeb.

(RICARDO NICOLAS MELARA ElRicki0)