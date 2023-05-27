import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Calendar from '../Models/Calendar'
import CalendarUpdateValidator from '../Validators/CalendarUpdateValidator'
import CalendarCreateValidator from '../Validators/CalendarCreateValidator'
import { DateTime } from 'luxon'

export default class CalendarsController {
  public async index ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { 
      startDate, 
      endDate 
    } = request.all()

    if (!user) return response.unauthorized('Unauthorized')

    try {
      return await Calendar.query()
        .where({ ownerId: user.id })
        .if(
          startDate && endDate,
          (passQuery) => {
            passQuery
              .whereBetween('remind_at', [startDate, endDate])
              .orWhereBetween('created_at', [startDate, endDate])
          }
        )
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  } 

  public async show ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { calendarEventId } = params

    try {
      return await Calendar.findOrFail(calendarEventId)
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }

  public async store ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const payload = await request.validate(CalendarCreateValidator)

    if (!user) return response.unauthorized('Unauthorized')
    try {
      await Calendar.create({
        ...payload,
        ownerId: user.id,
      })
      return response.ok('Successfully Created Calendar Event')
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }

  public async update ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { calendarEventId } = params
    const payload = await request.validate(CalendarUpdateValidator)
    const calendar = await Calendar.findOrFail(calendarEventId)
    calendar.merge(payload)

    try {
      await calendar.save()
      return response.ok('Successfully Updated Calendar Event')
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }

  public async markAsDone ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { calendarEventId } = params

    const calendar = await Calendar.findOrFail(calendarEventId)
    calendar.status = 'done'

    try {
      await calendar.save()
      return response.ok('Successfully Updated Calendar Event')
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }

  public async destroy ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { calendarEventId } = params

    const calendar = await Calendar.findOrFail(calendarEventId)
    try {
      await calendar.delete()
      return response.ok('Successfully Deleted Calendar Event')
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }
}
