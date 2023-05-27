import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "HerdsController.index");

  Route.get("/:herdId", "HerdsController.show");
  Route.post("/:herdType", "HerdsController.store");
  Route.put("/:herdId", "HerdsController.update");
  Route.delete("/:herdId/:actionType", "HerdsController.destroy");
})
  .prefix("/herds")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/:herdType", "HerdsController.getList");
})
  .prefix("/herds-list")
  .namespace("App/Domains/Herds/Controllers");
