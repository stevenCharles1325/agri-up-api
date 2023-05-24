import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { INCOME_TYPES, MEAT_TYPES, MILK_TYPES } from "App/Enums/Income";

export default class CreateIncomeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum([...Object.values(INCOME_TYPES)] as const),
    tag: schema.string.optional({}, [
      rules.requiredWhen(
        "type",
        "=",
        INCOME_TYPES.pigSale || INCOME_TYPES.cattleSale
      ),
      // rules.exists({ table: "swines", column: "swine_tag" }),
    ]),
    meat_type: schema.enum.optional([...Object.values(MEAT_TYPES)] as const, [
      rules.requiredWhen("type", "=", INCOME_TYPES.meatSale),
    ]),
    milk_type: schema.enum.optional([...Object.values(MILK_TYPES)] as const, [
      rules.requiredWhen("type", "=", INCOME_TYPES.milkSale),
    ]),
    quantity: schema.string.optional(),
    date: schema.date(),
    amount: schema.number([rules.range(1, 10000000000000)]),
    notes: schema.string.optional({}, [rules.minLength(5)]),
  });

  public messages: CustomMessages = {
    required: "{{ field }} is required",
    range:
      "{{ field }} must be between {{ options.start }} and {{ options.stop }}",
    minLength:
      "{{ field }} must be at least {{ options.minLength }} characters",
    requiredWhen:
      "{{ field }} is required when setting as {{ options.values }}",
  };
}
