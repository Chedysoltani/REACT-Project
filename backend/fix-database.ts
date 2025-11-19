import { AppDataSource } from "./src/data-source";

async function fixDatabase() {
  try {
    // Initialiser la connexion à la base de données
    const dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log('Connexion à la base de données établie');

    // Désactiver temporairement les contraintes de clé étrangère
    console.log('Désactivation des contraintes de clé étrangère...');
    await dataSource.query('SET session_replication_role = "replica";');

    // 1. Rendre la colonne password nullable
    console.log('Rendre la colonne password nullable...');
    await dataSource.query('ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL');

    // 2. Mettre à jour les mots de passe NULL avec une valeur par défaut
    console.log('Mise à jour des mots de passe NULL...');
    const defaultPassword = 'password123';
    const saltRounds = 10;
    const hashedPassword = await new Promise<string>((resolve, reject) => {
      require('bcrypt').hash(defaultPassword, saltRounds, (err: Error, hash: string) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    await dataSource.query(
      'UPDATE "users" SET "password" = $1 WHERE "password" IS NULL',
      [hashedPassword]
    );

    // 3. Vérifier que tous les utilisateurs ont un mot de passe
    const result = await dataSource.query(
      'SELECT COUNT(*) as null_passwords FROM "users" WHERE "password" IS NULL'
    );
    
    if (parseInt(result[0].null_passwords) > 0) {
      console.warn(`ATTENTION : ${result[0].null_passwords} utilisateurs ont toujours un mot de passe NULL`);
    } else {
      console.log('Tous les utilisateurs ont un mot de passe valide');
    }

    // 4. Remettre la contrainte NOT NULL
    console.log('Remise en place de la contrainte NOT NULL...');
    await dataSource.query('ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL');

    // 5. Réactiver les contraintes de clé étrangère
    console.log('Réactivation des contraintes de clé étrangère...');
    await dataSource.query('SET session_replication_role = "origin";');

    console.log('Opération terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la correction de la base de données :', error);
  } finally {
    // Fermer la connexion
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

fixDatabase();
