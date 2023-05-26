import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  //addition
  Route.get("/:herdType/:type", "MilkInventoriesController.index");
  Route.post("/:herdType/:type", "MilkInventoriesController.store");

  Route.delete("/:id/:type/:actionType", "MilkInventoriesController.destroy");
  Route.put("/:id/:type/:actionType", "MilkInventoriesController.update");

  // Route.get("/", "MilkInventoriesController.index");
  // Route.get("/additions", "MilkInventoriesController.milkAdditions");
  // Route.get("/reductions", "MilkInventoriesController.milkReductions");
})
  .prefix("/milks")
  .namespace("App/Domains/MilkInventories/Controllers");

//addition show
Route.group(() => {
  Route.get("/:id", "MilkInventoriesController.showAdditions");
})
  .prefix("/milk-additions")
  .namespace("App/Domains/MilkInventories/Controllers");
