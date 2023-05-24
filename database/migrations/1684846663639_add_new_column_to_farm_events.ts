import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'farm_events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('other_data')
      table.string('others')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('others')
    })
  }
}
