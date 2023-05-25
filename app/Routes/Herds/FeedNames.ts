import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedNamesController.index");

  Route.post("/:herdType", "FeedNamesController.store");
})
  .prefix("/feeds/names")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "SellingPricePerKiloController.index");

  Route.post("/:herdType", "SellingPricePerKiloController.store");
})
  .prefix("/selling-price-per-kilo")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "SellingPricePerLiterController.index");

  Route.post("/:herdType", "SellingPricePerLiterController.store");
})
  .prefix("/selling-price-per-liter")
  .namespace("App/Domains/Herds/Controllers");
