import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import HerdGroup from "App/Domains/Herds/Models/HerdGroup";
import User from "App/Domains/Users/Models/User";
import Purpose from "./Purpose";
import Remark from "./Remark";
import Breed from "./Breed";
import { string } from "@ioc:Adonis/Core/Helpers";

export default class Herd extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public ownerId: number;

  @hasOne(() => User, {
    foreignKey: "ownerId",
  })
  public owner: HasOne<typeof User>;

  @column()
  public tag: string;

  @column()
  public type: string;

  @column()
  public damTag: number;

  @belongsTo(() => Herd, {
    localKey: "id",
    foreignKey: "damTag",
  })
  public dam: BelongsTo<typeof Herd>;

  @column()
  public sireTag: number;

  @belongsTo(() => Herd, {
    localKey: "id",
    foreignKey: "sireTag",
  })
  public sire: BelongsTo<typeof Herd>;

  @column()
  public groupId: number | null;

  @hasOne(() => HerdGroup, {
    foreignKey: "id",
    localKey: "groupId",
  })
  public group: HasOne<typeof HerdGroup>;

  @column()
  public purposeId: number;

  @hasOne(() => Purpose, {
    foreignKey: "id",
    localKey: "purposeId",
  })
  public purpose: HasOne<typeof Purpose>;

  @column()
  public remarkId: number;

  @hasOne(() => Remark, {
    foreignKey: "id",
    localKey: "remarkId",
  })
  public remark: HasOne<typeof Remark>;

  @column()
  public breedId: number | null;

  @hasOne(() => Breed, {
    foreignKey: "id",
    localKey: "breedId",
  })
  public breed: HasOne<typeof Breed>;

  @column()
  public status: string;

  @column()
  public name: string;

  @column({
    prepare: (value: string) => string.capitalCase(value),
  })
  public gender: string;

  @column()
  public stage: string;

  @column()
  public source: string;

  @column()
  public notes: string;

  @column()
  public birthWeight: number;

  @column()
  public currentWeight: number;

  @column.dateTime()
  public birthDate: DateTime;

  @column.dateTime()
  public enteredAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime | null;
}
