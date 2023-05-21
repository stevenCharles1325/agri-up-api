import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MilkInventory from '../Models/MilkInventory'
import MilkAdditionCreateValidator from '../Validators/MilkAdditionCreateValidator'
import MilkAddition from '../Models/MilkAddition'
import MilkReductionCreateValidator from '../Validators/MilkReductionCreateValidator'
import MilkReduction from '../Models/MilkReduction'
import Expense from 'App/Domains/Expenses/Models/Expense'

export default class MilkInventoriesController {
  public async index ({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user

    if (!user) return response.unauthorized('Unauthorized')

    try {
      const milkInventory = await MilkInventory
        .query()
        .where('ownerId', user.id)
        .orderBy('createdAt', 'desc')

      return response.ok(milkInventory)
    } catch (err) {
      console.log(err)

      return response.internalServerError('Please try again')
    }
  }

  public async addMilk ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { herdType } = params
    const payload = await request.validate(MilkAdditionCreateValidator)

    if (!user) return response.unauthorized('Unauthorized')

    const milk = await MilkInventory.query().where('ownerId', user.id).first()
    
    if (!milk) {
      try {
        const createdMilk = await MilkInventory.create({
          ownerId: user.id,
          quantity: payload.quantity,
          herdType,
        })
  
        await MilkAddition.create({
          ...payload,
          milkId: createdMilk.id,
          ownerId: user.id,
        })
  
        return response.ok('Successfully Added Milk')
      } catch (err) {
        console.log(err)

        return response.internalServerError('Please try again')
      }
    } else {
      try {
        await MilkAddition.create({
          ...payload,
          milkId: milk.id,
          ownerId: user.id,
        })
  
        return response.ok('Successfully Added Milk')
      } catch (err) {
        console.log(err)

        return response.internalServerError('Please try again')
      }
    }
  }

  public async reduce ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const payload = await request.validate(MilkReductionCreateValidator)

    if (!user) return response.unauthorized('Unauthorized')
    const milk = await MilkInventory.query().where('ownerId', user.id).first()

    if (!milk) return response.badRequest('Cannot Reduce Non-Existing Milk')

    await MilkReduction.create({
      ...payload,
      milkId: milk.id,
      ownerId: user.id,
      herdType: milk.herdType,
    })

    if (payload.reason === 'sold') {
      await Expense.create({
        ownerId: user.id,
        date: payload.date,
        notes: payload.notes,
        amount: payload.totalAmount,
        type: 'others',
      })
    }

    return response.ok('Successfully Added Milk')
  }
}
