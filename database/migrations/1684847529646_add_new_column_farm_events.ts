import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'farm_events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('herd_id')
      table.dropColumns('title', 'herd_id')
      table.string('herd_tag').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('herd_tag')
      table.dropColumn('herd_tag')
      table.string('title')
      table.integer('herd_id').nullable().unsigned().references('users.id').onDelete('CASCADE')
    })
  }
}
