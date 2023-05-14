import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FarmEventCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ownerId: schema.number.optional([ rules.exists({ table: 'users', column: 'id' }) ]),
    typeId: schema.number.optional([ rules.exists({ table: 'event_types', column: 'id' }) ]),
    herdId: schema.number.optional([ 
      rules.requiredWhen('type', '=', 'individual'),
      rules.exists({ table: 'herds', column: 'id' }),
    ]),
    herdType: schema.enum(['cattle', 'swine', 'goat'] as const),
    category: schema.enum(['mass', 'individual'] as const),
    title: schema.string({}, [ rules.minLength(5) ]),
    description: schema.string.optional({}, [ rules.minLength(5) ]),
    startAt: schema.date(),
    endAt: schema.date(),
  })


  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters.',
  }
}
