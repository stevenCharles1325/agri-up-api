import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EXPENSE_TYPE } from 'App/Enums/Expense'

export default class UpdateExpenseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum.optional([
      ...Object.values(EXPENSE_TYPE)
    ] as const),
    date: schema.date.optional(),
    amount: schema.number.optional([ rules.range(1, Infinity) ]),
    notes: schema.string.optional({}, [ rules.minLength(3) ]),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    range: '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters',
  }
}
