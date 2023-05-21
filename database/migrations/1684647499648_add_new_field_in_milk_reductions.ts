import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'milk_reductions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('herd_type', ['cattle', 'goat'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('herd_type')
    })
  }
}
