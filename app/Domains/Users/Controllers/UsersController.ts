import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../Models/User'
import UserUpdateValidator from '../Validators/UserUpdateValidator'

export default class UsersController {
  public async me({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const id = auth.use('jwt').user?.id

    if (!id) return response.unauthorized('Unauthorized')

    try {
      const userQuery = User.query().where({ id })
      const cattleCount = await userQuery.withCount('herds').where('herds.type', '=', 'cattle')
      const swineCount = await userQuery.withCount('herds').where('herds.type', '=', 'swine')
      const goatCount = await userQuery.withCount('herds').where('herds.type', '=', 'goat')

      // To Add: Community Posts
      const user = await userQuery.firstOrFail()
      user.cattleCount = cattleCount[0].$extras.herds_count
      user.swineCount = swineCount[0].$extras.herds_count
      user.goatCount = goatCount[0].$extras.herds_count

      return response.ok(user)
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code);
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { id } = params
    const user = await User.findOrFail(id)

    return response.ok(user)
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const payload = await request.validate(UserUpdateValidator)
    const id = auth.use('jwt').user?.id
    
    if (!id) return response.unauthorized('Unauthorized')

    const user = await User.findOrFail(id)
    user.merge(payload)

    try {
      await user.save()
      return response.ok('Successfully Updated Profile')
    } catch (err) {
      console.log(err)

      return response.internalServerError(err.code)
    }
  }
}
