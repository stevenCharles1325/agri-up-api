import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FarmEvent from '../Models/FarmEvent'
import FarmEventCreateValidator from '../Validators/FarmEventCreateValidator'
import FarmEventUpdateValidator from '../Validators/FarmEventUpdateValidator'

export default class FarmEventsController {
  public async index({ response }: HttpContextContract) {
    const farmEvents = await FarmEvent.query().orderBy('start_at')

    return response.ok(farmEvents)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const payload = await request.validate(FarmEventCreateValidator)

    try {
      await FarmEvent.create(payload)
      return response.created('Successfully created an Event')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError(err)
    }
  }

  public async show({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    const { farmEventId } = request.all()
    if (!farmEventId.length) return response.badRequest('Farm-event ID is missing')

    const farmEvent = await FarmEvent.findOrFail(farmEventId)
    return response.ok(farmEvent)
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

  public async destroy({}: HttpContextContract) {}
}
