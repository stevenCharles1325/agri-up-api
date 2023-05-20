import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BreedCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // ownerId: schema.number.optional([ rules.exists({ table: 'users', column: 'id' }) ]),
    // herdType: schema.enum.optional(['cattle', 'swine', 'goat'] as const),

    name: schema.string({}, [ rules.minLength(5) ]),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
  }
}
