import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "PurposesController.index");

  Route.post("/:herdType", "PurposesController.store");
  Route.delete("/:purposeId", "PurposesController.destroy");

  Route.put("/:id/:herdType", "PurposesController.update");
})
  .prefix("/herd/purposes")
  .namespace("App/Domains/Herds/Controllers");
