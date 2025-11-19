-- 1. Désactiver temporairement les contraintes
SET session_replication_role = 'replica';

-- 2. Rendre la colonne password nullable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- 3. Mettre à jour les mots de passe NULL avec une valeur par défaut (mot de passe 'password123' hashé)
UPDATE "users" 
SET "password" = '$2b$10$jHitLSf4TcaLSR1M4egIPe3UQg2BlgIBIgVjwHndLSgm1.7OCDXqu'
WHERE "password" IS NULL;

-- 4. Vérifier qu'il n'y a plus de mots de passe NULL
SELECT COUNT(*) FROM "users" WHERE "password" IS NULL;

-- 5. Remettre la contrainte NOT NULL
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;

-- 6. Réactiver les contraintes
SET session_replication_role = 'origin';

-- 7. Vérifier que tout est en ordre
SELECT id, email, "firstName", "lastName", role, "clinicId" FROM "users";
