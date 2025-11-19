import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAddressToUsers1763477810638 implements MigrationInterface {
    name = 'AddAddressToUsers1763477810638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne existe déjà
        const hasColumn = await queryRunner.hasColumn('users', 'address');
        
        if (!hasColumn) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'address',
                type: 'varchar',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne address si elle existe
        const hasColumn = await queryRunner.hasColumn('users', 'address');
        
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'address');
        }
    }
}
