import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDoctorProfileIdColumn1763478922985 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column exists with the old name (camelCase)
        const hasCamelCaseColumn = await queryRunner.hasColumn('users', 'doctorProfileId');
        
        // Check if the column exists with the new name (lowercase)
        const hasLowerCaseColumn = await queryRunner.hasColumn('users', 'doctorprofileid');
        
        if (hasCamelCaseColumn && !hasLowerCaseColumn) {
            // If the column exists with camelCase but not with lowercase, rename it
            await queryRunner.query(`
                ALTER TABLE "users" 
                RENAME COLUMN "doctorProfileId" TO "doctorprofileid";
            `);
            console.log('Renamed column from doctorProfileId to doctorprofileid');
        } else if (!hasLowerCaseColumn) {
            // If the column doesn't exist at all, create it
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD COLUMN IF NOT EXISTS "doctorprofileid" integer;
            `);
            console.log('Added missing doctorprofileid column');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the column name back to camelCase if needed
        const hasLowerCaseColumn = await queryRunner.hasColumn('users', 'doctorprofileid');
        const hasCamelCaseColumn = await queryRunner.hasColumn('users', 'doctorProfileId');
        
        if (hasLowerCaseColumn && !hasCamelCaseColumn) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                RENAME COLUMN "doctorprofileid" TO "doctorProfileId";
            `);
        }
    }
}
