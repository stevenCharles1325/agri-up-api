import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'

export default class FarmEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public creatorId: number

  @belongsTo(() => User, {
    foreignKey: 'creatorId',
  })
  public creator: BelongsTo<typeof User>

  @column()
  public title: string

  @column()
  public description?: string

  @column.dateTime()
  public startAt: DateTime

  @column.dateTime()
  public endAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
