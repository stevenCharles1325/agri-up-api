import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import FeedName from './FeedName'

export default class Feed extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ownerId: number

  @hasOne(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: HasOne<typeof User>

  @column()
  public herdType: string

  @column.dateTime()
  public date: DateTime

  @hasOne(() => FeedName, {
    foreignKey: 'feedNameId',
  })
  public feedName: HasOne<typeof FeedName>

  @column()
  public quantity: number

  @column()
  public totalAmount: number

  @column()
  public notes?: string

  @column()
  public source: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
