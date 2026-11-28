# INSTRUCCIONES DE INSTALACION
## VetCare - Sistema de Gestión Veterinaria

Sistema web full-stack para la administración integral de clínicas veterinarias (gestión de usuarios y roles, registro de mascotas, agenda de citas médicas, historiales clínicos, tratamientos y notificaciones), desarrollado con **Spring Boot** en el backend, **React** en el frontend y **MySQL** como base de datos.

---

## Tecnologías Utilizadas

* **Backend:** Java 17+, Spring Boot, Spring Security (JWT), Spring Data JPA
* **Frontend:** React, Vite, JavaScript/TypeScript
* **Base de Datos:** MySQL 8.0+
* **Pruebas de API:** Bruno

---

## Requisitos Previos

Antes de ejecutar el proyecto en tu computadora, asegúrate de tener instalado:

* **Java JDK 17** o superior
* **Node.js 18+** y **npm**
* **MySQL Server 8.0+** (y MySQL Workbench o cliente de consola)
* Un IDE de tu preferencia (IntelliJ IDEA, Visual Studio Code, Eclipse o NetBeans)

---

## 1. Descargar el Proyecto

Clona el repositorio desde Git o descarga el archivo ZIP y descomprímelo:

```bash
git clone <URL_DEL_REPOSITORIO>
cd vetcare
```
## 2. Configurar la Base de Datos (MySQL)

1. Abre **MySQL Workbench** (o la terminal de MySQL) e inicia sesión como `root`.
2. Ejecuta las siguientes instrucciones para crear la base de datos y el usuario que utiliza el archivo de configuración del proyecto:

```sql
CREATE DATABASE vetcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vetcare_user'@'localhost' IDENTIFIED BY 'VetCare_Local_2026!';
GRANT ALL PRIVILEGES ON vetcare_db.* TO 'vetcare_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Selecciona la base de datos `vetcare_db` y ejecuta el script de migración inicial (`V1__init.sql`) para crear las 11 tablas, sus relaciones y los catálogos iniciales (`roles` y `species`).

---

## 3. Configurar y Ejecutar el Backend (Spring Boot)

1. Abre la carpeta `backend` en tu IDE.
2. Verifica el archivo `src/main/resources/application.properties` (o `application.yml`) y confirma que los datos de conexión coincidan con tu MySQL local:

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/vetcare_db
spring.datasource.username=vetcare_user
spring.datasource.password=VetCare_Local_2026!
```

3. Abre una terminal dentro de la carpeta `backend` y ejecuta el proyecto con Maven:

* **En Windows (PowerShell / CMD):**
  ```powershell
  .\mvnw spring-boot:run
  ```
* **En Linux / Mac:**
  ```bash
  ./mvnw spring-boot:run
  ```

4. Espera a que la consola muestre `Started VetcareApplication` (el backend quedará escuchando en `http://localhost:8080`).

---

## 4. Configurar y Ejecutar el Frontend (React)

1. Abre una nueva terminal y entra a la carpeta `frontend`:

```bash
cd frontend
```

2. Instala las dependencias necesarias:

```bash
npm install
```

3. Verifica que el archivo `.env` apunte a la URL de tu backend local:

```env
VITE_API_URL=http://localhost:8080/api
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## CREDENCIALES
ADMIN
Admin@vetcare.com
VetCare2026!

VETERIAN
t9735888@gmail.com
berserk@1234567890

CLIENTE
Mariana@gmail.com
Mariana12

## DIAGRAMA ER
<img width="4150" height="1809" alt="er" src="https://github.com/user-attachments/assets/223ee828-e3ad-499f-ab68-3831d0d5515c" />

## FIGMA
https://www.figma.com/proto/Azx0ZnRf5umT0EB4BpEPP3/mockup-web-sistema?node-id=1-2&t=hksYRKHbfcR2VPBr-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2

##Git Hub Projects
https://github.com/users/Angel500x/projects/2/views/1
