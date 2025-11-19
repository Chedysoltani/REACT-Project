import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';

async function seedPatients() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const patients = [
    {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'Patient123!',
      role: UserRole.PATIENT,
      phone: '0612345678',
    },
    {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      password: 'Patient123!',
      role: UserRole.PATIENT,
      phone: '0623456789',
    },
    {
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@example.com',
      password: 'Patient123!',
      role: UserRole.PATIENT,
      phone: '0634567890',
    },
  ];

  try {
    console.log('Début de l\'ajout des patients...');
    
    for (const patient of patients) {
      try {
        await usersService.create(patient);
        console.log(`Patient ajouté : ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        if (error.message.includes('duplicate key value')) {
          console.log(`Le patient ${patient.email} existe déjà`);
        } else {
          console.error(`Erreur lors de l'ajout du patient ${patient.email}:`, error.message);
        }
      }
    }
    
    console.log('Ajout des patients terminé');
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

seedPatients();
