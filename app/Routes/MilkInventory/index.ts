import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "MilkInventoriesController.index");
  Route.put("/", "MilkInventoriesController.reduce");
  Route.get("/additions", "MilkInventoriesController.milkAdditions");
  Route.get("/reductions", "MilkInventoriesController.milkReductions");
  Route.post("/:herdType", "MilkInventoriesController.addMilk");
})
  .prefix("/milks")
  .namespace("App/Domains/MilkInventories/Controllers");
