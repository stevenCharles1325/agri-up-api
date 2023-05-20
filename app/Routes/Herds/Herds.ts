import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'HerdsController.index')

  Route.post('/:herdType', 'HerdsController.store')
  Route.put('/:herdId', 'HerdsController.update')
  Route.delete('/:herdId', 'HerdsController.destroy')
  
  // Route.get('/:breedId', 'HerdsController.show')
})
.prefix('/herds')
.namespace('App/Domains/Herds/Controllers')
