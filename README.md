# 🎓 SchoolCore

## 📌 Descripción

Este proyecto es un **Sistema de Gestión Escolar (SMS)** en una arquitectura monorepo, diseñado para administrar y automatizar los principales procesos de una institución educativa.

La aplicación se divide en:

* **Backend:** API REST encargada de la lógica de negocio y la gestión de datos.
* Estudiantes, profesores y acudientes
* Estructura académica (cursos, materias, notas)
* Asistencia y calificaciones
* Pagos y reportes
* Control de acceso basado en roles (RBAC)
*   **Frontend:** Interfaz de usuario para interactuar con la API.

---

## ⚙️ Tecnologías
* **Backend**
    * **Runtime:** Node.js
    * **Framework:** Express
    * **Base de datos:** MongoDB
    * **Arquitectura:** API REST
* **Frontend:** (A definir, ej: React, Vue, Angular)
* **Gestor de paquetes:** pnpm (en el workspace)

---

## 🚀 Instalación

1.  Clonar el repositorio:

```bash
git clone https://github.com/TheJuanRojasR/SchoolCore.git
cd backend
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
```

4. Ejecutar el proyecto:

```bash
pnpm dev
```

---

## 📦 Scripts

```bash
pnpm dev     # Ejecuta en modo desarrollo
pnpm start   # Ejecuta en producción
```
