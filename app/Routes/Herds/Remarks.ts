import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'RemarksController.store')
  Route.delete('/:herdId', 'RemarksController.destroy')
  
  // Route.get('/', 'PurposesController.index')
  // Route.get('/:breedId', 'HerdsController.show')
})
.prefix('/herd/purposes')
.namespace('App/Domains/Herds/Controllers')
