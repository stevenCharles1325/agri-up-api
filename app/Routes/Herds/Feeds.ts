import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedsController.index");
  Route.get("/:id", "FeedsController.show");
  Route.get("/stocks/current-stocks", "FeedsController.currentStocks");
  Route.post("/:herdType", "FeedsController.add");
  Route.put("/:feedId", "FeedsController.updateFeedStock");
  Route.delete("/:feedId", "FeedsController.deleteAddFeed");
})
  .prefix("/feeds")
  .namespace("App/Domains/Herds/Controllers");
