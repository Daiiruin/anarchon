import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropMediaAssets1789222211936 implements MigrationInterface {
  name = 'DropMediaAssets1789222211936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_abe692db8f040135776f51baea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_57672a2943b07ff0670f38093e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_2952eb2049a61afab026e058587"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP COLUMN "map_asset_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP COLUMN "detail_background_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP COLUMN "cover_asset_id"`,
    );
    await queryRunner.query(`DROP TABLE "media_assets"`);
    await queryRunner.query(`DROP TYPE "public"."media_assets_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."media_assets_type_enum" AS ENUM('IMAGE', 'AUDIO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "media_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "case_id" uuid, "key" character varying NOT NULL, "type" "public"."media_assets_type_enum" NOT NULL, "storage_path" character varying NOT NULL, "mime_type" character varying NOT NULL, "width" integer, "height" integer, "duration_ms" integer, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca47e9f67a5e5d8af1e75d66ee6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD "cover_asset_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD "detail_background_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD "map_asset_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD CONSTRAINT "FK_2952eb2049a61afab026e058587" FOREIGN KEY ("cover_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD CONSTRAINT "FK_57672a2943b07ff0670f38093e9" FOREIGN KEY ("detail_background_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" ADD CONSTRAINT "FK_abe692db8f040135776f51baea4" FOREIGN KEY ("map_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
