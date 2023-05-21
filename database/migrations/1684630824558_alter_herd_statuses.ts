import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'herds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['none', 'pregnant', 'non-lactating', 'deceased', 'culled'])
        .defaultTo('none')
        .alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['pregnant', 'non-lactating', 'deceased', 'culled'])
        .alter()
    })
  }
}
