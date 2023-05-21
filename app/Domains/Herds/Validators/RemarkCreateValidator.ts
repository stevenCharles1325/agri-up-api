import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RemarkCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // ownerId: schema.number.optional([ rules.exists({ table: 'users', column: 'id' }) ]),
    status: schema.enum(['sold', 'culled', 'deceased', 'archive'] as const),
    notes: schema.string.optional({}, [ rules.minLength(5) ]),
    amount: schema.number.optional([
      rules.range(50, 10000000000000),
      rules.requiredWhen('status', '=', 'sold')
    ]),
    cause: schema.string.optional({}, [
      rules.minLength(5),
      rules.requiredWhen('status', '=', 'deceased')
    ]),
    date: schema.date(),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    requiredWhen: '{{ field }} is required when setting as {{ options.values }}',
    'status.enum': '{{ field }} must be one of the following values {{ options.choices }}',
    'amount.range': '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
  }
}
