-- 1. Désactiver temporairement les contraintes
SET session_replication_role = 'replica';

-- 2. Rendre les colonnes nullable temporairement
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL;

-- 3. Mettre à jour les mots de passe NULL avec une valeur par défaut (mot de passe 'password123' hashé)
UPDATE "users" 
SET "password" = '$2b$10$XdwXDuZxiInhTPuOENxTm.FemkvlKR4.eoSZGz7imi/mppslrGmKm'
WHERE "password" IS NULL;

-- 4. Supprimer et recréer la colonne password avec NOT NULL
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";
ALTER TABLE "users" ADD COLUMN "password" character varying NOT NULL DEFAULT '$2b$10$XdwXDuZxiInhTPuOENxTm.FemkvlKR4.eoSZGz7imi/mppslrGmKm';
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;

-- 5. Mettre à jour les colonnes firstName et lastName si NULL
UPDATE "users" 
SET 
    "firstName" = COALESCE("firstName", 'Utilisateur'),
    "lastName" = COALESCE("lastName", 'Anonyme')
WHERE "firstName" IS NULL OR "lastName" IS NULL;

-- 6. Remettre les contraintes NOT NULL
ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL;

-- 7. Supprimer la colonne password de la table doctors si elle existe
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "password";

-- 8. Mettre à jour la table de migration pour indiquer que notre migration a été exécutée
INSERT INTO "migrations"("timestamp", "name")
VALUES (1763471968257, 'FixUserAndDoctorEntities1763471968257');

-- 9. Réactiver les contraintes
SET session_replication_role = 'origin';
