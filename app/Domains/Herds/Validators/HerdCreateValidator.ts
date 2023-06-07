import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class HerdCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    tag: schema.string({ trim: true }, [
      rules.minLength(4),
      rules.unique({ 
        table: "herds", 
        column: "tag",
        where: {
          owner_id: this.ctx.auth.use('jwt').user?.id,
        }
      }),
    ]),
    damTag: schema.number.optional([
      rules.exists({ table: "herds", column: "id" }),
    ]),
    sireTag: schema.number.optional([
      rules.exists({ table: "herds", column: "id" }),
    ]),
    groupId: schema.number.optional([
      rules.exists({ table: "herd_groups", column: "id" }),
    ]),
    breedId: schema.number.optional([
      rules.exists({ table: "breeds", column: "id" }),
    ]),
    purposeId: schema.number([
      rules.exists({ table: "purposes", column: "id" }),
    ]),
    remarkId: schema.number.optional([
      rules.exists({ table: "remarks", column: "id" }),
    ]),
    status: schema.enum.optional([
      "pregnant",
      "non-lactating",
      "deceased",
      "culled",
    ] as const),
    name: schema.string.optional({}, [rules.minLength(2)]),
    gender: schema.enum(["male", "female"] as const),
    stage: schema.string(),
    source: schema.string.optional(),
    notes: schema.string.optional(),
    birthWeight: schema.number.optional(),
    currentWeight: schema.number.optional(),
    enteredAt: schema.date({}),
    birthDate: schema.date({}, [rules.beforeField("enteredAt")]),
  });

  public messages: CustomMessages = {
    "groupId.required": "Group is required",
    "breedId.required": "Breed is required",
    "purposeId.required": "Purpose is required",
    required: "{{ field }} is required",
    minLength:
      "{{ field }} must be at least {{ options.minLength }} characters long",
    "damTag.exists": "Dam-tag value does not exist",
    "sireTag.exists": "Sire-tag value does not exist",
    "groupId.exists": "Group value does not exist",
    "remarkId.exists": "Remark value does not exist",
    "breedId.exists": "Breed value does not exist",
    enum: "{{ field }} must be any of the following values: {{ options.choices }}",
    "birthDate.beforeField": "Birth-date must be before the Date of Entry",
  };
}
