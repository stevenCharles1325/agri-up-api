import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/overall-transactions', 'ReportsController.overallTransactions')
  Route.get('/herds/:herdType', 'ReportsController.herdReports')
  Route.get('/herds/milks/:herdType', 'ReportsController.milkReports')
})
.prefix('/reports')
.namespace('App/Controllers/Http')