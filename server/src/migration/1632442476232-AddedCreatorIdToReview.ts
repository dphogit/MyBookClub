import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCreatorIdToReview1632442476232 implements MigrationInterface {
    name = 'AddedCreatorIdToReview1632442476232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" DROP CONSTRAINT "FK_a5717207cdadebd106a9a93d635"`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" RENAME COLUMN "userId" TO "creatorId"`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "creatorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ADD CONSTRAINT "FK_27c79f02d9cf1b0aae4132d3690" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" DROP CONSTRAINT "FK_27c79f02d9cf1b0aae4132d3690"`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "creatorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" RENAME COLUMN "creatorId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ADD CONSTRAINT "FK_a5717207cdadebd106a9a93d635" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
