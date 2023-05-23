import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HerdGroupCreateValidator from "../Validators/HerdGroupCreateValidator";
import FeedName from "../Models/FeedName";

export default class FeedNamesController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType = "cattle" } = request.all();

    if (user) {
      try {
        return await FeedName.query().where({ herdType, ownerId: user.id });
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

      const feedName = await FeedName.create({
        ...payload,
        ownerId: user.id,
        herdType,
      });

      return response.json({
        feedName,
        message: "Successfully Created New Herd Group",
      });
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  //   public async delete({ auth, params, response }: HttpContextContract) {
  //     await auth.use("jwt").authenticate();
  //     const { herdGroupId } = params;

  //     const herdGroup = await HerdGroup.findOrFail(herdGroupId);
  //     herdGroup.delete();

  //     return response.ok("Successfully Deleted Herd Group");
  //   }
}