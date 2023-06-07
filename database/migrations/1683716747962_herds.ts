import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "herds";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("tag");

      table.enum("type", ["cattle", "swine", "goat"]);
      table
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .integer("dam_tag")
        .nullable()
        .references("herds.id")
        .onDelete("SET NULL");
      table
        .integer("sire_tag")
        .nullable()
        .references("herds.id")
        .onDelete("SET NULL");
      table
        .integer("group_id")
        .nullable()
        .unsigned()
        .references("herd_groups.id")
        .onDelete("SET NULL");
      table
        .integer("purpose_id")
        .nullable()
        .unsigned()
        .references("purposes.id")
        .onDelete("SET NULL");
      table
        .integer("breed_id")
        .nullable()
        .unsigned()
        .references("breeds.id")
        .onDelete("SET NULL");
      table
        .integer("remark_id")
        .nullable()
        .unsigned()
        .references("remarks.id")
        .onDelete("SET NULL");

      table
        .enum("status", [
          "sold",
          "pregnant",
          "non-lactating",
          "deceased",
          "culled",
        ])
        .defaultTo(null);
      table.enum("gender", ["Male", "Female"]).notNullable().defaultTo("Male");

      table.string("stage");
      table.string("name").nullable();
      table.string("source").nullable();
      table.string("notes").nullable();

      table.integer("birth_weight");
      table.integer("current_weight");

      table.timestamp("birth_date").notNullable().defaultTo(this.now());
      table.timestamp("entered_at").notNullable().defaultTo(this.now());
      table.unique(["owner_id", "tag", "type"]);

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
