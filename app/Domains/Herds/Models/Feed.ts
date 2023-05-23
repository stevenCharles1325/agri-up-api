import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import { string } from "@ioc:Adonis/Core/Helpers";
import User from "App/Domains/Users/Models/User";
import FeedName from "./FeedName";

export default class Feed extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public ownerId: number;

  @hasOne(() => User, {
    foreignKey: "ownerId",
  })
  public owner: HasOne<typeof User>;

  @column()
  public feedNameId: number;

  @belongsTo(() => FeedName, {
    foreignKey: "feedNameId",
  })
  public feedName: BelongsTo<typeof FeedName>;

  @column()
  public herdType: string;

  @column.dateTime()
  public date: DateTime;

  @hasOne(() => FeedName, {
    foreignKey: "feedNameId",
  })
  public feed: HasOne<typeof FeedName>;

  @column()
  public quantity: number;

  @column()
  public totalAmount: number;

  @column()
  public notes?: string;

  @column()
  public type: string;

  @column()
  public reason: string;

  @column({
    prepare: (value: string) => string.capitalCase(value),
  })
  public source: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
