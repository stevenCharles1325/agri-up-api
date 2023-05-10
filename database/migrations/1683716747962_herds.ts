import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'herds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tag').unique().unsigned()

      table.enum('type', ['cattle', 'swine', 'goat'])
      table.integer('dam_tag').nullable().unsigned().references('herds.tag').onDelete('CASCADE')
      table.integer('sire_tag').nullable().unsigned().references('herds.tag').onDelete('CASCADE')
      table.integer('group_id').nullable().unsigned().references('herd_groups.id').onDelete('CASCADE')
      table.integer('purpose_id').nullable().unsigned().references('purposes.id').onDelete('CASCADE')
      table.integer('remark_id').nullable().unsigned().references('remarks.id').onDelete('CASCADE')

      table.enum('status', ['pregnant', 'non-lactating', 'deceased', 'culled'])

      table.string('name').nullable()
      table.string('gender').notNullable().defaultTo('Male')
      table.string('stage')
      table.string('breed')
      table.string('source').nullable()
      table.string('notes').nullable()

      table.integer('birth_weight')
      table.integer('current_weight')
      
      table.timestamp('birth_date').notNullable().defaultTo(this.now())
      table.timestamp('entered_at').notNullable().defaultTo(this.now())
      table.unique(['tag', 'type'])
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
