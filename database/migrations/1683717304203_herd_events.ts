import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'herd_events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('event_name')
      table.integer('herd_id').unsigned().references('herds.id').onDelete('CASCADE')
      table.timestamp('start_date', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('end_date', { useTz: true }).notNullable().defaultTo(this.now())
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
