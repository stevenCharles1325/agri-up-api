import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Expense from '../Models/Expense'
import CreateExpenseValidator from '../Validators/CreateExpenseValidator'
import UpdateExpenseValidator from '../Validators/UpdateExpenseValidator'

export default class ExpensesController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { notes, amountOrder = 'asc' } = request.all()

    const expenses = await Expense.query()
      .where('notes', 'LIKE', `%${notes}%`)
      .orderBy('amount', amountOrder)

    return response.ok(expenses)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    const payload = await request.validate(CreateExpenseValidator)
    await Expense.create(payload)

    return response.created('Successfully Created New Expense')
  }

  public async show({ auth, params }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { expenseId } = params

    return await Expense.findOrFail(expenseId)
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { expenseId } = params

    const payload = await request.validate(UpdateExpenseValidator)
    const expense = await Expense.findOrFail(expenseId)
    
    try {
      expense.merge(payload)
      await expense.save()

      return response.ok('Successfully Updated')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again later')
    }
  }


  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { expenseId } = params

    const expense = await Expense.findOrFail(expenseId)
    try {
      await expense.delete()

      return response.ok('Successfully Deleted')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again later')
    }
  }
}
