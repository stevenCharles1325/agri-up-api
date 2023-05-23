import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import Herd from 'App/Domains/Herds/Models/Herd'
import EventType from './EventType'

export default class FarmEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ownerId: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public herdTag?: number

  @belongsTo(() => Herd, {
    foreignKey: 'herdTag',
  })
  public herd: BelongsTo<typeof Herd>

  @column()
  public herdType: string

  @column()
  public eventType: string

  // @column()
  // public typeId: number

  // @hasOne(() => EventType, {
  //   foreignKey: 'typeId',
  // })
  // public type: HasOne<typeof EventType>

  @column()
  public category: string

  @column()
  public description?: string

  @column()
  public others?: string

  @column.dateTime()
  public startAt: DateTime

  @column.dateTime()
  public endAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
