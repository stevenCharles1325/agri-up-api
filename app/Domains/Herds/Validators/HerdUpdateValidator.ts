import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class HerdUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    damTag: schema.string.optional({ trim: true }, [
      rules.exists({ table: "herds", column: "tag" }),
    ]),
    sireTag: schema.string.optional({ trim: true }, [
      rules.exists({ table: "herds", column: "tag" }),
    ]),
    groupId: schema.number.optional([
      rules.exists({ table: "herd_groups", column: "id" }),
    ]),
    purposeId: schema.number.optional([
      rules.exists({ table: "purposes", column: "id" }),
    ]),
    remarkId: schema.number.optional([
      rules.exists({ table: "remarks", column: "id" }),
    ]),
    breedId: schema.number.optional([
      rules.exists({ table: "breeds", column: "id" }),
    ]),
    status: schema.enum.optional([
      "pregnant",
      "non-lactating",
      "deceased",
      "culled",
    ] as const),
    name: schema.string({}, [rules.minLength(2)]),
    gender: schema.enum.optional(["male", "female"] as const),
    stage: schema.string.optional(),
    source: schema.string.optional(),
    notes: schema.string.optional(),
    birthWeight: schema.number.optional(),
    currentWeight: schema.number.optional(),
    enteredAt: schema.date.optional({}),
    birthDate: schema.date.optional({}, [rules.beforeField("enteredAt")]),
  });

  public messages: CustomMessages = {
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
