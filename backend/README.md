# 🎓 School system API

## 📌 Descripción

Este proyecto es un **Sistema de Gestión Escolar (SMS)** diseñado para administrar y automatizar los principales procesos de una institución educativa.

Permite gestionar:

* Estudiantes, profesores y acudientes
* Estructura académica (cursos, materias, notas)
* Asistencia y calificaciones
* Pagos y reportes
* Control de acceso basado en roles (RBAC)

---

## ⚙️ Tecnologías

* **Backend:** JavaScript (Node.js) + Express
* **Gestor de paquetes:** pnpm
* **Base de datos:** MongoDB
* **Arquitectura:** API REST

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/sistema-gestion-escolar.git
cd sistema-gestion-escolar
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
