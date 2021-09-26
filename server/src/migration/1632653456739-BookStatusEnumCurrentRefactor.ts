import {MigrationInterface, QueryRunner} from "typeorm";

export class BookStatusEnumCurrentRefactor1632653456739 implements MigrationInterface {
    name = 'BookStatusEnumCurrentRefactor1632653456739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."book_rating_status_enum" RENAME TO "book_rating_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."book_rating_status_enum" AS ENUM('Planning To Read', 'Dropped', 'Currently Reading', 'On Hold', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "status" TYPE "public"."book_rating_status_enum" USING "status"::"text"::"public"."book_rating_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."book_rating_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."book_rating_status_enum_old" AS ENUM('Planning To Read', 'Dropped', 'Currently Watching', 'On Hold', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "public"."book_rating" ALTER COLUMN "status" TYPE "public"."book_rating_status_enum_old" USING "status"::"text"::"public"."book_rating_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."book_rating_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."book_rating_status_enum_old" RENAME TO "book_rating_status_enum"`);
    }

}
