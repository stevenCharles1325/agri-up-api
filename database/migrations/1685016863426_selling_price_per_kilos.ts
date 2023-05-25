import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "selling_price_per_kilos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table.string("name");
      table.enum("herd_type", ["cattle", "swine", "goat"]);

      table.unique(["owner_id", "name"]);
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
