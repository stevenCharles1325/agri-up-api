import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FarmEvent from '../Models/FarmEvent'
import FarmEventCreateValidator from '../Validators/FarmEventCreateValidator'
import FarmEventUpdateValidator from '../Validators/FarmEventUpdateValidator'
import Expense from 'App/Domains/Expenses/Models/Expense'

export default class FarmEventsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { 
      order = 'asc', 
      timeFrame, 
      category, 
      eventType, 
      herdType, 
      herdTag 
    } = request.all()

    if (!user) return response.unauthorized('Unauthorized')

    const farmEventsQuery = FarmEvent
      .query()
      .where({ ownerId: user.id })

    if (herdTag) farmEventsQuery.where({ herdTag })
    if (herdType) farmEventsQuery.where({ herdType })
    if (eventType) farmEventsQuery.where({ eventType })
    if (category) farmEventsQuery.where({ category })

    switch (timeFrame) {
      case 'past-events':
        farmEventsQuery.whereRaw(`DATE(start_at) < DATE(NOW())`)
        break;
        
      case 'current-events':
        farmEventsQuery.whereRaw(`DATE(start_at) = DATE(NOW())`)
        break;

      case 'future-events':
        farmEventsQuery.whereRaw(`DATE(start_at) > DATE(NOW())`)
        break;

      default:
        farmEventsQuery.whereRaw(`DATE(start_at) = DATE(NOW())`)
        break;
    }

    const farmEvents = await farmEventsQuery.orderBy('start_at', order)
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
    const user = auth.use('jwt').user
    const payload = await request.validate(FarmEventCreateValidator)

    try {
      if (!user) return response.unauthorized('Unauthorized')

      await FarmEvent.create({
        ...payload,
        ownerId: user.id
      })

      if (payload.others?.length) {
        const others = JSON.parse(payload.others);

        if (others.expenses?.length) {
          console.log(others);
          const expense = {
            ownerId: user.id,
            type: "Others",
            herds_type: payload.herdType,
            tag: payload.herdTag,
            amount: Number(others?.expenses ?? "0") ?? 0,
            notes: others?.diagnosis ?? "",
          }

          await Expense.create(expense);
        }
      }

      return response.created('Successfully created an Event')
    } catch (err) {
      console.log(err)

      if (err.code) return response.internalServerError(err.code)

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

      if (err.code) return response.internalServerError(err.code)

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

      if (err.code) return response.internalServerError(err.code)

      return response.internalServerError('Please try again')
    }
  }
}
