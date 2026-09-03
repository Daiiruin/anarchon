import { MigrationInterface, QueryRunner } from 'typeorm';

export class Accusations1788431772542 implements MigrationInterface {
  name = 'Accusations1788431772542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accusations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "case_id" character varying NOT NULL, "suspect_id" character varying NOT NULL, "motive_id" character varying NOT NULL, "weapon_id" character varying NOT NULL, "is_correct" boolean NOT NULL, "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_accusations" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accusations" ADD CONSTRAINT "FK_accusations_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accusations" DROP CONSTRAINT "FK_accusations_user"`,
    );
    await queryRunner.query(`DROP TABLE "accusations"`);
  }
}
