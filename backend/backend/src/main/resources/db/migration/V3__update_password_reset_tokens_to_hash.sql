-- ==========================================
-- VETCARE - MIGRACION V3
-- Almacenar hash SHA-256 en password_reset_tokens
-- ==========================================

ALTER TABLE password_reset_tokens
    CHANGE COLUMN token token_hash VARCHAR(255) NOT NULL UNIQUE;