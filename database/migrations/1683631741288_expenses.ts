import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "expenses";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");

      table.string("type");
      table.string("herds_type");
      table.string("tag");
      table.string("name");
      table.timestamp("date").notNullable().defaultTo(this.now());
      table.integer("amount");
      table.string("notes", 255).nullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("deleted_at", { useTz: true }).nullable().defaultTo(null);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
