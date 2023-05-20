import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Herd from '../Models/Herd'
import RemarkCreateValidator from '../Validators/RemarkCreateValidator'
import Remark from '../Models/Remark'

export default class RemarksController {
  // public async index ({ auth, request, response }: HttpContextContract) {}

  public async store ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { herdId } = params

    if (!user) return response.unauthorized('Unauthorized')

    const payload = await request.validate(RemarkCreateValidator)
    const herd = await Herd.findOrFail(herdId)
    // const herd = await Herd.query().where({ id: herdId }).first()

    try {
      await herd
        .related('remark')
        .create({
          ...payload,
          ownerId: user.id,
        })
      return response.created('Successfully Remarked A Herd')
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

    try {
      await herd.related('remark')
      const remarkId = herd.remark.id

      const remark = await Remark.findOrFail(remarkId)
      remark.delete()

      return response.created('Successfully Remarked A Herd')
    } catch (err) {
      console.log(err)

      if (err.code) return err.code

      return response.internalServerError('Please try again')
    }
  }
}
