import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventTypeUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [ rules.minLength(2) ]),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters.',
  }
}
