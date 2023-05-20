import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('reply_id')
        .nullable()
        .unsigned()
        .references('posts.id')
        .onDelete('CASCADE')
        .comment('The id of post to which this post belongs to.')

      table.string('title').nullable()
      table.string('content')
      table.enum('type', ['comment', 'post']).defaultTo('post')
      table.enum('category', ['general', 'cattle', 'goat', 'swine']).defaultTo('general')
      
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
