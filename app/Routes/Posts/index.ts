import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'PostsController.index')
  Route.get('/:postId', 'PostsController.show')
  
  Route.post('/', 'PostsController.store')
  Route.put('/:postId', 'PostsController.update')
  Route.delete('/:postId', 'PostsController.destroy')

  Route.put('/like/:postId', 'PostsController.like')
  Route.post('/reply/:postId', 'PostsController.reply')
  Route.post('/hide/:postId', 'PostsController.hidePost')
})
.prefix('/posts')
.namespace('App/Domains/Posts/Controllers')