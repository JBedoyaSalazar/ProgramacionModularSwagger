import { MigrationInterface, QueryRunner } from 'typeorm';

export class newFieldsAtUserModule1785786932859 implements MigrationInterface {
  name = 'newFieldsAtUserModule1785786932859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "customer_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_c7bc1ffb56c570f42053fa7503b" UNIQUE ("customer_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c7bc1ffb56c570f42053fa7503b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c7bc1ffb56c570f42053fa7503b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_c7bc1ffb56c570f42053fa7503b"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "customer_id"`);
  }
}
