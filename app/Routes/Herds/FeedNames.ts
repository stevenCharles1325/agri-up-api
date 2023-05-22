import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedNamesController.index");

  Route.post("/:herdType", "FeedNamesController.store");
  //   Route.delete("/:breedId", "HerdGroupsController.destroy");
})
  .prefix("/feeds/names")
  .namespace("App/Domains/Herds/Controllers");
