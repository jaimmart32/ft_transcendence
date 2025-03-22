# 🧠 ft_transcendence

**ft_transcendence** es el proyecto final del Common Core de 42, y consiste en el desarrollo de una **plataforma web de videojuegos** completamente funcional. En este caso, la aplicación fue desarrollada con **Python (Django)** como backend, **Bootstrap**  y **JavaScript** para el frontend, y **PostgreSQL** como base de datos.

El objetivo del proyecto es combinar múltiples disciplinas: desarrollo web, autenticación, ciberseguridad, API REST, comunicación en tiempo real, e integración de lógica de juego.

---

## 🌐 Tecnologías utilizadas

- **Backend:** Django (Python)
- **Frontend:** Bootstrap, HTML, CSS y JavaScript
- **Base de datos:** PostgreSQL
- **Seguridad:** Autenticación remota, JWT, 2FA (Two-Factor Authentication)
- **Networking:** WebSockets
- **Juego en tiempo real:** Server-Side Pong con sincronización remota
- **APIs:** RESTful API para interacción entre clientes y servidor

---

## 🧩 Módulos desarrollados

### 🕸️ Web & Arquitectura
- Estructura modular en Django con separación clara entre frontend, lógica de negocio y API
- Integración de Bootstrap para diseño responsivo
- ORM de Django conectado a PostgreSQL

### 👤 User Management
- Registro e inicio de sesión
- Gestión de usuarios, perfiles y estadísticas
- Vinculación de usuarios a torneos y sistema de emparejamiento
- Autenticación remota implementada para usuarios externos

### 🛡️ Ciberseguridad
- Autenticación JWT (JSON Web Token)
- Autenticación en dos pasos (2FA) con códigos temporales
- Gestión segura de sesiones y endpoints protegidos

### 🎮 Gameplay
- Implementación de jugadores remotos con WebSockets
- Sincronización en tiempo real entre dos jugadores en diferentes dispositivos
- Lógica de colisiones y puntaje manejada por el servidor

### 🧠 Server-Side Pong & API
- Sustitución del Pong básico por una versión en la que toda la lógica corre en el servidor
- API RESTful para listar jugadores, partidas, historial, y datos de usuario
- Aislamiento entre frontend y backend a través de endpoints bien definidos

---

## 🎯 Objetivos cumplidos

- Desarrollar una aplicación web completa, escalable y segura
- Implementar un juego en tiempo real con arquitectura cliente-servidor
- Garantizar la seguridad y autenticación del usuario con prácticas modernas
- Aplicar diseño web responsivo y limpio
