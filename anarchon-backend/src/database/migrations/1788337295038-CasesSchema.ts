import { MigrationInterface, QueryRunner } from 'typeorm';

export class CasesSchema1788337295038 implements MigrationInterface {
  name = 'CasesSchema1788337295038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."media_assets_type_enum" AS ENUM('IMAGE', 'AUDIO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "media_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "case_id" uuid, "key" character varying NOT NULL, "type" "public"."media_assets_type_enum" NOT NULL, "storage_path" character varying NOT NULL, "mime_type" character varying NOT NULL, "width" integer, "height" integer, "duration_ms" integer, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca47e9f67a5e5d8af1e75d66ee6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cases_publication_status_enum" AS ENUM('DRAFT', 'PUBLISHED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "era_label" character varying NOT NULL, "synopsis" text NOT NULL, "difficulty" smallint NOT NULL, "theme_key" character varying NOT NULL, "publication_status" "public"."cases_publication_status_enum" NOT NULL DEFAULT 'DRAFT', "cover_asset_id" uuid, "detail_background_id" uuid, "map_asset_id" uuid, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_334e33acab18c5105c2b8c3bb7c" UNIQUE ("slug"), CONSTRAINT "CHK_8ce8092a8b55c3b5843f1a0754" CHECK ("difficulty" BETWEEN 1 AND 5), CONSTRAINT "PK_264acb3048c240fb89aa34626db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "case_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "case_id" character varying NOT NULL, "started_at" TIMESTAMP WITH TIME ZONE NOT NULL, "completed_at" TIMESTAMP WITH TIME ZONE, "last_location_element_id" character varying, CONSTRAINT "UQ_61e34bdd889be324371b5062e4b" UNIQUE ("user_id", "case_id"), CONSTRAINT "PK_cc3a0f2f39d8d10ccf37b2133b5" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(
      `ALTER TABLE "case_progress" ADD CONSTRAINT "FK_e94fa75657f716ca78670adfd9e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "case_progress" DROP CONSTRAINT "FK_e94fa75657f716ca78670adfd9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_abe692db8f040135776f51baea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_57672a2943b07ff0670f38093e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cases" DROP CONSTRAINT "FK_2952eb2049a61afab026e058587"`,
    );
    await queryRunner.query(`DROP TABLE "case_progress"`);
    await queryRunner.query(`DROP TABLE "cases"`);
    await queryRunner.query(
      `DROP TYPE "public"."cases_publication_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "media_assets"`);
    await queryRunner.query(`DROP TYPE "public"."media_assets_type_enum"`);
  }
}
