import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSpecialtyToUsers1763477658648 implements MigrationInterface {
    name = 'AddSpecialtyToUsers1763477658648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne existe déjà
        const hasColumn = await queryRunner.hasColumn('users', 'specialty');
        
        if (!hasColumn) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'specialty',
                type: 'varchar',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne specialty si elle existe
        const hasColumn = await queryRunner.hasColumn('users', 'specialty');
        
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'specialty');
        }
    }
}
