import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Domains/Users/Models/User'
import UserCreateValidator from 'App/Domains/Users/Validators/UserCreateValidator'

export default class AuthenticationController {
  public async verification({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user

    if (user) {
      return response.ok('Authorized')
    } else {
      return response.unauthorized('Unauthorized')
    }
  }

  public async refreshToken({ auth, request, response }: HttpContextContract) {
    const { refreshToken } = request.all()

    if (refreshToken) {
      try {
        const token = await auth.use("jwt").loginViaRefreshToken(refreshToken);
        return token
      } catch (err) {
        console.log(err)

        if (err.code) return response.internalServerError(err.code)

        return response.internalServerError(err)
      }
    }

    return response.badRequest('Refresh token is required')
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { username, password } = request.all()

    if (username && password) {
      try {
        const token = await auth.use('jwt').attempt(username, password)
        return token
      } catch (err) {
        console.log(err)

        if (err.code === 'E_INVALID_AUTH_PASSWORD' || err.code === 'E_INVALID_AUTH_UID') 
          return response.unauthorized("Incorrect email or password")

        return response.internalServerError(err)
      }
    }

    return response.badRequest('Username and password are required')
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(UserCreateValidator)

    try {
      const user = await User.create(payload)
      const token = await auth.use('jwt').generate(user)
      
      return token
    } catch (err) {
      console.log(err)

      if (err.code) return response.internalServerError(err.code)

      return response.internalServerError(err)
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('jwt').revoke()
      return response.ok('Successfully logged out')
    } catch (err) {
      console.log(err)

      if (err.code) return response.internalServerError(err.code)

      return response.internalServerError(err)
    }
  }
}
