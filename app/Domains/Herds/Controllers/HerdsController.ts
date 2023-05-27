import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Herd from "../Models/Herd";
import HerdCreateValidator from "../Validators/HerdCreateValidator";
import HerdUpdateValidator from "../Validators/HerdUpdateValidator";
import { DateTime } from "luxon";
import Remark from "../Models/Remark";

export default class HerdsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");

    const {
      group = 0,
      type = "swine",
      tag,
      stage,
      gender,
      remark,
      order = "desc",
    } = request.all();

    const herdQuery = Herd.query().where({ type }).where({ ownerId: user.id });

    if (group) herdQuery.has("group");
    if (stage) herdQuery.where("stage", stage);
    if (gender) herdQuery.where("gender", gender);
    if (remark) herdQuery.where("remark", remark);
    if (tag) herdQuery.where("tag", "LIKE", `%${tag}%`);

    return await herdQuery
      .orderBy("createdAt", order)
      .preload("sire")
      .preload("dam");
  }

  public async store({ auth, params, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { herdType } = params;
    const user = auth.use("jwt").user;
    const payload = await request.validate(HerdCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const isDuplicate = await Herd.query()
        .where("name", payload.name)
        .andWhere("type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Herd already exist in your farm.",
        });
      }

      const herd = await Herd.query()
        .where({
          type: herdType,
          tag: payload.tag,
          ownerId: user.id,
        })
        .first();

      if (herd) return response.badRequest("Herd tag already exists");

      await Herd.create({
        ...payload,
        ownerId: user.id,
        type: herdType,
      });

      return response.created("Successfully Created New Herd");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { herdId } = params;

    const record = await Herd.query()
      .where("id", herdId)
      .preload("group")
      .preload("purpose")
      .preload("breed")
      .preload("dam")
      .preload("sire")
      .firstOrFail();

    const remark = await Remark.query().where("herd_id", record.id).first();

    const offSprings = await Herd.query()
      .where("dam_tag", record.tag)
      .orWhere("sire_tag", record.tag);

    return response.ok({
      data: record,
      offSprings: offSprings,
      remark: remark,
    });
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdId } = params;
    const payload = await request.validate(HerdUpdateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");

      const herd = await Herd.findOrFail(herdId);

      const isDuplicate = await Herd.query()
        .whereNot("id", herdId)
        .where("name", payload.name)
        .andWhere("type", herd.type)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Herd already exist.",
        });
      }

      herd.merge(payload);

      await herd.save();
      return response.ok("Successfully Updated Herd");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { herdId, actionType } = params;

    if (actionType === "archive") {
      const record = await Herd.findOrFail(herdId);
      record.deletedAt = DateTime.now();
      await record.save();
    } else {
      const record = await Herd.findOrFail(herdId);
      record.delete();
    }

    return response.ok("Successfully Deleted Herd");
  }
}
