import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhoneToUsers1763478078857 implements MigrationInterface {
    name = 'AddPhoneToUsers1763478078857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne existe déjà
        const hasColumn = await queryRunner.hasColumn('users', 'phone');
        
        if (!hasColumn) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'phone',
                type: 'varchar',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne phone si elle existe
        const hasColumn = await queryRunner.hasColumn('users', 'phone');
        
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'phone');
        }
    }
}
