import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MarkAsValidator from "../Validators/MarkAsValidator";
import Herd from "../Models/Herd";
import Remark from "../Models/Remark";

export default class MarkAsController {
  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, herdType } = params;

    const payload = await request.validate(MarkAsValidator);

    try {
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user;

      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const herd = await Herd.findOrFail(id);
      herd.status = payload.status;
      await herd.save();

      await Remark.create({
        ...payload,
        herdId: id,
        herdType,
        ownerId: user.id,
      });

      return response.ok("Successfully Added");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }

  public async checkIfExist({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, herdType } = params;

    try {
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user;

      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const isExisting = await Remark.query().where({
        herdType: herdType,
        ownerId: user.id,
        herdId: id,
      });

      return isExisting.length > 0;
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }
}
