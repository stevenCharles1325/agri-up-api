import { IHistoryOption } from "../../Interfaces/IHistoryOption";
import Database from '@ioc:Adonis/Lucid/Database'

export default class ExpenseReporter {
  // HISTORY
  public static async history (id:number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let expense: any

    switch (selectedHistory) {
      case 'current-year':
        expense = client.rawQuery(`
          SELECT 
            MONTH(date) AS month_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = '${id}'
          GROUP BY 
            MONTH(date);
        `)
        break;

      case 'current-month':
        expense = client.rawQuery(`
          SELECT 
            DAY(date) AS month_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = '${id}'
          GROUP BY 
            DAY(date);
        `)
        break;

      case 'past-6-months':
        expense = client.rawQuery(`
          SELECT 
            MONTH(date) AS month_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
            AND owner_id = '${id}'
          GROUP BY 
            MONTH(date);
        `)
        break;
  
      case 'past-6-years':
        expense = client.rawQuery(`
          SELECT 
            YEAR(date) AS month_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
            AND owner_id = '${id}'
          GROUP BY 
            YEAR(date);
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await expense)?.[0]
  }

  public static async type (id: number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let expense: any

    switch (selectedHistory) {
      case 'current-year':
        expense = client.rawQuery(`
          SELECT 
            type, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = '${id}'
          GROUP BY 
            type;
        `)
        break;

      case 'current-month':
        expense = client.rawQuery(`
          SELECT 
            type, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = '${id}'
          GROUP BY 
            type;
        `)
        break;

      case 'past-6-months':
        expense = client.rawQuery(`
          SELECT 
            type,
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
            AND owner_id = '${id}'
          GROUP BY 
            type;
        `)
        break;
  
      case 'past-6-years':
        expense = client.rawQuery(`
          SELECT 
            type,
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            expenses 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
            AND owner_id = '${id}'
          GROUP BY 
            type;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await expense)?.[0]
  }

  // TOTAL INCOME
  public static async total (id: number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let expense: any

    switch (selectedHistory) {
      case 'current-year':
        expense = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              expenses 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = '${id}'
          GROUP BY 
              MONTH(date)
          ) AS t;
        `)
        break;

      case 'current-month':
        expense = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              DAY(date) AS month_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              expenses 
            WHERE 
              TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
              AND owner_id = '${id}'
            GROUP BY 
              DAY(date)
          ) AS t;
        `)
        break;

      case 'past-6-months':
        expense = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              MONTH(date) AS month_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              expenses 
            WHERE 
              TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
              AND owner_id = '${id}'
            GROUP BY 
              MONTH(date)
          ) AS t;
        `)
        break;
  
      case 'past-6-years':
        expense = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              YEAR(date) AS month_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              expenses 
            WHERE 
              TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
              AND owner_id = '${id}'
            GROUP BY 
              YEAR(date)
          ) AS t;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await expense)?.[0]?.[0]?.total ?? 0
  }
}