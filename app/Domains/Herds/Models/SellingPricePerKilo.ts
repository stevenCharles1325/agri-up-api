import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Domains/Users/Models/User";

export default class SellingPricePerKilo extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public ownerId: number;

  @hasOne(() => User, {
    foreignKey: "ownerId",
  })
  public owner: HasOne<typeof User>;

  @column()
  public name: string;

  @column()
  public quantity: number;

  @column()
  public herdType: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
