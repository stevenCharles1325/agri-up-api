import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "HerdGroupsController.index");

  Route.post("/:herdType", "HerdGroupsController.store");
  Route.delete("/:herdGroupId", "HerdGroupsController.destroy");

  Route.put("/:id/:herdType", "HerdGroupsController.update");
})
  .prefix("/herd/groups")
  .namespace("App/Domains/Herds/Controllers");
