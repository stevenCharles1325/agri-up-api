import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import Post from './Post'

export default class HidPost extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // OWNER
  @column()
  public userId: number

  @hasOne(() => User, {
    foreignKey: 'userId',
  })
  public user: HasOne<typeof User>

  @column()
  public postId: number

  @hasOne(() => Post, {
    foreignKey: 'postId',
  })
  public post: HasOne<typeof Post>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
