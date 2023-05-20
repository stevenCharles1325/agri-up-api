import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostCreateValidator from '../Validators/PostCreateValidator'
import Post from '../Models/Post'
import ReplyCreateValidator from '../Validators/ReplyCreateValidator'
import PostUpdateValidator from '../Validators/PostUpdateValidator'
import ReplyUpdateValidator from '../Validators/ReplyUpdateValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Like from '../Models/Like'
import HidPost from '../Models/HidPost'

export default class ChatsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { page = 1, limit = 10 } = request.all()

    if (!user) return response.unauthorized('Unauthorized')

    try {
      const hidPosts = await HidPost.query().where('userId', user.id)
      const hidPostIds = hidPosts.map((post) => post.id)
  
      const posts = await Post
        .query()
        .whereNotIn('id', hidPostIds)
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)
  
      console.log(posts)
      return response.ok(posts)
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async hidePost({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { postId } = params

    if (!user) return response.unauthorized('Unauthorized')
    try {
      await HidPost.create({
        postId,
        userId: user.id,
      })

      return response.ok("Successfully Hide A Post")
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async like({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const { postId } = params

    if (!user) return response.unauthorized('Unauthorized')
    try {
      const userLike = await Like
        .query()
        .where('ownerId', user.id)
        .where('postId', postId)
        .firstOrFail()

      if (userLike) {
        await userLike.delete()
        return response.ok('Successfully Unlike');
      } else {
        await Like.create({
          postId,
          ownerId: user.id,
        })

        return response.ok('Successfully Like')
      }
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const user = auth.use('jwt').user
    const payload = await request.validate(PostCreateValidator)

    if (!user) return response.unauthorized('Unauthorized')
    try {
      await Post.create({
        ...payload,
        ownerId: user.id,
        type: 'post',
      })
      return response.ok('Successfully Created A Post')
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async reply({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { postId } = params
    const user = auth.use('jwt').user
    const payload = await request.validate(ReplyCreateValidator)

    if (!user) return response.unauthorized('Unauthorized')
    try {
      const post = await Post.findOrFail(postId)
      await post.load('repliedTo')
      
      if (post.repliedTo) {
        await post.repliedTo
          .related('replies')
          .create({
            ...payload,
            type: 'reply',
            ownerId: user.id,
          })
      } else {
        await post
          .related('replies')
          .create({
            ...payload,
            type: 'reply',
            ownerId: user.id,
          })
      }

      return response.ok('Successfully Created A Reply')
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { postId } = params
  
    const post = await Post.findOrFail(postId)
    return response.ok(post)
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { postId } = params
    const post = await Post.findOrFail(postId)
    const payload = await request.validate(
      postId.type === 'post'
        ? PostUpdateValidator
        : ReplyUpdateValidator
      )

    post.merge(payload)
    
    try {
      await post.save()
      return response.ok(`Successfully Updated A ${string.capitalCase(post.type)}`)
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again!')
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { postId } = params

    const post = await Post.findOrFail(postId)
    try {
      await post.delete()
      return response.ok('Successfully Deleted') 
    } catch (err) {
      console.log(err)
      return response.internalServerError(err.code)
    }
  }
}
