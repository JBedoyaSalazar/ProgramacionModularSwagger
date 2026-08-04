import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderProductAndProductEntity1785874655474
  implements MigrationInterface {
  name = 'AddOrderProductAndProductEntity1785874655474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "quantity" integer NOT NULL, "product_id" integer NOT NULL, "order_id" integer NOT NULL, CONSTRAINT "PK_3e59f094c2dc3310d585216a813" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" ADD CONSTRAINT "FK_2d58e8bd11dc840b39f99824d84" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" ADD CONSTRAINT "FK_f258ce2f670b34b38630914cf9e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" DROP CONSTRAINT "FK_f258ce2f670b34b38630914cf9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products" DROP CONSTRAINT "FK_2d58e8bd11dc840b39f99824d84"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "order_products"`);
  }
}
