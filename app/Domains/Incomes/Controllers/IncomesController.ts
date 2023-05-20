import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Income from '../Models/Income'
import CreateIncomeValidator from '../Validators/CreateIncomeValidator'
import UpdateIncomeValidator from '../Validators/UpdateIncomeValidator'

export default class IncomesController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { searchText } = request.all()

    const incomes = await Income.query()
      .where('notes', 'LIKE', `%${searchText}%`)
      .orderBy('amount', 'asc')

    return response.ok(incomes)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    const payload = await request.validate(CreateIncomeValidator)
    const _payload = {
      type: payload.type,
      date: payload.date,
      amount: payload.amount,
      notes: payload.notes,
    }
    
    if (payload.swineTag) {
      _payload['others'] = {
        swineTag: payload.swineTag,
      }
    } else if (payload.meatType) {
      _payload['others'] = {
        meatType: payload.meatType,
      }
    } else if (payload.milkType) {
      _payload['others'] = {
        meatType: payload.milkType,
      }
    }

    await Income.create(_payload)
    return response.created('Successfully Created New Income')
  }

  public async show({ auth, params }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { incomeId } = params

    return await Income.findOrFail(incomeId)
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { incomeId } = params

    const payload = await request.validate(UpdateIncomeValidator)
    const _payload = {
      type: payload.type,
      date: payload.date,
      amount: payload.amount,
      notes: payload.notes,
    }
    
    if (payload.swineTag) {
      _payload['others'] = {
        swineTag: payload.swineTag,
      }
    } else if (payload.meatType) {
      _payload['others'] = {
        meatType: payload.meatType,
      }
    } else if (payload.milkType) {
      _payload['others'] = {
        meatType: payload.milkType,
      }
    }

    const income = await Income.findOrFail(incomeId)
    
    try {
      income.merge(_payload)
      await income.save()

      return response.ok('Successfully Updated')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again later')
    }
  }


  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { incomeId } = params

    const income = await Income.findOrFail(incomeId)
    try {
      await income.delete()

      return response.ok('Successfully Deleted')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again later')
    }
  }
}
