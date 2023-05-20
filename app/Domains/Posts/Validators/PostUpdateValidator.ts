import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({ trim: true }, [
      rules.minLength(5),
    ]),
    content: schema.string.optional({ trim: true }, [
      rules.minLength(1),
    ]),
    category: schema.enum.optional([
      'general',
      'cattle',
      'goat',
      'swine',
    ] as const),
  })

  public messages: CustomMessages = {
    minLength: '{{ field }} must be at least {{ options.minLength }} characters',
    enum: '{{ field }} must be one of the following: {{ options.choices }}'
  }
}
