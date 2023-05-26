import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Purpose from "../Models/Purpose";
import PurposeCreateValidator from "../Validators/PurposeCreateValidator";

export default class PurposesController {
  public async index({ auth, response, request }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");

    const herdType = request.input("herdType", "cattle");

    return await Purpose.query().where({ herdType, ownerId: user.id });
  }

  public async store({ auth, request, response, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType } = params;
    const payload = await request.validate(PurposeCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");

      const isDuplicate = await Purpose.query()
        .where("name", payload.name)
        .andWhere("herd_type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Purpose already exist.",
        });
      }

      const record = await Purpose.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });
      return response.json({
        record,
        message: "Successfully Created New Purpose",
      });
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { purposeId } = params;

    try {
      const purpose = await Purpose.findOrFail(purposeId);
      purpose.delete();

      return response.created("Successfully Deleted Purpose");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, herdType } = params;

    const payload = await request.validate(PurposeCreateValidator);
    const record = await Purpose.findOrFail(id);

    try {
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user;

      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const isDuplicate = await Purpose.query()
        .whereNot("id", params.id)
        .where("name", payload.name)
        .andWhere("herd_type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Purpose already exist.",
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
