import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhotoToUsers1763478170289 implements MigrationInterface {
    name = 'AddPhotoToUsers1763478170289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne existe déjà
        const hasColumn = await queryRunner.hasColumn('users', 'photo');
        
        if (!hasColumn) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'photo',
                type: 'varchar',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne photo si elle existe
        const hasColumn = await queryRunner.hasColumn('users', 'photo');
        
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'photo');
        }
    }
}
