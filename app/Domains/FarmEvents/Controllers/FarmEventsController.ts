import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FarmEvent from '../Models/FarmEvent'
import FarmEventCreateValidator from '../Validators/FarmEventCreateValidator'
import FarmEventUpdateValidator from '../Validators/FarmEventUpdateValidator'

export default class FarmEventsController {
  public async index({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user

    if (!user) return response.unauthorized('Unauthorized')

    const farmEvents = await FarmEvent
      .query()
      .where({ ownerId: user.id })
      .orderBy('start_at')

    return response.ok(farmEvents)
  }

  public async show({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    const { farmEventId } = request.all()
    if (!farmEventId) return response.badRequest('Farm-event ID is missing')

    const farmEvent = await FarmEvent.findOrFail(farmEventId)
    return response.ok(farmEvent)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user
    const payload = await request.validate(FarmEventCreateValidator)

    try {
      if (!user) return response.unauthorized('Unauthorized')

      payload.ownerId = user.id
      await FarmEvent.create(payload)
      return response.created('Successfully created an Event')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError(err)
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    
    const payload = await request.validate(FarmEventUpdateValidator)
    const { farmEventId } = request.all()

    if (!farmEventId.length) return response.badRequest('Farm-event ID is missing')
    const farmEvent = await FarmEvent.findOrFail(farmEventId)

    try {
      farmEvent.merge(payload)
      await farmEvent.save()
      
      return response.ok('Successfully Updated Farm-Event')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError(err)
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { farmEventId } = params

    if (!farmEventId) return response.badRequest('Farm-event ID is missing')

    const farmEvent = await FarmEvent.findOrFail(farmEventId)

    try {
      await farmEvent.delete()
      return response.ok('Successfully Deleted Farm-Event')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }
}
