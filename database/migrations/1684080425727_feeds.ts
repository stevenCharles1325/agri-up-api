import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "feeds";

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

      table.enum("source", ["Bought", "Gift", "Recycled", "Others"]);
      table.timestamp("date", { useTz: true }).defaultTo(this.now());
      table.integer("quantity").unsigned();
      table.integer("total_amount");
      table.string("notes").nullable();
      table.enum("type", ["add", "reduced"]);
      table.enum("reason", ["spoilt", "lost", "consumed", "others"]).nullable();
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
