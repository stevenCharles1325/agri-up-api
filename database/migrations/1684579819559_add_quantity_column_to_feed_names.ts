import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'feed_names'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('quantity')
        .unsigned()
        .defaultTo(0)
        .comment('Kilograms')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('quantity')
    })
  }
}
