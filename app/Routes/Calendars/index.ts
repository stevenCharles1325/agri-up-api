import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CalendarsController.index')
  Route.get('/:calendarEventId', 'CalendarsController.show')
  Route.put('/mark-as-done/:calendarEventId', 'CalendarsController.markAsDone')

  Route.post('/', 'CalendarsController.store')
  Route.put('/:calendarEventId', 'CalendarsController.update')
  Route.delete('/:calendarEventId', 'CalendarsController.destroy')
})
.prefix('/calendars')
.namespace('App/Domains/Calendars/Controllers')
