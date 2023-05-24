import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Domains/Users/Models/User";

export default class Income extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public ownerId: number;

  @belongsTo(() => User, {
    foreignKey: "ownerId",
  })
  public owner: BelongsTo<typeof User>;

  // @column({
  //   prepare: (value: object) => value && JSON.stringify(value),
  //   consume: (value: string) => value && JSON.parse(value),
  // })
  // public others: string

  @column()
  public type: string;

  @column()
  public tag: string;

  @column()
  public meat_type: string;

  @column()
  public milk_type: string;

  @column()
  public quantity: string;

  @column.dateTime()
  public date: DateTime;

  @column()
  public amount: number;

  @column()
  public notes?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
