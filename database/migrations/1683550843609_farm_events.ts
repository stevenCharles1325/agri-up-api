import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'farm_events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('creator_id').unsigned().references('users.id').onDelete('CASCADE')

      table.string('title').notNullable()
      table.string('description').nullable()
      table.timestamp('start_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('end_at', { useTz: true }).defaultTo(this.now())

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
