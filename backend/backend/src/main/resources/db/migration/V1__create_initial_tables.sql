
-- ==========================================
-- VETCARE - MIGRACION V1
-- Tablas principales
-- ==========================================

-- 1. ROLES
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(150)
);

-- 2. USERS
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. SPECIES
CREATE TABLE species (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(150)
);

-- 4. BREEDS
CREATE TABLE breeds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    species_id BIGINT NOT NULL,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(150),

    CONSTRAINT fk_breeds_species
        FOREIGN KEY (species_id) REFERENCES species(id),

    CONSTRAINT uk_breeds_id_species
    UNIQUE (id, species_id),

    CONSTRAINT uk_breeds_species_name
        UNIQUE (species_id, name)
);

-- 5. PETS
CREATE TABLE pets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    species_id BIGINT NOT NULL,
    breed_id BIGINT NULL,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    weight DECIMAL(6,2),
    sex VARCHAR(10),
    observations TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pets_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

    CONSTRAINT fk_pets_species
        FOREIGN KEY (species_id) REFERENCES species(id),

    CONSTRAINT fk_pets_breed
        FOREIGN KEY (breed_id, species_id)
            REFERENCES breeds(id, species_id),

    CONSTRAINT chk_pets_weight
        CHECK (weight IS NULL OR weight > 0),

    CONSTRAINT chk_pets_sex
        CHECK (sex IS NULL OR sex IN ('MALE', 'FEMALE', 'UNKNOWN'))
);


-- ==========================================
-- 6. APPOINTMENTS
-- ==========================================

CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    veterinarian_id BIGINT NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    client_notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_pet
        FOREIGN KEY (pet_id) REFERENCES pets(id),

    CONSTRAINT fk_appointments_veterinarian
        FOREIGN KEY (veterinarian_id) REFERENCES users(id),

    CONSTRAINT chk_appointments_status
        CHECK (status IN (
            'PENDING', 'CONFIRMED', 'COMPLETED',
            'CANCELLED', 'NO_SHOW'
        )),

    CONSTRAINT chk_appointments_duration
        CHECK (duration_minutes > 0)
);

-- ==========================================
-- 7. MEDICAL_RECORDS
-- ==========================================

CREATE TABLE medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    veterinarian_id BIGINT NOT NULL,
    record_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    symptoms TEXT,
    observations TEXT,
    recommendations TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_medical_records_pet
        FOREIGN KEY (pet_id) REFERENCES pets(id),

    CONSTRAINT fk_medical_records_veterinarian
        FOREIGN KEY (veterinarian_id) REFERENCES users(id)
);

-- ==========================================
-- 8. TREATMENTS
-- ==========================================

CREATE TABLE treatments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    instructions TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 9. MEDICAL_RECORD_TREATMENTS
-- ==========================================

CREATE TABLE medical_record_treatments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medical_record_id BIGINT NOT NULL,
    treatment_id BIGINT NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,

    CONSTRAINT fk_mrt_medical_record
        FOREIGN KEY (medical_record_id)
        REFERENCES medical_records(id),

    CONSTRAINT fk_mrt_treatment
        FOREIGN KEY (treatment_id)
        REFERENCES treatments(id),

    CONSTRAINT uk_medical_record_treatment
        UNIQUE (medical_record_id, treatment_id)
);

-- ==========================================
-- 10. NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ==========================================
-- 11. PASSWORD_RESET_TOKENS
-- ==========================================

CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_pets_owner
    ON pets(owner_id);

CREATE INDEX idx_appointments_pet_date
    ON appointments(pet_id, appointment_date);

CREATE INDEX idx_appointments_veterinarian_date
    ON appointments(veterinarian_id, appointment_date);

CREATE INDEX idx_medical_records_pet_date
    ON medical_records(pet_id, record_date);

CREATE INDEX idx_notifications_user_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_password_reset_user
    ON password_reset_tokens(user_id);


-- ==========================================
-- DATOS INICIALES: ROLES
-- ==========================================

INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrador del sistema'),
('VETERINARIAN', 'Veterinario de la clínica'),
('CLIENT', 'Cliente de la clínica');

-- ==========================================
-- DATOS INICIALES: SPECIES
-- ==========================================

INSERT INTO species (name, description) VALUES
('Perro', 'Animal doméstico canino'),
('Gato', 'Animal doméstico felino'),
('Ave', 'Animal perteneciente al grupo de las aves'),
('Conejo', 'Animal doméstico lagomorfo'),
('Reptil', 'Animal perteneciente al grupo de los reptiles'),
('Roedor', 'Animal perteneciente al grupo de los roedores');
