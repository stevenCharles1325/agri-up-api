import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'farm_events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('other_data').nullable().comment('Other data in json stringified format')
    })
  }

  public async down () {
    // this.schema.alterTable(this.tableName, (table) => {
    // })
  }
}
