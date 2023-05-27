import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected oldTableName = 'reminders'
  protected newTableName = 'calendars'

  public async up () {
    this.schema.renameTable(this.oldTableName, this.newTableName)
  }

  public async down () {
    this.schema.renameTable(this.newTableName, this.oldTableName)
  }
}
