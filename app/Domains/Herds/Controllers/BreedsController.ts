import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Breed from "../Models/Breed";
import BreedCreateValidator from "../Validators/BreedCreateValidator";

export default class BreedsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const herdType = request.input("herdType", "cattle");

    if (user) {
      try {
        return await Breed.query().where({ herdType, ownerId: user.id });
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
    const payload = await request.validate(BreedCreateValidator);

    try {
      if (!user) return response.unauthorized("Unauthorized");
      if (!herdType) return response.badRequest("Invalid Herd Type");

      const record = await Breed.create({
        ...payload,
        herdType,
        ownerId: user.id,
      });
      return response.json({
        record,
        message: "Successfully Created New Breed",
      });
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again");
    }
  }

  public async delete({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { breedId } = params;

    const breed = await Breed.findOrFail(breedId);
    breed.delete();

    return response.ok("Successfully Deleted Herd Group");
  }
}
