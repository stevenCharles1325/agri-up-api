import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FeedRecordCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    feedNameId: schema.number([
      rules.exists({ table: 'feed_names', column: 'name' })
    ]),
    date: schema.date(),
    quantity: schema.number([ rules.range(1, 10000000000000) ]),
    consumedBy: schema.enum(['individual', 'group'] as const),
    consumer: schema.string({ trim: true }, [
      rules.minLength(1),
    ]),
    notes: schema.string.optional({ trim: true }, [
      rules.minLength(5),
    ])
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    range: '{{ field }} must be between {{ options.start }} and {{ options.stop }}',
    'enum': '{{ field }} must be any of the following values: {{ options.choices }}',
  }
}
