import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({}, [rules.minLength(2)]),
    lastName: schema.string({}, [rules.minLength(2)]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    username: schema.string({}, [
      rules.minLength(5),
      rules.unique({ table: "users", column: "username" }),
    ]),
    password: schema.string({}, [rules.minLength(2)]),
  });

  public messages: CustomMessages = {
    required: "{{ field }} is required",
    minLength:
      "{{ field }} must be at least {{ options.minLength }} characters",
    unique: "{{ field }} already exists",
  };
}
