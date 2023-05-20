import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'FarmEventsController.index')
  Route.get('/:farmEventId', 'FarmEventsController.show')

  Route.post('/', 'FarmEventsController.store')
  Route.put('/:farmEventId', 'FarmEventsController.update')
  Route.delete('/:farmEventId', 'FarmEventsController.destroy')
})
.prefix('/farm-events')
.namespace('App/Domains/Expenses/Controllers')
