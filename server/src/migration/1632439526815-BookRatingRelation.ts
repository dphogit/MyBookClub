import { MigrationInterface, QueryRunner } from "typeorm";

export class BookRatingRelation1632439526815 implements MigrationInterface {
  name = "BookRatingRelation1632439526815";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_expire"`);
    await queryRunner.query(
      `CREATE TYPE "book_rating_status_enum" AS ENUM('Planning To Read', 'Dropped', 'Currently Watching', 'On Hold', 'Completed')`
    );
    await queryRunner.query(
      `CREATE TABLE "book_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "volumeId" character varying NOT NULL, "title" character varying NOT NULL, "rating" integer NOT NULL, "status" "book_rating_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_739cbcde7f418c65b8643834796" UNIQUE ("volumeId"), CONSTRAINT "PK_c883e6b2f58f75d18653ccdefc4" PRIMARY KEY ("id"))`
    );
    // await queryRunner.query(`ALTER TABLE "public"."session" DROP CONSTRAINT "PK_7575923e18b495ed2307ae629ae"`);
    // await queryRunner.query(`ALTER TABLE "public"."session" DROP COLUMN "sid"`);
    // await queryRunner.query(`ALTER TABLE "public"."session" DROP COLUMN "sess"`);
    // await queryRunner.query(`ALTER TABLE "public"."session" DROP COLUMN "expire"`);
    // await queryRunner.query(`ALTER TABLE "public"."session" ADD "expiredAt" bigint NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "public"."session" ADD "id" character varying(255) NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "public"."session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
    // await queryRunner.query(`ALTER TABLE "public"."session" ADD "json" text NOT NULL`);
    // await queryRunner.query(`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "public"."session" ("expiredAt") `);
    await queryRunner.query(
      `ALTER TABLE "book_rating" ADD CONSTRAINT "FK_a5717207cdadebd106a9a93d635" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_rating" DROP CONSTRAINT "FK_a5717207cdadebd106a9a93d635"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`
    );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" DROP COLUMN "json"`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`
    // );
    // await queryRunner.query(`ALTER TABLE "public"."session" DROP COLUMN "id"`);
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" DROP COLUMN "expiredAt"`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" ADD "expire" TIMESTAMP NOT NULL`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" ADD "sess" json NOT NULL`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" ADD "sid" character varying NOT NULL`
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "public"."session" ADD CONSTRAINT "PK_7575923e18b495ed2307ae629ae" PRIMARY KEY ("sid")`
    // );
    await queryRunner.query(`DROP TABLE "book_rating"`);
    await queryRunner.query(`DROP TYPE "book_rating_status_enum"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_session_expire" ON "public"."session" ("expire") `
    );
  }
}
