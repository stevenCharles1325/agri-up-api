import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CalendarsControllers.index')
  Route.get('/:calendarEventId', 'CalendarsControllers.show')

  Route.post('/', 'CalendarsControllers.store')
  Route.put('/:calendarEventId', 'CalendarsControllers.markAsDone')
  Route.put('/:calendarEventId', 'CalendarsControllers.update')
  Route.delete('/:calendarEventId', 'CalendarsControllers.destroy')
})
.prefix('/calendar')
.namespace('App/Domains/Calendars/Controllers')
