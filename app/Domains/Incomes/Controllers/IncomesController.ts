import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Income from "../Models/Income";
import CreateIncomeValidator from "../Validators/CreateIncomeValidator";
import UpdateIncomeValidator from "../Validators/UpdateIncomeValidator";
import { DateTime } from "luxon";

export default class IncomesController {
  public async index({ auth, response, request }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");
    const search = request.input("search");

    const incomeQuery = Income.query()
      .where("ownerId", user.id)
      .whereNull("deleted_at");

    if (search) {
      incomeQuery
        .where("notes", "like", `%${search.toLowerCase().trim()}%`)
        .orWhere("type", "like", `%${search.toLowerCase().trim()}%`);
    }
    const incomes = await incomeQuery.orderBy("created_at", "desc");

    return response.ok(incomes);
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");

    const payload = await request.validate(CreateIncomeValidator);
    // const _payload = {
    //   ...payload,
    //   type: payload.type,
    //   date: payload.date,
    //   amount: payload.amount,
    //   notes: payload.notes,
    // };

    // if (payload.swineTag) {
    //   _payload["others"] = {
    //     swineTag: payload.swineTag,
    //   };
    // } else if (payload.meatType) {
    //   _payload["others"] = {
    //     meatType: payload.meatType,
    //   };
    // } else if (payload.milkType) {
    //   _payload["others"] = {
    //     meatType: payload.milkType,
    //   };
    // }

    await Income.create({
      ...payload,
      ownerId: user.id,
    });
    return response.created("Successfully Created New Income");
  }

  public async show({ auth, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { incomeId } = params;

    return await Income.findOrFail(incomeId);
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { incomeId } = params;

    const payload = await request.validate(UpdateIncomeValidator);
    const _payload = {
      type: payload.type,
      date: payload.date,
      amount: payload.amount,
      notes: payload.notes,
    };

    if (payload.swineTag) {
      _payload["others"] = {
        swineTag: payload.swineTag,
      };
    } else if (payload.meatType) {
      _payload["others"] = {
        meatType: payload.meatType,
      };
    } else if (payload.milkType) {
      _payload["others"] = {
        meatType: payload.milkType,
      };
    }

    const income = await Income.findOrFail(incomeId);

    try {
      income.merge(_payload);
      await income.save();

      return response.ok("Successfully Updated");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { incomeId, actionType } = params;

    try {
      if (actionType === "archive") {
        const record = await Income.findOrFail(incomeId);

        record.deletedAt = DateTime.now();
        await record.save();
      } else {
        const record = await Income.findOrFail(incomeId);

        record.delete();
      }

      return response.ok("Successfully Deleted");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }
}
