import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MilkAdditionCreateValidator from "../Validators/MilkAdditionCreateValidator";
import MilkAddition from "../Models/MilkAddition";
import { DateTime } from "luxon";
import MilkReduction from "../Models/MilkReduction";

export default class MilkInventoriesController {
  public async index({ auth, response, params, request }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType, type } = params;
    const search = request.input("search");

    if (!user) return response.unauthorized("Unauthorized");

    try {
      if (type === "additions") {
        const query = MilkAddition.query()
          .where("herd_type", herdType)
          .where("ownerId", user.id)
          .whereNull("deleted_at");

        if (search) {
          query.where("notes", "like", `%${search.toLowerCase().trim()}%`);
        }

        const milks = await query.orderBy("createdAt", "desc");
        return response.ok(milks);
      } else if (type === "reductions") {
        const query = MilkReduction.query()
          .where("herd_type", herdType)
          .where("ownerId", user.id)
          .whereNull("deleted_at");

        if (search) {
          query.where("notes", "like", `%${search.toLowerCase().trim()}%`);
        }

        const milks = await query.orderBy("createdAt", "desc");
        return response.ok(milks);
      }
    } catch (err) {
      console.log(err);

      return response.internalServerError("Please try again");
    }
  }

  public async store({ auth, params, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { herdType, type } = params;
    const payload = await request.validate(MilkAdditionCreateValidator);

    if (!user) return response.unauthorized("Unauthorized");

    try {
      if (type === "additions") {
        await MilkAddition.create({
          ...payload,
          ownerId: user.id,
          herdType: herdType,
        });
        return response.ok("Successfully Added Milk");
      } else if (type === "reductions") {
        await MilkReduction.create({
          ...payload,
          ownerId: user.id,
          herdType: herdType,
        });
        return response.ok("Successfully Reduced Milk");
      }
    } catch (err) {
      console.log(err);

      return response.internalServerError("Please try again");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, type, actionType } = params;

    if (type === "additions") {
      if (actionType === "archive") {
        const record = await MilkAddition.findOrFail(id);
        record.deletedAt = DateTime.now();
        await record.save();
      } else {
        const record = await MilkAddition.findOrFail(id);
        record.delete();
      }
    } else if (type === "reductions") {
      if (actionType === "archive") {
        const record = await MilkReduction.findOrFail(id);
        record.deletedAt = DateTime.now();
        await record.save();
      } else {
        const record = await MilkReduction.findOrFail(id);
        record.delete();
      }
    }

    return response.ok("Successfully Deleted Herd Group");
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { id, type, actionType } = params;

    const payload = await request.validate(MilkAdditionCreateValidator);

    try {
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user;

      if (!user) return response.unauthorized("Unauthorized");
      if (!type) return response.badRequest("Invalid Herd Type");

      if (actionType === "additions") {
        const record = await MilkAddition.findOrFail(id);
        record.merge(payload);
        await record.save();
      } else if (actionType === "reductions") {
        const record = await MilkReduction.findOrFail(id);
        record.merge(payload);
        await record.save();
      }

      return response.ok("Successfully Updated");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }

  public async showAdditions({ auth, response, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { id } = params;
    if (user) {
      try {
        const record = await MilkAddition.query().where("id", id).first();
        return record;
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  public async showReductions({ auth, response, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    const { id } = params;
    if (user) {
      try {
        const record = await MilkReduction.query().where("id", id).first();
        return record;
      } catch (err) {
        console.log(err);

        if (err.code) return response.internalServerError(err.code);

        return response.internalServerError("Please try again");
      }
    } else {
      return response.unauthorized("Unauthorized");
    }
  }

  // public async addMilk({
  //   auth,
  //   params,
  //   request,
  //   response,
  // }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const user = auth.use("jwt").user;
  //   const { herdType } = params;
  //   const payload = await request.validate(MilkAdditionCreateValidator);

  //   if (!user) return response.unauthorized("Unauthorized");

  //   const milk = await MilkInventory.query().where("ownerId", user.id).first();

  //   if (!milk) {
  //     try {
  //       const createdMilk = await MilkInventory.create({
  //         ownerId: user.id,
  //         quantity: payload.quantity,
  //         herdType,
  //       });

  //       await MilkAddition.create({
  //         ...payload,
  //         milkId: createdMilk.id,
  //         ownerId: user.id,
  //       });

  //       return response.ok("Successfully Added Milk");
  //     } catch (err) {
  //       console.log(err);

  //       return response.internalServerError("Please try again");
  //     }
  //   } else {
  //     try {
  //       await MilkAddition.create({
  //         ...payload,
  //         milkId: milk.id,
  //         ownerId: user.id,
  //       });

  //       return response.ok("Successfully Added Milk");
  //     } catch (err) {
  //       console.log(err);

  //       return response.internalServerError("Please try again");
  //     }
  //   }
  // }

  // public async reduce({ auth, request, response }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const user = auth.use("jwt").user;
  //   const payload = await request.validate(MilkReductionCreateValidator);

  //   if (!user) return response.unauthorized("Unauthorized");
  //   const milk = await MilkInventory.query().where("ownerId", user.id).first();

  //   if (!milk) return response.badRequest("Cannot Reduce Non-Existing Milk");

  //   await MilkReduction.create({
  //     ...payload,
  //     milkId: milk.id,
  //     ownerId: user.id,
  //     herdType: milk.herdType,
  //   });

  //   if (payload.reason === "sold") {
  //     await Expense.create({
  //       ownerId: user.id,
  //       date: payload.date,
  //       notes: payload.notes,
  //       amount: payload.totalAmount,
  //       type: "others",
  //     });
  //   }

  //   return response.ok("Successfully Added Milk");
  // }

  // public async milkAdditions({ auth, response }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const user = auth.use("jwt").user;

  //   if (!user) return response.unauthorized("Unauthorized");

  //   try {
  //     const milkInventory = await MilkAddition.query()
  //       .where("ownerId", user.id)
  //       .orderBy("createdAt", "desc");

  //     return response.ok(milkInventory);
  //   } catch (err) {
  //     console.log(err);

  //     return response.internalServerError("Please try again");
  //   }
  // }

  // public async milkReductions({ auth, response }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const user = auth.use("jwt").user;

  //   if (!user) return response.unauthorized("Unauthorized");

  //   try {
  //     const milkInventory = await MilkReduction.query()
  //       .where("ownerId", user.id)
  //       .orderBy("createdAt", "desc");

  //     return response.ok(milkInventory);
  //   } catch (err) {
  //     console.log(err);

  //     return response.internalServerError("Please try again");
  //   }
  // }

  // public async show({ auth, response, params }: HttpContextContract) {
  //   await auth.use("jwt").authenticate();
  //   const user = auth.use("jwt").user;
  //   const { id, type } = params;

  //   if (user) {
  //     try {
  //       if (type === "addition") {
  //         const record = await MilkAddition.query().where("id", id).first();
  //         return record;
  //       } else if (type === "reduction") {
  //         const record = await MilkReduction.query().where("id", id).first();
  //         return record;
  //       }
  //     } catch (err) {
  //       console.log(err);

  //       if (err.code) return response.internalServerError(err.code);

  //       return response.internalServerError("Please try again");
  //     }
  //   } else {
  //     return response.unauthorized("Unauthorized");
  //   }
  // }
}
