import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'
import { IHistoryOption } from 'App/Interfaces/IHistoryOption'
import ExpenseReporter from 'App/Modules/Reporter/ExpenseReporter'
import IncomeReporter from 'App/Modules/Reporter/IncomeReporter'
import HerdReporter from 'App/Modules/Reporter/HerdReporter'
import MilkReporter from 'App/Modules/Reporter/MilkReporter'

export default class ReportsController {
  public async overallTransactions ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { dateFilter = '' } = request.all()
    
    if (!user) return response.unauthorized('Unauthorized')
    
    const cleansedDateFilter = string.dashCase(
        string.condenseWhitespace(
          dateFilter
        )
      ) as IHistoryOption
          
    try {

      const incomeHistory = await IncomeReporter.history(user?.id, cleansedDateFilter)
      const incomeTotal = await IncomeReporter.total(user?.id, cleansedDateFilter)
      const incomeSale = await IncomeReporter.sale(user?.id, cleansedDateFilter)
  
      const expenseHistory = await ExpenseReporter.history(user?.id, cleansedDateFilter)
      const expenseTotal = await ExpenseReporter.total(user?.id, cleansedDateFilter)
      const expenseType = await ExpenseReporter.type(user?.id, cleansedDateFilter)
  
      const income = {
        history: incomeHistory,
        total: incomeTotal,
        sale: incomeSale,
      }
  
      const expense = {
        history: expenseHistory,
        total: expenseTotal,
        type: expenseType,
      }
  
      return response.ok({
        income,
        expense,
      })
    } catch (err) {
      console.log(err)
      return response.internalServerError(err?.code ?? err)
    }
  }

  public async herdReports ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { dateFilter = '' } = request.all()
    const { herdType } = params

    if (!user) return response.unauthorized('Unauthorized')
    
    const cleansedDateFilter = string.dashCase(
        string.condenseWhitespace(
          dateFilter
        )
      ) as IHistoryOption
          
    try {
      const stage = await HerdReporter.byStage(user?.id, cleansedDateFilter, herdType)
      const gender = await HerdReporter.byGender(user?.id, cleansedDateFilter, herdType)
      const status = await HerdReporter.byStatus(user?.id, cleansedDateFilter, herdType)
      
      return response.ok({
        stage,
        gender,
        status,
      })
    } catch (err) {
      console.log(err)
      return response.internalServerError(err?.code ?? err)
    }
  }

  public async milkReports ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { dateFilter = '' } = request.all()
    const { herdType } = params

    if (!user) return response.unauthorized('Unauthorized')
    if (herdType.toLowerCase() === 'swine') 
      return response.badRequest('Swine does not have milk-reports')
    
    const cleansedDateFilter = string.dashCase(
        string.condenseWhitespace(
          dateFilter
        )
      ) as IHistoryOption
          
    try {
      const stocks = await MilkReporter.stocks(user?.id, cleansedDateFilter, herdType)
      const amountOfMilkSold = await MilkReporter.amountOfMilkSold(user?.id, cleansedDateFilter, herdType)
      const reduction = await MilkReporter.reductions(user?.id, cleansedDateFilter)
      
      return response.ok({
        stocks,
        amountOfMilkSold,
        reduction,
      })
    } catch (err) {
      console.log(err)
      return response.internalServerError(err?.code ?? err)
    }
  }
}
