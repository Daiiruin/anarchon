import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlayerDiscoveries1788431192549 implements MigrationInterface {
  name = 'PlayerDiscoveries1788431192549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player_discoveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "case_id" character varying NOT NULL, "element_id" character varying NOT NULL, "discovered_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_player_discoveries_user_case_element" UNIQUE ("user_id", "case_id", "element_id"), CONSTRAINT "PK_player_discoveries" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_discoveries" ADD CONSTRAINT "FK_player_discoveries_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_discoveries" DROP CONSTRAINT "FK_player_discoveries_user"`,
    );
    await queryRunner.query(`DROP TABLE "player_discoveries"`);
  }
}
