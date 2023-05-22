import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'MilkInventoriesController.index')
  Route.put('/', 'MilkInventoriesController.reduce')
  Route.post('/:herdType', 'MilkInventoriesController.addMilk')
})
.prefix('/milks')
.namespace('App/Domains/MilkInventories/Controllers')