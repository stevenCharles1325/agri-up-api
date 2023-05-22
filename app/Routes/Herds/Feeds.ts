import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedsController.index");
  Route.get("/current-stocks", "FeedsController.currentStocks");
  Route.post("/:herdType", "FeedsController.add");
  //   Route.delete("/:breedId", "HerdGroupsController.destroy");
})
  .prefix("/feeds")
  .namespace("App/Domains/Herds/Controllers");
