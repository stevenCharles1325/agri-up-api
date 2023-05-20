import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/me', 'UsersController.me')

  Route.get('/:userId', 'UsersController.show')
  Route.put('/:userId', 'UsersController.update')
})
.prefix('/users')
.namespace('App/Domains/Users/Controllers')
