# **Renovio — App de Control de Renovaciones Web (Astro \+ Neon \+ Cloudflare)**

## **Contexto del proyecto**

**Renovio** es una aplicación SaaS interna para gestionar fechas de vencimiento de servicios web (hosting, dominios, mantenimiento, SSL, etc.). El objetivo es automatizar el seguimiento y envío de notificaciones tanto al administrador como a los clientes.

La interfaz de usuario debe alejarse de los tableros tradicionales y adoptar un **enfoque editorial y académico inspirado en Distill.pub**, priorizando la extrema legibilidad, el minimalismo absoluto, y la visualización de datos sutil (estilo Tufte).

## **Stack tecnológico**

- **Framework:** Astro 4.x (SSR Mode) utilizando el adaptador @astrojs/cloudflare.
- **Base de Datos:** Neon.tech (Serverless PostgreSQL).
- **ORM:** Drizzle ORM para la definición de esquemas y consultas tipadas.
- **Autenticación:** Lucia Auth o Auth.js (gestionado directamente en Astro mediante sesiones/cookies).
- **Estilos:** Modern CSS (Vanilla) centrado en tipografía. **Sin frameworks de utilidad (Tailwind/Bootstrap)**.
- **Emails:** Resend o SMTP estándar.
- **Despliegue:** Cloudflare Pages (Front-end y SSR).
- **Cron Jobs / Background Tasks:** Cloudflare Workers (Cron Triggers) para la revisión diaria de vencimientos.

## **Diseño Visual (Aesthetic Editorial \- Distill.pub)**

La aplicación debe seguir una estética de **Documento Académico / Editorial** basada en:

- **Paleta de Colores:** Fondo principal \#ffffff o un off-white muy sutil (\#fafbfc). Texto principal en negro suave (rgba(0, 0, 0, 0.84)). Acentos mínimos para estados (un naranja tenue para advertencias de 15 días, un rojo desaturado para vencidos, azul tinta para enlaces).
- **Estructura y Espaciado:** Diseño de columna central ancha (tipo artículo), con márgenes generosos. Uso de líneas de separación (1px solid rgba(0,0,0,0.1)) en lugar de tarjetas cerradas.
- **Tipografía:** Combinación editorial. Una fuente Serif de alta legibilidad para títulos (ej. Lora, Merriweather o Charter) y una Sans-serif muy limpia para la interfaz y tablas de datos (ej. Inter, Roboto o system-ui).
- **Visualización de Datos:** En lugar de gráficos pesados, usar _sparklines_ (minigráficos integrados en el texto) y tablas sobrias sin bordes verticales, inspiradas en los principios de Edward Tufte.

## **Modelo de Datos (Drizzle ORM / PostgreSQL)**

### **Tabla: contacts**

- id (uuid, primary key)
- name (text, required)
- email (text, unique, required)
- phone (text)
- created_at (timestamp)

### **Tabla: clients**

- id (uuid, primary key)
- company_name (text, required)
- domain (text)
- contact_id (uuid, reference \-\> contacts)
- notes (text)
- created_at (timestamp)

### **Tabla: services**

- id (uuid, primary key)
- client_id (uuid, reference \-\> clients)
- service_type (enum: 'website', 'hosting', 'domain', 'email', 'ssl', 'maintenance')
- provider (text)
- start_date (date)
- expiry_date (date)
- price (numeric)
- currency (enum: 'COP', 'USD')
- auto_renew (boolean)
- created_at (timestamp)

### **Tabla: notification_logs**

- id (uuid, primary key)
- service_id (uuid, reference \-\> services)
- sent_at (timestamp)
- type (text: '30d', '15d', '7d', 'expired')
- status (text: 'sent', 'failed')

## **Estructura de Rutas (Astro src/)**

src/  
├── components/ \# Componentes tipográficos (Tablas sobrias, Sparklines)  
├── db/  
│ ├── schema.ts \# Definición de tablas con Drizzle ORM  
│ └── index.ts \# Cliente de conexión a Neon  
├── layouts/ \# DocumentLayout.astro (Estructura editorial)  
├── pages/  
│ ├── login.astro \# Autenticación minimalista  
│ ├── index.astro \# "Reporte" principal (Dashboard en formato texto/tabla)  
│ ├── clients/  
│ │ ├── index.astro \# Índice de clientes  
│ │ ├── new.astro \# Formulario (estilo input de texto de línea simple)  
│ │ └── \[id\].astro \# Hoja de vida del cliente  
│ ├── services/  
│ │ └── new.astro \# Registro de servicio  
│ └── api/  
│ └── notify.ts \# Endpoint SSR para envíos de email  
└── styles/  
 └── global.css \# Tipografía, grid editorial y variables CSS

## **Funcionalidades Clave**

1. **Interfaz Documental:**
   - En lugar de un dashboard tradicional, el inicio se lee como un "Reporte de Estado", con oraciones dinámicas (ej. _"Hay 3 servicios que requieren atención este mes."_).
   - Tablas de datos de ancho completo, escaneables, con alineación estricta de números.
2. **Gestión de Base de Datos en el Edge:**
   - Conexiones ultra rápidas a Neon vía HTTP utilizando el driver _serverless_ para no agotar las conexiones de PostgreSQL en el entorno de Cloudflare.
3. **Notificaciones Automatizadas (Cloudflare Cron):**
   - Un Cloudflare Worker programado con Cron Triggers que consulta Neon diariamente, evalúa las fechas (expiry_date) y hace un llamado a Resend para emitir correos estilo texto plano.

## **Guía de Estilos CSS (Distill.pub Vanilla)**

Ejemplo de tokens en global.css:

:root {  
 \--bg-page: \#ffffff;  
 \--text-main: rgba(0, 0, 0, 0.84);  
 \--text-muted: rgba(0, 0, 0, 0.54);  
 \--border-subtle: rgba(0, 0, 0, 0.1);  
 \--accent-blue: \#1a73e8; /\* Para enlaces puros \*/  
 \--font-serif: 'Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', serif;  
 \--font-sans: \-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;  
}

body {  
 background-color: var(--bg-page);  
 color: var(--text-main);  
 font-family: var(--font-serif);  
 line-height: 1.6;  
 max-width: 900px;  
 margin: 0 auto;  
 padding: 4rem 2rem;  
}

h1, h2, h3, .ui-text {  
 font-family: var(--font-sans);  
 font-weight: 500;  
}

table {  
 width: 100%;  
 border-collapse: collapse;  
 font-family: var(--font-sans);  
 font-size: 0.9rem;  
}

th, td {  
 border-bottom: 1px solid var(--border-subtle);  
 padding: 12px 8px;  
 text-align: left;  
}

th {  
 color: var(--text-muted);  
 font-weight: 500;  
}

## **Orden de Implementación Sugerido**

1. Crear proyecto Astro agregando el adaptador @astrojs/cloudflare.
2. Configurar la base de datos en Neon.tech y configurar Drizzle ORM (src/db/schema.ts).
3. Definir global.css estableciendo las proporciones tipográficas y el espaciado editorial.
4. Implementar Layout principal con la estructura de columna de lectura.
5. Desarrollar el CRUD básico (Clientes y Servicios) utilizando formularios integrados al texto.
6. Configurar la autenticación (Lucia Auth / Auth.js).
7. Crear el Cloudflare Worker asociado al proyecto para el Cron de notificaciones.
8. Desplegar en Cloudflare Pages conectando el repositorio de GitHub.
