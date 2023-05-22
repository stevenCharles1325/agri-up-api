import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "HerdGroupsController.index");

  Route.post("/:herdType", "HerdGroupsController.store");
  Route.delete("/:breedId", "HerdGroupsController.destroy");

  // Route.get('/:breedId', 'HerdGroupsController.show')
  // Route.put('/:breedId', 'HerdGroupsController.update')
})
  .prefix("/herd/groups")
  .namespace("App/Domains/Herds/Controllers");
