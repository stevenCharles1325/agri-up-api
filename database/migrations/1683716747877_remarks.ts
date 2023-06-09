import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "remarks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table.timestamp("date", { useTz: true }).nullable().defaultTo(this.now());

      table.string("notes").nullable();
      table.string("cause").nullable().comment("For deceased");
      table.string("amount").nullable().comment("For sold");

      table.enum("status", ["sold", "culled", "deceased", "archive"]);
      table.enum("herd_type", ["cattle", "goat", "swine"]);
      table.integer("herd_id").unsigned();
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
