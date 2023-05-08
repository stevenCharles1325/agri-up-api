import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional({}, [ rules.minLength(5) ]),
    firstName: schema.string.optional({}, [ rules.minLength(2) ]),
    lastName: schema.string.optional({}, [ rules.minLength(2) ]),
    email: schema.string.optional({}, [ rules.email(), rules.unique({ table: 'users', column: 'email' }) ]),
    password: schema.string.optional({}, [ rules.minLength(2) ]),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters',
    unique: '{{ field }} already exists',
  }
}
