import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FeedUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    feedNameId: schema.number.optional([
      rules.exists({ table: 'feed_names', column: 'name' })
    ]),
    source: schema.enum.optional([
      'bought',
      'gift',
      'recycled',
      'others',
    ] as const),
    date: schema.date.optional(),
    quantity: schema.number.optional([ rules.range(1, 10000000000000) ]),
    totalAmount: schema.number.optional([ rules.range(1, 10000000000000) ]),
    notes: schema.string.optional([
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