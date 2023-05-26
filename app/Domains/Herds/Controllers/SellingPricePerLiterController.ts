import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HerdGroupCreateValidator from "../Validators/HerdGroupCreateValidator";
import SellingPricePerLiter from "../Models/SellingPricePerLiter";

export default class SellingPricePerLiterController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType = "cattle" } = request.all();

    if (user) {
      try {
        return await SellingPricePerLiter.query().where({
          herdType,
          ownerId: user.id,
        });
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  public async store({ auth, params, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;
    const payload = await request.validate(HerdGroupCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const isDuplicate = await SellingPricePerLiter.query()
        .where("name", payload.name)
        .andWhere("herd_type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Selling Price Per Liter already exist.",
        });
      }

      const feedName = await SellingPricePerLiter.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });

      return response.json({
        feedName,
        message: "Successfully Created New SellingPricePerLiter",
      });
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id } = params;

    const herdGroup = await SellingPricePerLiter.findOrFail(id);
    herdGroup.delete();

    return response.ok("Successfully Deleted Herd Group");
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, herdType } = params;

    const payload = await request.validate(HerdGroupCreateValidator);
    const record = await SellingPricePerLiter.findOrFail(id);

    try {
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user;

      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const isDuplicate = await SellingPricePerLiter.query()
        .whereNot("id", params.id)
        .where("name", payload.name)
        .andWhere("herd_type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Selling Price Per Liter already exist.",
        });
      }

      record.merge(payload);
      await record.save();

      return response.ok("Successfully Updated");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }
}
