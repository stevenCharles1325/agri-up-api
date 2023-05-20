import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, hasOne, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import FarmEvent from 'App/Domains/FarmEvents/Models/FarmEvent'

export default class Calendar extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public notes: string

  @column()
  public type: string

  @column()
  public status: string

  @column()
  public ownerId: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public farmEventId: number

  @hasOne(() => FarmEvent, {
    foreignKey: 'farmEventId',
  })
  public farmEvent: HasOne<typeof FarmEvent>

  @column.dateTime()
  public remindAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
