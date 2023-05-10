import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Herd extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public damTag: number

  @hasOne(() => Herd)
  public dam: HasOne<typeof Herd>

  @column()
  public sireTag: number

  @hasOne(() => Herd)
  public sire: HasOne<typeof Herd>

  @column()
  public groupId: number

  // @hasOne(() => HerdGroup)
  // public group: HasOne<typeof HerdGroup>

  @column()
  public purposeId: number

  // @hasOne(() => Purpose)
  // public purpose: HasOne<typeof Purpose>

  @column()
  public remarkId: number

  // @hasOne(() => Remark)
  // public remark: HasOne<typeof Remark>

  @column()
  public status: string

  @column()
  public name: string
  
  @column()
  public gender: string

  @column()
  public stage: string

  @column()
  public breed: string

  @column()
  public source: string

  @column()
  public notes: string

  @column()
  public birthWeight: number

  @column()
  public currentWeight: number

  @column()
  public birthDate: DateTime

  @column()
  public enteredAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
