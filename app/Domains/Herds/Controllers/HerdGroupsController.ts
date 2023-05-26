import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HerdGroupCreateValidator from "../Validators/HerdGroupCreateValidator";
import HerdGroup from "../Models/HerdGroup";

export default class HerdGroupsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const herdType = request.input("herdType", "cattle");

    if (user) {
      try {
        return await HerdGroup.query().where({ herdType, ownerId: user.id });
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

      const isDuplicate = await HerdGroup.query()
        .where("name", payload.name)
        .andWhere("herd_type", herdType)
        .andWhere("owner_id", user.id)
        .first();

      if (isDuplicate) {
        return response.status(400).json({
          status: 400,
          message: "This Group already exist.",
        });
      }

      const record = await HerdGroup.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });

      return response.json({
        record,
        message: "Successfully Created New Herd Group",
      });
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { herdGroupId } = params;

    const herdGroup = await HerdGroup.findOrFail(herdGroupId);
    herdGroup.delete();

    return response.ok("Successfully Deleted Herd Group");
  }
}
