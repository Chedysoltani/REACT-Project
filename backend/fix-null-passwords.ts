import * as bcrypt from 'bcrypt';
import { AppDataSource } from './src/data-source';

async function fixNullPasswords() {
  // Initialiser la connexion à la base de données
  const dataSource = AppDataSource;
  
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Connexion à la base de données établie');

    // 1. Rendre la colonne password nullable
    console.log('Rendre la colonne password nullable...');
    await dataSource.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);

    // 2. Mettre à jour les mots de passe NULL avec une valeur par défaut hachée
    console.log('Mise à jour des mots de passe NULL...');
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    
    await dataSource.query(
      `UPDATE "users" SET "password" = $1 WHERE "password" IS NULL`,
      [hashedPassword]
    );

    // 3. Compter combien d'utilisateurs ont été mis à jour
    const result = await dataSource.query(
      `SELECT COUNT(*) as updated_count FROM "users" WHERE "password" = $1`,
      [hashedPassword]
    );
    
    console.log(`Mots de passe mis à jour : ${result[0].updated_count}`);

    // 4. Remettre la contrainte NOT NULL
    console.log('Remise en place de la contrainte NOT NULL...');
    await dataSource.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    
    console.log('Opération terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la correction des mots de passe :', error);
  } finally {
    // Fermer la connexion
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  }
}

fixNullPasswords();
