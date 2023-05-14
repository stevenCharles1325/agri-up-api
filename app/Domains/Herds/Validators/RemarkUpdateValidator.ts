import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RemarkUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    notes: schema.string.optional({}, [ rules.minLength(5) ]),
    amount: schema.number.optional([
      rules.range(50, Infinity),
      rules.requiredWhen('status', '=', 'sold')
    ]),
    cause: schema.string.optional({}, [
      rules.minLength(5),
      rules.requiredWhen('status', '=', 'deceased')
    ]),
    date: schema.date.optional(),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    requiredWhen: '{{ field }} is required when setting as {{ options.values }}',
    'amount.range': '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
  }
}
