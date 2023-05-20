import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'PurposesController.index')

  Route.post('/:herdType', 'PurposesController.store')
  Route.delete('/:purposeId', 'PurposesController.destroy')
  
  // Route.get('/:breedId', 'HerdsController.show')
})
.prefix('/herd/purposes')
.namespace('App/Domains/Herds/Controllers')
