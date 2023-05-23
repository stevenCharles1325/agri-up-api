import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FarmEventCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // ownerId: schema.number.optional([ rules.exists({ table: 'users', column: 'id' }) ]),
    typeId: schema.number.optional([ rules.exists({ table: 'event_types', column: 'id' }) ]),
    category: schema.enum(['mass', 'individual'] as const),
    herdTag: schema.number.optional([
      rules.requiredWhen('category', '=', 'individual'),
      rules.exists({ table: 'herds', column: 'tag' }),
    ]),
    herdType: schema.enum(['cattle', 'swine', 'goat'] as const),
    description: schema.string.optional({}, [ rules.minLength(5) ]),
    others: schema.string.optional({}),
    startAt: schema.date(),
    endAt: schema.date(),
  })


  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters.',
    requiredWhen: '{{ field }} is required when setting as {{ options.values }}',
  }
}
