import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Herd from '../Models/Herd'

export default class HerdsController {
  public async index ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { 
      all = 1,
      group = 0,
      type = 'swine', 
      stage,
      gender,
      remark,
    } = params

    const herdQuery = Herd.query().where({ type })
    
    if (group) {
      herdQuery.has('group')
    }
    return await 
  }

}
