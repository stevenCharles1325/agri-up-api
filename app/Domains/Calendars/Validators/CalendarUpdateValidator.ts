import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CalendarUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    notes: schema.string.optional({ trim: true }, [
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
