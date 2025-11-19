import { DataSource } from "typeorm";
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

async function checkUsersTable() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: false,
        logging: true,
        entities: [],
        subscribers: [],
        migrations: [],
    });

    try {
        await dataSource.initialize();
        console.log('Connected to the database');

        // Vérifier la structure de la table users
        const query = `
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `;
        
        const result = await dataSource.query(query);
        console.log('Structure de la table users :');
        console.table(result);
        
        // Vérifier les données existantes
        const userData = await dataSource.query('SELECT id, "firstName", "lastName", email, role, "clinicId" FROM users LIMIT 5');
        console.log('\nDonnées utilisateurs (5 premiers enregistrements) :');
        console.table(userData);
        
        // Vérifier si la colonne name existe
        const nameColumnExists = result.some(col => col.column_name === 'name');
        console.log('\nLa colonne "name" existe-t-elle ?', nameColumnExists);
        
        // Vérifier les contraintes NOT NULL
        const notNullColumns = result.filter(col => col.is_nullable === 'NO');
        console.log('\nColonnes NOT NULL :');
        console.table(notNullColumns);
        
    } catch (error) {
        console.error('Erreur lors de la vérification de la table users :', error);
    } finally {
        await dataSource.destroy();
    }
}

checkUsersTable();
