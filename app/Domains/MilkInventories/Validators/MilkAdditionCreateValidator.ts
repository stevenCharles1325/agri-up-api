import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MilkAdditionCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    quantity: schema.number([
      rules.range(1, 10000000000000),
    ]),
    date: schema.date(),
    notes: schema.string.optional({ trim: true }, [
      rules.minLength(5),
    ]),
  })

  public messages: CustomMessages = {
    range: '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
    minLength: '{{ field }} must be at least {{ options.minLenth }}',
  }
}
