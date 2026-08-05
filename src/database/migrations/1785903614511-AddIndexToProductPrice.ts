import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToProductPrice1785903614511 implements MigrationInterface {
  name = 'AddIndexToProductPrice1785903614511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_75895eeb1903f8a17816dafe0a" ON "products" ("price") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_75895eeb1903f8a17816dafe0a"`,
    );
  }
}
