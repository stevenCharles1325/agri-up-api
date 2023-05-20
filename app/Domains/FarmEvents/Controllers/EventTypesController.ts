import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventType from '../Models/EventType'
import EventTypeCreateValidator from '../Validators/EventTypeCreateValidator'
import EventTypeUpdateValidator from '../Validators/EventTypeUpdateValidator'

export default class EventTypesController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { category = 'individual' } = request.all()
    const user = auth.user
    
    if (!user) return response.unauthorized('Unauthorized')

    const eventTypes = await EventType
      .query()
      .where({
        ownerId: user.id,
        category,
      })
      .orderBy('start_at')

    return response.ok(eventTypes)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user
    const payload = await request.validate(EventTypeCreateValidator)

    try {
      if (!user) return response.unauthorized('Unauthorized')

      payload.ownerId = user.id
      await EventType.create(payload)
      return response.created('Successfully Created An Event-type')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError(err)
    }
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    
    const payload = await request.validate(EventTypeUpdateValidator)
    const { eventTypeId } = params

    if (!eventTypeId) return response.badRequest('Farm-event ID is missing')
    const eventType = await EventType.findOrFail(eventTypeId)

    try {
      eventType.merge(payload)
      await eventType.save()
      
      return response.ok('Successfully Updated Event-type')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError(err)
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { eventTypeId } = params

    if (!eventTypeId) return response.badRequest('Farm-event ID is missing')

    const eventType = await EventType.findOrFail(eventTypeId)

    try {
      await eventType.delete()
      return response.ok('Successfully Deleted Event-type')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }
}
