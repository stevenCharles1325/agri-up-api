import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'calendars'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('remindAt', 'remind_at')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('remind_at', 'remindAt')
    })
  }
}
