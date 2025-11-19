import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoctorsTable1763477320727 implements MigrationInterface {
    name = 'CreateDoctorsTable1763477320727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la table doctors existe déjà
        const tableExists = await queryRunner.hasTable('doctors');
        
        if (!tableExists) {
            await queryRunner.query(`
                CREATE TABLE "doctors" (
                    "id" SERIAL PRIMARY KEY,
                    "specialty" character varying NOT NULL,
                    "bio" text,
                    "schedule" jsonb,
                    "userId" integer UNIQUE NOT NULL,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
                )
            `);

            await queryRunner.query(`
                ALTER TABLE "doctors" 
                ADD CONSTRAINT "FK_doctors_userId_users_id" 
                FOREIGN KEY ("userId") REFERENCES "users"("id") 
                ON DELETE CASCADE
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT IF EXISTS "FK_doctors_userId_users_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "doctors"`);
    }
}
