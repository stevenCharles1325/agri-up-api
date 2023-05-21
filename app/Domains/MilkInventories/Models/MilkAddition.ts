import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/Users/Models/User'
import MilkInventory from './MilkInventory'

export default class MilkAddition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quantity: number

  @column.dateTime()
  public date: DateTime

  @column()
  public notes?: string

  @column()
  public ownerId: number

  @hasOne(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: HasOne<typeof User>

  @column()
  public milkId: number

  @hasOne(() => MilkInventory, {
    foreignKey: 'milkId',
  })
  public milk: HasOne<typeof MilkInventory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
