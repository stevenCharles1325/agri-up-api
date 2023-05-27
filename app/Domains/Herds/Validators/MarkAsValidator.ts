import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class MarkAsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number.optional(),
    date: schema.date(),
    notes: schema.string.optional([rules.minLength(5)]),
    status: schema.string(),
  });

  public messages: CustomMessages = {
    required: "{{ field }} is required",
    minLength:
      "{{ field }} must be at least {{ options.minLength }} characters long",
  };
}
