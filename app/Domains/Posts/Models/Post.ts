import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import Like from './Like'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public category: string

  @column()
  public type: string // "comment" or "post"

  // OWNER
  @column()
  public ownerId: number

  @hasOne(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: HasOne<typeof User>

  // COMMENTS
  @column()
  public replyId?: number

  @hasMany(() => Post, {
    foreignKey: 'replyId',
  })
  public replies: HasMany<typeof Post>

  @belongsTo(() => Post, {
    foreignKey: 'replyId',
  })
  public repliedTo: BelongsTo<typeof Post>

  @hasMany(() => Like, {
    foreignKey: 'postId',
  })
  public likes: HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
