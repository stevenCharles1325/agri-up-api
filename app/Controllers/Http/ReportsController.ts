import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'
import { IHistoryOption } from 'App/Interfaces/IHistoryOption'
import ExpenseReporter from 'App/Modules/Reporter/ExpenseReporter'
import IncomeReporter from 'App/Modules/Reporter/IncomeReporter'
import HerdSalesReporter from 'App/Modules/Reporter/HerdReporter'
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

      const incomeHistory = await IncomeReporter.history(cleansedDateFilter)
      const incomeTotal = await IncomeReporter.total(cleansedDateFilter)
      const incomeSale = await IncomeReporter.sale(cleansedDateFilter)
  
      const expenseHistory = await ExpenseReporter.history(cleansedDateFilter)
      const expenseTotal = await ExpenseReporter.total(cleansedDateFilter)
      const expenseSale = await ExpenseReporter.sale(cleansedDateFilter)
  
      const income = {
        history: incomeHistory,
        total: incomeTotal,
        sale: incomeSale,
      }
  
      const expense = {
        history: expenseHistory,
        total: expenseTotal,
        sale: expenseSale,
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
      const stage = await HerdReporter.byStage(cleansedDateFilter, herdType)
      const gender = await HerdReporter.byGender(cleansedDateFilter, herdType)
      const status = await HerdReporter.byStatus(cleansedDateFilter, herdType)
      
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
      const stocks = await MilkReporter.stocks(cleansedDateFilter, herdType)
      const amountOfMilkSold = await MilkReporter.amountOfMilkSold(cleansedDateFilter, herdType)
      // const status = await MilkReporter.byStatus(cleansedDateFilter, herdType)
      
      return response.ok({
        stocks,
        amountOfMilkSold,
        // status,
      })
    } catch (err) {
      console.log(err)
      return response.internalServerError(err?.code ?? err)
    }
  }
}
