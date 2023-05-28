import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "IncomesController.index");
  Route.get("/:incomeId", "IncomesController.show");

  Route.post("/", "IncomesController.store");
  Route.put("/:incomeId", "IncomesController.update");
  Route.delete("/:incomeId/:actionType", "IncomesController.destroy");
})
  .prefix("/incomes")
  .namespace("App/Domains/Incomes/Controllers");
