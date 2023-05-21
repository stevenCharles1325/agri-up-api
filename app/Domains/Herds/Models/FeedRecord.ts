import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import FeedName from './FeedName'

export default class FeedRecord extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public notes: string

  @column()
  public quantity: number

  @column()
  public herdType: string

  @column.dateTime()
  public date: DateTime
  
  @column()
  public consumedBy: string

  @column()
  public consumer: string

  @column()
  public ownerId: number

  @hasOne(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: HasOne<typeof User>

  @column()
  public feedNameId: number

  @hasOne(() => FeedName, {
    foreignKey: 'feedNameId',
  })
  public feed: HasOne<typeof FeedName>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
