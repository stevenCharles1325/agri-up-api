import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MilkReductionCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    quantity: schema.number([
      rules.range(1, 10000000000000),
    ]),
    date: schema.date(),
    notes: schema.string.optional({ trim: true }, [
      rules.minLength(5),
    ]),
    totalAmount: schema.number.optional([
      rules.range(1, 10000000000000),
      rules.requiredWhen('reason', '=', 'sold'),
    ]),
    reason: schema.enum([
      'spoilt/spilled',
      'lost/stolen',
      'sold',
      'gift',
    ] as const),
  })

  public messages: CustomMessages = {
    range: '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
    minLength: '{{ field }} must be at least {{ options.minLenth }}',
    requiredWhen: '{{ field }} is required when setting as {{ options.values }}',
  }
}
