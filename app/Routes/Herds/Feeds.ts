import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "FeedsController.index");
  Route.get("/:id", "FeedsController.show");
  Route.get("/stocks/current-stocks", "FeedsController.currentStocks");
  Route.post("/:herdType", "FeedsController.add");
  Route.put("/:feedId", "FeedsController.updateFeedStock");
  Route.delete("/:feedId/:actionType/:type", "FeedsController.deleteAddFeed");
})
  .prefix("/feeds")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.post("/:herdType", "FeedsController.reducedFeed");
})
  .prefix("/feeds-reduce")
  .namespace("App/Domains/Herds/Controllers");

Route.group(() => {
  Route.get("/", "FeedsController.feedRecordIndex");
  Route.get("/:id", "FeedsController.feedRecordShow");
  Route.post("/:herdType", "FeedsController.feedRecord");
  Route.delete("/:id/:actionType", "FeedsController.deleteFeedRecord");
})
  .prefix("/feeds-records")
  .namespace("App/Domains/Herds/Controllers");
