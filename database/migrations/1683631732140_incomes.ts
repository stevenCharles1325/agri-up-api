import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "incomes";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");

      table.string("type");
      table.string("tag");
      table.string("meat_type");
      table.string("milk_type");
      table.string("quantity");
      table.timestamp("date").notNullable().defaultTo(this.now());
      table.integer("amount");
      table.string("notes", 255).nullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
