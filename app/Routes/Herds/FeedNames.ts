import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedNamesController.index");

  Route.post("/:herdType", "FeedNamesController.store");
  Route.delete("/:feedId", "FeedNamesController.destroy");
  Route.put("/:id/:herdType", "FeedNamesController.update");
})
  .prefix("/feeds/names")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "SellingPricePerKiloController.index");

  Route.post("/:herdType", "SellingPricePerKiloController.store");
  Route.delete("/:id", "SellingPricePerKiloController.destroy");
  Route.put("/:id/:herdType", "SellingPricePerKiloController.update");
})
  .prefix("/selling-price-per-kilo")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "SellingPricePerLiterController.index");

  Route.post("/:herdType", "SellingPricePerLiterController.store");
  Route.delete("/:id", "SellingPricePerLiterController.destroy");
  Route.put("/:id/:herdType", "SellingPricePerLiterController.update");
})
  .prefix("/selling-price-per-liter")
  .namespace("App/Domains/Herds/Controllers");
