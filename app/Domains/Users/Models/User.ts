import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import FarmEvent from 'App/Domains/FarmEvents/Models/FarmEvent'
import Herd from 'App/Domains/Herds/Models/Herd'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => FarmEvent, {
    foreignKey: 'userId',
  })
  public farmEvents: HasMany<typeof FarmEvent>

  @hasMany(() => Herd, {
    foreignKey: 'ownerId',
  })
  public herds: HasMany<typeof Herd>

  // COUNTS THAT ARE NOT IN SCHEMA
  @column()
  public cattleCount: number

  @column()
  public swineCount: number

  @column()
  public goatCount: number

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
