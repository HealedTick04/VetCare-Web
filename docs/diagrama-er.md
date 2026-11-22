
# Diagrama Entidad-Relación – VetCare

## Descripción

Base de datos relacional para la gestión
de la clinica.

## Relaciones principales

- Un rol puede tener múltiples usuarios.
- Un cliente puede registrar múltiples mascotas.
- Una mascota pertenece a una especie y una raza.
- Una mascota puede tener múltiples citas.
- Un veterinario puede atender múltiples citas.
- Una mascota puede tener múltiples expedientes médicos.
- Los expedientes médicos pueden incluir múltiples tratamientos.

## Diagrama

```mermaid
erDiagram
    ROLES ||--o{ USERS : tiene
    USERS ||--o{ PETS : posee
    SPECIES ||--o{ BREEDS : contiene
    SPECIES ||--o{ PETS : clasifica
    BREEDS ||--o{ PETS : identifica
    PETS ||--o{ APPOINTMENTS : agenda
    USERS ||--o{ APPOINTMENTS : atiende
    PETS ||--o{ MEDICAL_RECORDS : tiene
    USERS ||--o{ MEDICAL_RECORDS : registra
    APPOINTMENTS ||--o| MEDICAL_RECORDS : genera
    MEDICAL_RECORDS ||--o{ MEDICAL_RECORD_TREATMENTS : incluye
    TREATMENTS ||--o{ MEDICAL_RECORD_TREATMENTS : aplica
    USERS ||--o{ NOTIFICATIONS : recibe
    USERS ||--o{ PASSWORD_RESET_TOKENS : solicita
```
