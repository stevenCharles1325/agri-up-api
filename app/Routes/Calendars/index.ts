import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CalendarsControllers.index')
  Route.get('/:calendarEventId', 'CalendarsControllers.show')
  Route.put('/mark-as-done/:calendarEventId', 'CalendarsControllers.markAsDone')

  Route.post('/', 'CalendarsControllers.store')
  Route.put('/:calendarEventId', 'CalendarsControllers.update')
  Route.delete('/:calendarEventId', 'CalendarsControllers.destroy')
})
.prefix('/calendars')
.namespace('App/Domains/Calendars/Controllers')
