import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "feed_records";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .integer("feed_name_id")
        .unsigned()
        .references("feed_names.id")
        .onDelete("CASCADE");
      table.enum("herd_type", ["cattle", "swine", "goat"]);

      table.timestamp("date", { useTz: true }).defaultTo(this.now());
      table.enum("consumed_by", ["individual", "group"]);
      table.string("consumer");

      table.integer("quantity").unsigned();
      table.string("notes").nullable();
      table.string("time").nullable();
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
