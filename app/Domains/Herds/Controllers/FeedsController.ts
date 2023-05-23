import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Feed from "../Models/Feed";
import FeedCreateValidator from "../Validators/FeedCreateValidator";
import FeedName from "../Models/FeedName";
import FeedReduceCreateValidator from "../Validators/FeedReduceCreateValidator";
import FeedUpdateValidator from "../Validators/FeedUpdateValidator";
import FeedRecordCreateValidator from "../Validators/FeedRecordCreateValidator";
import FeedRecord from "../Models/FeedRecord";

export default class FeedsController {
  public async currentStocks({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType = "cattle" } = request.all();

    if (user) {
      try {
        const feeds = await FeedName.query()
          .where("herd_type", herdType)
          .andWhere("owner_id", user.id);

        return feeds;
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType = "cattle" } = request.all();

    if (user) {
      try {
        const feeds = await Feed.query()
          .where("herd_type", herdType)
          .andWhere("owner_id", user.id)
          .preload("feedName")
          .orderBy("created_at", "desc");
        return feeds;
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  public async show({ auth, response, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;

    if (user) {
      try {
        const feed = await Feed.query().where("id", params.id).first();
        return feed;
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  public async add({ auth, params, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;
    const payload = await request.validate(FeedCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const feedName = await FeedName.findOrFail(payload.feedNameId);
      await Feed.create({
        ...payload,
        herdType,
        ownerId: user.id,
      });
      feedName.quantity = feedName.quantity + payload.quantity;
      await feedName.save();

      return response.ok("Successfully Added Feed");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async updateFeedStock({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { feedId } = params;
    const payload = await request.validate(FeedUpdateValidator);
    const feed = await Feed.findOrFail(feedId);
    feed.merge(payload);

    try {
      await feed.save();
      return response.ok("Successfully Updated Feed");
    } catch (err) {
      console.log(err);
      return response.internalServerError(err.code);
    }
  }

  public async reducedFeed({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;
    const payload = await request.validate(FeedReduceCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const feedName = await FeedName.findOrFail(payload.feedNameId);

      if (feedName.quantity < 0 || feedName.quantity < payload.quantity) {
        return response.badRequest(
          "Feed Quantity Is Either 0 or Less Than Reduction Quantity"
        );
      }

      await Feed.create({
        ...payload,
        herdType,
        ownerId: user.id,
      });
      feedName.quantity = feedName.quantity - payload.quantity;
      await feedName.save();

      return response.ok("Successfully Added Feed");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async feedRecord({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;

    if (!user) return response.unauthorized("Unauthorized");
    if (!herdType) return response.badRequest("Invalid Herd Type");

    const payload = await request.validate(FeedRecordCreateValidator);

    try {
      await FeedRecord.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });

      return response.ok("Successfully Created Feed Record");
    } catch (err) {
      console.log(err);

      return response.internalServerError("Please try again");
    }
  }

  // public async deleteAddFeed({ auth, params, response }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const { feedId } = params;

  //   const feed = await Feed.findOrFail(feedId);
  //   feed.delete();

  //   return response.ok("Successfully Deleted Feed");
  // }

  // public async deleteReduceFeed({
  //   auth,
  //   params,
  //   response,
  // }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const { feedReduceId } = params;

  //   const feedReduce = await FeedReduce.findOrFail(feedReduceId);
  //   await feedReduce.delete();

  //   return response.ok("Successfully Deleted Feed");
  // }

  // public async deleteFeedRecord({
  //   auth,
  //   params,
  //   response,
  // }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const { feedRecordId } = params;

  //   const feedRecord = await FeedRecord.findOrFail(feedRecordId);
  //   await feedRecord.delete();

  //   return response.ok("Successfully Deleted Feed");
  // }
}
