import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Expense from "../Models/Expense";
import CreateExpenseValidator from "../Validators/CreateExpenseValidator";
import UpdateExpenseValidator from "../Validators/UpdateExpenseValidator";
import { DateTime } from "luxon";

export default class ExpensesController {
  public async index({ auth, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    // const { notes = "", amountOrder = "asc" } = request.all();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");

    const expenses = await Expense.query()
      .where("ownerId", user.id)
      // .if(notes, (passedQuery) =>
      //   passedQuery.where("notes", "LIKE", `%${notes}%`)
      // )
      .orderBy("created_at", "desc");

    return response.ok(expenses);
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const user = auth.use("jwt").user;
    if (!user) return response.unauthorized("Unauthorized");

    const payload = await request.validate(CreateExpenseValidator);
    await Expense.create({
      ...payload,
      ownerId: user.id,
    });

    return response.created("Successfully Created New Expense");
  }

  public async show({ auth, params }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { expenseId } = params;

    return await Expense.findOrFail(expenseId);
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { expenseId } = params;

    const payload = await request.validate(UpdateExpenseValidator);
    const expense = await Expense.findOrFail(expenseId);

    try {
      expense.merge(payload);
      await expense.save();

      return response.ok("Successfully Updated");
    } catch (err) {
      console.log(err);

      if (err.code) return response.internalServerError(err.code);

      return response.internalServerError("Please try again later");
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use("jwt").authenticate();
    const { expenseId, actionType } = params;

    try {
      if (actionType === "archive") {
        const record = await Expense.findOrFail(expenseId);

        record.deletedAt = DateTime.now();
        await record.save();
      } else {
        const record = await Expense.findOrFail(expenseId);

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
