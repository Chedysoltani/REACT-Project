import { DataSource } from 'typeorm';
import { User } from './backend/src/users/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function resetPassword() {
  const email = 'Frej@gmail.com';
  const newPassword = 'NouveauMotDePasse123!'; // À changer après utilisation
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'your_database_name',
    entities: [User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Connexion à la base de données réussie');
    
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email: ${email}`);
      return;
    }
    
    console.log(`Utilisateur trouvé: ${user.firstName} ${user.lastName} (${user.role})`);
    
    // Hachage du nouveau mot de passe (une seule fois)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await userRepository.save(user);
    console.log('Mot de passe mis à jour avec succès');
    console.log(`Nouveau mot de passe: ${newPassword}`);
    
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
  } finally {
    await dataSource.destroy();
  }
}

resetPassword().catch(console.error);
