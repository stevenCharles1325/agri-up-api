import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "ExpensesController.index");
  Route.get("/:expenseId", "ExpensesController.show");

  Route.post("/", "ExpensesController.store");
  Route.put("/:expenseId", "ExpensesController.update");
  Route.delete("/:expenseId", "ExpensesController.destroy");
})
  .prefix("/expenses")
  .namespace("App/Domains/Expenses/Controllers");
