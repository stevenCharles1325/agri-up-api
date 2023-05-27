import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.put("/:herdType/:id", "MarkAsController.update");
  Route.get("/:herdType/:id", "MarkAsController.checkIfExist");
})
  .prefix("/mark-as")
  .namespace("App/Domains/Herds/Controllers");
