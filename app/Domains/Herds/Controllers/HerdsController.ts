import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Herd from '../Models/Herd'
import HerdCreateValidator from '../Validators/HerdCreateValidator'
import HerdUpdateValidator from '../Validators/HerdUpdateValidator'

export default class HerdsController {
  public async index ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user
    if (!user) return response.unauthorized('Unauthorized')

    const {
      group = 0,
      type = 'swine', 
      stage,
      gender,
      remark,
    } = request.all()

    const herdQuery = Herd
      .query()
      .where({ type })
      .where({ ownerId: user.id })
    
    if (group) herdQuery.has('group')
    if (stage) herdQuery.where('stage', stage)
    if (gender) herdQuery.where('gender',gender)
    if (remark) herdQuery.where('remark',remark)

    return await herdQuery 
  }

  public async store ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { herdType } = params
    const user = auth.user
    const payload = await request.validate(HerdCreateValidator)

    try {
      if (!user) return response.unauthorized('Unauthorized')
      if (!herdType) return response.badRequest('Invalid Herd Type')

      payload.ownerId = user.id
      payload.type = herdType

      await Herd.create(payload)

      return response.created('Successfully Created New Herd')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }

  public async edit ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { herdId } = params 
    const payload = await request.validate(HerdUpdateValidator)

    try {
      const herd = await Herd.findOrFail(herdId)
      herd.merge(payload)

      await herd.save()
      return response.ok('Successfully Updated Herd')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }
  
  public async delete ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { herdId } = params

    const herd = await Herd.findOrFail(herdId)
    herd.delete()
    
    return response.ok('Successfully Deleted Herd')
  }
}
