import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "HerdsController.index");

  Route.get("/:herdId", "HerdsController.show");
  Route.post("/:herdType", "HerdsController.store");
  Route.put("/:herdId", "HerdsController.update");
  Route.delete("/:herdId", "HerdsController.destroy");
})
  .prefix("/herds")
  .namespace("App/Domains/Herds/Controllers");
