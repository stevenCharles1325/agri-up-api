import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Purpose from '../Models/Purpose'
import PurposeCreateValidator from '../Validators/PurposeCreateValidator'

export default class PurposesController {
  public async index ({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user
    if (!user) return response.unauthorized('Unauthorized')

    return await Purpose.query().where({ ownerId: user.id })
  }

  public async store ({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.user
    const payload = await request.validate(PurposeCreateValidator)

    try {
      if (!user) return response.unauthorized('Unauthorized')

      await Purpose.create({
        ...payload,
        ownerId: user.id,
      })
      return response.created('Successfully Created New Purpose')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }

  public async delete ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { purposeId } = params
    
    try {
      const purpose = await Purpose.findOrFail(purposeId)
      purpose.delete()

      return response.created('Successfully Deleted Purpose')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }
}
