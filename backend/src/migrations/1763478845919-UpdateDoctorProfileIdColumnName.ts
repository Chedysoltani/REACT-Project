import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDoctorProfileIdColumnName1763478845919 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, check if the column exists with the old name
        const hasColumn = await queryRunner.hasColumn('users', 'doctorprofileid');
        
        if (hasColumn) {
            // Rename the column to match the entity definition
            await queryRunner.query(`
                ALTER TABLE "users" 
                RENAME COLUMN "doctorprofileid" TO "doctorProfileId";
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the column name back to the original
        await queryRunner.query(`
            ALTER TABLE "users" 
            RENAME COLUMN "doctorProfileId" TO "doctorprofileid";
        `);
    }
}
