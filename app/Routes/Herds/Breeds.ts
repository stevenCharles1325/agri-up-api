import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "BreedsController.index");

  Route.post("/:herdType", "BreedsController.store");
  Route.delete("/:breedId", "BreedsController.destroy");
})
  .prefix("/herd/breeds")
  .namespace("App/Domains/Herds/Controllers");
