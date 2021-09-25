import {MigrationInterface, QueryRunner} from "typeorm";

export class VolumeIdColumnNoUniqueConstraint1632483361698 implements MigrationInterface {
    name = 'VolumeIdColumnNoUniqueConstraint1632483361698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" DROP CONSTRAINT "UQ_739cbcde7f418c65b8643834796"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ADD CONSTRAINT "UQ_739cbcde7f418c65b8643834796" UNIQUE ("volumeId")`);
    }

}
