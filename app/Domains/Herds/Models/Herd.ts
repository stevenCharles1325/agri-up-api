import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import HerdGroup from 'App/Domains/Herds/Models/HerdGroup'
import User from 'App/Domains/Users/Models/User'
import Purpose from './Purpose'
import Remark from './Remark'
import Breed from './Breed'

export default class Herd extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ownerId: number

  @hasOne(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: HasOne<typeof User>

  @column()
  public tag: number

  @column()
  public type: string

  @column()
  public damTag: number

  @belongsTo(() => Herd, {
    localKey: 'tag',
    foreignKey: 'damTag',
  })
  public dam: BelongsTo<typeof Herd>

  @column()
  public sireTag: number

  @belongsTo(() => Herd, {
    localKey: 'tag',
    foreignKey: 'sireTag',
  })
  public sire: BelongsTo<typeof Herd>

  @column()
  public groupId: number

  @hasOne(() => HerdGroup, {
    foreignKey: 'groupId',
  })
  public group: HasOne<typeof HerdGroup>

  @column()
  public purposeId: number

  @hasOne(() => Purpose, {
    foreignKey: 'purposeId',
  })
  public purpose: HasOne<typeof Purpose>

  @column()
  public remarkId: number

  @hasOne(() => Remark, {
    foreignKey: 'remarkId',
  })
  public remark: HasOne<typeof Remark>

  @column()
  public breedId: number

  @hasOne(() => Breed, {
    foreignKey: 'breedId',
  })
  public breed: HasOne<typeof Breed>

  @column()
  public status: string

  @column()
  public name: string
  
  @column()
  public gender: string

  @column()
  public stage: string

  @column()
  public source: string

  @column()
  public notes: string

  @column()
  public birthWeight: number

  @column()
  public currentWeight: number

  @column.dateTime()
  public birthDate: DateTime

  @column.dateTime()
  public enteredAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
function belongTo(arg0: () => typeof Herd, arg1: { localKey: string; foreignKey: string }): (target: Herd, propertyKey: "sire") => void {
  throw new Error('Function not implemented.')
}

