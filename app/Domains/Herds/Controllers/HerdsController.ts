import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Herd from "../Models/Herd";
import HerdCreateValidator from "../Validators/HerdCreateValidator";
import HerdUpdateValidator from "../Validators/HerdUpdateValidator";
import { DateTime } from "luxon";
import Remark from "../Models/Remark";
import HerdGroup from "../Models/HerdGroup";
import Breed from "../Models/Breed";

export default class HerdsController {
  public async getList({
    auth,
    response,
    params,
    request,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;
    const search = request.input("search");
    const groupId = request.input("group_id");
    const stage = request.input("stage");
    const status = request.input("status");

    if (!user) return response.unauthorized("Unauthorized");

    try {
      const query = Herd.query()
        .where("type", herdType)
        .where("owner_id", user.id)
        // .whereNull("deleted_at");

      if (search) {
        query
          .where("tag", "like", `%${search.toLowerCase().trim()}%`)
          .orWhere("name", "like", `%${search.toLowerCase().trim()}%`);
      }

      if (groupId) {
        if (groupId === "group") {
          query.whereNotNull("group_id");
        } else {
          query.whereNull("group_id");
        }
      }

      if (stage) {
        query.where("stage", stage);
      }

      if (status) {
        if (status === 'archived') {
          query.whereNotNull("deleted_at");
        } else {
          query.where("status", status);
        }
      }

      const herds = await query
        .orderBy("created_at", "desc")
        .orderBy("deleted_at", "asc");
      return response.ok(herds);
    } catch (err) {
      console.log(err);

      return response.internalServerError("Please try again");
    }
  }

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
      statusNot = [],
      order = "desc",
    } = request.all();

    const herdQuery = Herd.query().where({ type }).where({ ownerId: user.id });

    if (group) herdQuery.has("group");
    if (stage) herdQuery.where("stage", stage);
    if (gender) herdQuery.where("gender", gender);
    if (remark) herdQuery.where("remark", remark);
    if (tag) herdQuery.where("tag", "LIKE", `%${tag}%`);

    if (statusNot.length) {
      if (statusNot.some(stage => stage === 'archived')) {
        herdQuery.whereNull("deleted_at");
      }

      herdQuery.where(q => {
        q.whereNotIn("status", statusNot)
          .orWhereNull("status");
      })
    }
  
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
        .where("tag", payload.tag)
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
      .preload("purpose")
      .preload("dam")
      .preload("sire")
      .firstOrFail();

    const remark = await Remark.query().where("herd_id", record.id).first();

    const offSprings = await Herd.query()
      .whereNot("id", record.id)
      .where("dam_tag", record.id)
      .orWhere("sire_tag", record.id);

    let group: any = null;
    if (record?.groupId) {
      group = await HerdGroup.query().where("id", record?.groupId).first();
    }
    let breed: any = null;
    if (record?.breedId) {
      breed = await Breed.query().where("id", record?.breedId).first();
    }

    return response.ok({
      data: record,
      offSprings: offSprings,
      remark: remark,
      group: group,
      breed: breed,
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
        .where("tag", herd.tag)
        .andWhere("type", herd.type)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Herd already exist.",
        });
      }

      herd.merge({
        ...payload,
        groupId: payload.groupId === 0 ? null : payload.groupId,
        breedId: payload.breedId === 0 ? null : payload.breedId,
      });

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
