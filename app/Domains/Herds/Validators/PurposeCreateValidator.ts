import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PurposeCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ownerId: schema.number.optional([ rules.exists({ table: 'users', column: 'id' }) ]),
    name: schema.string({}, [ rules.minLength(5) ]),
    herdType: schema.enum(['cattle', 'swine', 'goat'] as const),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    'herdType.enum': 'Herd type must be one of the following {{ options.choices  }}',
  }
}
