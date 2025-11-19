import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAddressFromUsers1763477874214 implements MigrationInterface {
    name = 'RemoveAddressFromUsers1763477874214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si la colonne existe avant de la supprimer
        const hasColumn = await queryRunner.hasColumn('users', 'address');
        
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'address');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Dans le cas où vous voudriez annuler cette migration
        // (mais comme on ne veut pas de ce champ, cette méthode reste vide)
    }
}
