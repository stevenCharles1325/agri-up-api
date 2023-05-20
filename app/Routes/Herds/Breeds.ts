import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BreedsController.index')
  
  Route.post('/:herdType', 'BreedsController.store')
  Route.delete('/:breedId', 'BreedsController.destroy')
  
  // Route.get('/:breedId', 'BreedsController.show')
  // Route.put('/:breedId', 'BreedsController.update')
})
.prefix('/breeds')
.namespace('App/Domains/Herds/Controllers')
