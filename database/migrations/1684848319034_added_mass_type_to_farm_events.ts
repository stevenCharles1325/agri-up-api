import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'farm_events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('event_type')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('event_type')
    })
  }
}
