import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';
import { AppDataSource } from '../data-source';

async function addPatients() {
  console.log('Connexion à la base de données...');
  
  const dataSource = AppDataSource;
  
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Connecté à la base de données');

    const userRepository = dataSource.getRepository(User);

    const patients = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: await bcrypt.hash('Patient123!', 10),
        role: UserRole.PATIENT,
        // Le numéro de téléphone n'est pas inclus car la colonne n'existe pas
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        password: await bcrypt.hash('Patient123!', 10),
        role: UserRole.PATIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@example.com',
        password: await bcrypt.hash('Patient123!', 10),
        role: UserRole.PATIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('Ajout des patients...');
    
    for (const patientData of patients) {
      try {
        // Vérifier si l'utilisateur existe déjà
        // Vérifier si l'utilisateur existe déjà avec une requête brute pour éviter les problèmes de schéma
        const [existingUser] = await dataSource.query(
          'SELECT id FROM "users" WHERE email = $1',
          [patientData.email]
        );

        if (existingUser) {
          console.log(`Le patient ${patientData.email} existe déjà`);
          continue;
        }

        // Utiliser une requête INSERT directe avec uniquement les colonnes existantes
        const query = `
          INSERT INTO "users" 
          ("firstName", "lastName", email, password, role, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, "firstName", "lastName", email, role, "createdAt", "updatedAt"
        `;
        
        const values = [
          patientData.firstName,
          patientData.lastName,
          patientData.email,
          patientData.password,
          patientData.role,
          patientData.createdAt,
          patientData.updatedAt
        ];
        
        const [user] = await dataSource.query(query, values);
        console.log(`Patient ajouté : ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        console.error(`Erreur lors de l'ajout du patient ${patientData.email}:`, error.message);
      }
    }

    console.log('Opération terminée');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
  } finally {
    try {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
        console.log('Déconnecté de la base de données');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion de la base de données:', error);
    } finally {
      process.exit(0);
    }
  }
}

addPatients();
