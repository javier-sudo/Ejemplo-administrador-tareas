# TaskFlow IA 🚀

¡Bienvenido a **TaskFlow IA**! Un gestor de tareas colaborativo y altamente responsivo para equipos de trabajo, diseñado para ser simple, elegante y listo para producción sin dependencias de frameworks ni backends complejos.

Este proyecto ha sido optimizado tanto para desarrollo local rápido como para ser subido directamente a **GitHub** y desplegado en **Vercel** como una aplicación estática.

---

## 🌟 Funcionalidades Principales

- **Dashboard de Estadísticas en Tiempo Real**: Visualiza métricas instantáneas del proyecto (Total de tareas, Pendientes, En progreso y Completadas).
- **Control Reactivo de Tareas**:
  * Crear nuevas tareas con título, descripción, prioridad y estado.
  * Cambiar estados dinámicamente de manera rápida mediante el botón "Comenzar / Completar".
  * Editar títulos, descripciones y configuraciones de tareas mediante diálogos interactivos.
  * Eliminar tareas y reiniciar estados.
- **Filtros Avanzados e Instantáneos**:
  * Filtrado inmediato mediante barra de búsqueda de texto (busca en títulos y descripciones).
  * Filtrado preciso de tareas por su estado actual.
  * Filtrado ágil según nivel de prioridad (Alta 🔴, Media 🟡, Baja 🟢).
- **Diseño Ultra Moderno y "Responsive"**:
  * Interfaz intuitiva y adaptativa perfecta para teléfonos inteligentes, tablets y ordenadores con transiciones y micro-interacciones pulidas.
  * Soporte nativo para **Modo Claro (Light Mode) ☀️** y **Modo Oscuro (Dark Mode) 🌙** que se sincroniza automáticamente con las preferencias del sistema.
- **Persistencia Local Segura**: Los datos son guardados y recuperados automáticamente mediante `localStorage` de tal forma que no pierdas el progreso al recargar.

---

## 🛠️ Tecnologías Usadas

- **HTML5**: Estructura semántica moderna e higiénica.
- **CSS3 (Tailwind CSS v4)**: Estilizaciones ágiles, elegantes, responsivas y completas sin archivos redundantes.
- **JavaScript (Vanilla - ES6+)**: Código interactivo modular y manipulador del DOM con excelente protección contra inyecciones XSS.
- **Vite**: Motor de compilación rápido para servir recursos de manera óptima durante el desarrollo.

---

## 🖥️ Cómo Ejecutar Localmente

### Prerrequisitos
- Tener instalado **Node.js** (versión 18 o superior).

### Instrucciones
1. Clona este repositorio o descarga los archivos en tu computadora:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO_GITHUB>
   cd taskflow-ia
   ```
2. Instala las dependencias de desarrollo para poder ejecutar el entorno óptimo:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web e ingresa a: **`http://localhost:3000`** (o el puerto indicado por la terminal).

---

## ⚡ Despliegue en Vercel (Aplicación Estática)

El proyecto está estructurado con el compilador estándar de Vite, lo que facilita el despliegue directo en **Vercel** como un sitio estático estables en menos de un minuto.

### Configuración del proyecto en Vercel:
1. Sube tu código a un repositorio en **GitHub**.
2. Ve a la plataforma de [Vercel](https://vercel.com/) e inicia sesión.
3. Haz clic en **"Add New"** > **"Project"** y selecciona tu repositorio cargado.
4. En la configuración de construcción (*Build & Development Settings*), Vercel detectará autónomamente que el proyecto usa **Vite**. Asegúrate de que los comandos sean:
   - **Framework Preset**: `Vite` (o `Other` si deseas usar la versión cruda)
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Haz clic en el botón **"Deploy"**. ¡Tu sitio estará listo con una URL pública segura (`https`) en pocos segundos!

---

Desarrollado con pasión utilizando **Google AI Studio** 💖🏼
