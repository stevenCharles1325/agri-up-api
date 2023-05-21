import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'milk_additions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('milk_id').unsigned().references('milk_inventories.id').onDelete('CASCADE')

      table.timestamp('date', { useTz: true }).defaultTo(this.now())
      table.integer('quantity').unsigned().comment('Liters')
      table.string('notes').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
