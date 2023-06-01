import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Feed from "../Models/Feed";
import FeedCreateValidator from "../Validators/FeedCreateValidator";
import FeedName from "../Models/FeedName";
import FeedReduceCreateValidator from "../Validators/FeedReduceCreateValidator";
import FeedUpdateValidator from "../Validators/FeedUpdateValidator";
import FeedRecordCreateValidator from "../Validators/FeedRecordCreateValidator";
import FeedRecord from "../Models/FeedRecord";
import { DateTime } from "luxon";
import Expense from "App/Domains/Expenses/Models/Expense";

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
    const search = request.input("search");

    if (user) {
      try {
        const feedQuery = Feed.query()
          .where("herd_type", herdType)
          .where("owner_id", user.id)
          .whereNull("deleted_at")
          .preload("feedName");

        if (search) {
          feedQuery
            .where("notes", "like", `%${search.toLowerCase().trim()}%`)
            .orWhere("quantity", "like", `%${search.toLowerCase().trim()}%`)
            .orWhere("source", "like", `%${search.toLowerCase().trim()}%`)
            .orWhere("reason", "like", `%${search.toLowerCase().trim()}%`);
        }

        const feeds = await feedQuery.orderBy("created_at", "desc");
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

      if (payload.source === "bought") {
        const expense = {
          type: "Others",
          herdType,
          date: payload.date,
          amount: payload.totalAmount,
          notes: payload.notes,
        }

        await Expense.create(expense);
      }

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

  public async feedRecordIndex({
    auth,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType = "cattle" } = request.all();
    const search = request.input("search");

    if (user) {
      try {
        const feedQuery = FeedRecord.query()
          .where("herd_type", herdType)
          .whereNull("deleted_at")
          .andWhere("owner_id", user.id)
          .preload("feedName");

        if (search) {
          feedQuery.where(
            "consumer",
            "like",
            `%${search.toLowerCase().trim()}%`
          );
        }

        const feeds = await feedQuery.orderBy("created_at", "desc");
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
      const feedName = await FeedName.findOrFail(payload.feedNameId);
      if (feedName.quantity < 0 || feedName.quantity < payload.quantity) {
        return response.badRequest(
          "Feed Quantity Is Either 0 or Less Than Reduction Quantity"
        );
      }

      await FeedRecord.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });

      feedName.quantity = feedName.quantity - payload.quantity;
      await feedName.save();

      return response.ok("Successfully Created Feed Record");
    } catch (err) {
      console.log(err);

      return response.internalServerError("Please try again");
    }
  }

  public async feedRecordShow({ auth, response, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;

    if (user) {
      try {
        const feed = await FeedRecord.query().where("id", params.id).first();
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

  public async deleteAddFeed({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { feedId, actionType, type } = params;

    if (actionType === "archive") {
      const record = await Feed.findOrFail(feedId);

      if (type === "addition") {
        const feedName = await FeedName.findOrFail(record.feedNameId);
        feedName.quantity = feedName.quantity - record.quantity;
        await feedName.save();
      } else {
        const feedName = await FeedName.findOrFail(record.feedNameId);
        feedName.quantity = feedName.quantity + record.quantity;
        await feedName.save();
      }

      record.deletedAt = DateTime.now();
      await record.save();
    } else {
      const record = await Feed.findOrFail(feedId);
      if (type === "addition") {
        const feedName = await FeedName.findOrFail(record.feedNameId);
        feedName.quantity = feedName.quantity - record.quantity;
        await feedName.save();
      } else {
        const feedName = await FeedName.findOrFail(record.feedNameId);
        feedName.quantity = feedName.quantity + record.quantity;
        await feedName.save();
      }
      record.delete();
    }

    return response.ok("Successfully Deleted Feed");
  }

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

  public async deleteFeedRecord({
    auth,
    params,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, actionType } = params;

    if (actionType === "archive") {
      const record = await FeedRecord.findOrFail(id);

      record.deletedAt = DateTime.now();
      await record.save();
    } else {
      const record = await FeedRecord.findOrFail(id);

      record.delete();
    }

    return response.ok("Successfully Deleted Feed");
  }
}
