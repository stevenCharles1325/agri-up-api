import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CalendarCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(['reminder', 'task'] as const),
    status: schema.enum(['done', 'pending']),
    notes: schema.string({ trim: true }, [
      rules.minLength(5),
    ]),
    remindAt: schema.date.optional(),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    enum: '{{ field }} must be any of the following values: {{ options.choices }}',
  }
}
