import {MigrationInterface, QueryRunner} from "typeorm";

export class SetRatingToNullableTrue1632474040784 implements MigrationInterface {
    name = 'SetRatingToNullableTrue1632474040784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "rating" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "rating" SET NOT NULL`);
    }

}
