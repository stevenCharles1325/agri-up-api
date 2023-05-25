import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedNamesController.index");

  Route.post("/:herdType", "FeedNamesController.store");
  //   Route.delete("/:breedId", "HerdGroupsController.destroy");
})
  .prefix("/feeds/names")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "SellingPricePerKiloController.index");

  Route.post("/:herdType", "SellingPricePerKiloController.store");
  //   Route.delete("/:breedId", "HerdGroupsController.destroy");
})
  .prefix("/selling-price-per-kilo")
  .namespace("App/Domains/Herds/Controllers");
