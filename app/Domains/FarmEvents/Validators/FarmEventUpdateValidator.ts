import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FarmEventUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    description: schema.string.optional({}, [ rules.minLength(5) ]),
    others: schema.string.optional({}),
    startAt: schema.date(),
    endAt: schema.date(),
  })


  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters.',
  }
}
