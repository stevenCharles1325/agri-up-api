import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'EventTypesController.index')
  // Route.get('/:eventTypeId', 'EventTypesController.show')

  Route.post('/', 'EventTypesController.store')
  Route.put('/:eventTypeId', 'EventTypesController.update')
  Route.delete('/:eventTypeId', 'EventTypesController.destroy')
})
.prefix('/event-types')
.namespace('App/Domains/FarmEvents/Controllers')
