import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingUserColumns1763479140000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add bio column if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'bio') THEN
                    ALTER TABLE "users" ADD COLUMN "bio" text;
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'workingHours') THEN
                    ALTER TABLE "users" ADD COLUMN "workingHours" jsonb;
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'rppsNumber') THEN
                    ALTER TABLE "users" ADD COLUMN "rppsNumber" varchar;
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'diploma') THEN
                    ALTER TABLE "users" ADD COLUMN "diploma" varchar;
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'users' AND column_name = 'languages') THEN
                    ALTER TABLE "users" ADD COLUMN "languages" varchar[];
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";
            ALTER TABLE "users" DROP COLUMN IF EXISTS "workingHours";
            ALTER TABLE "users" DROP COLUMN IF EXISTS "rppsNumber";
            ALTER TABLE "users" DROP COLUMN IF EXISTS "diploma";
            ALTER TABLE "users" DROP COLUMN IF EXISTS "languages";
        `);
    }
}
