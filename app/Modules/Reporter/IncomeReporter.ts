import { IHistoryOption } from "../../Interfaces/IHistoryOption";
import Database from '@ioc:Adonis/Lucid/Database'

export default class IncomeReporter {
  // HISTORY
  public static async history (id: number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let income: any

    switch (selectedHistory) {
      case 'current-year':
        income = client.rawQuery(`
          SELECT 
            MONTH(date) AS period_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
            MONTH(date);
        `)
        break;

      case 'current-month':
        income = client.rawQuery(`
          SELECT 
            DAY(date) AS period_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
            DAY(date);
        `)
        break;

      case 'past-6-months':
        income = client.rawQuery(`
          SELECT 
            MONTH(date) AS period_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
            AND owner_id = ${id}
          GROUP BY 
            MONTH(date);
        `)
        break;
  
      case 'past-6-years':
        income = client.rawQuery(`
          SELECT 
            YEAR(date) AS period_number, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
            AND owner_id = ${id}
          GROUP BY 
            YEAR(date);
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await income)?.[0]
  }

  public static async sale (id: number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let income: any

    switch (selectedHistory) {
      case 'current-year':
        income = client.rawQuery(`
          SELECT 
            type, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
            YEAR(date),
            type;
        `)
        break;

      case 'current-month':
        income = client.rawQuery(`
          SELECT 
            type, 
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
            DAY(date),
            type;
        `)
        break;

      case 'past-6-months':
        income = client.rawQuery(`
          SELECT 
            type,
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
            AND owner_id = ${id}
          GROUP BY 
            MONTH(date),
            type;
        `)
        break;
  
      case 'past-6-years':
        income = client.rawQuery(`
          SELECT 
            type,
            COALESCE(SUM(amount), 0) AS total_amount 
          FROM 
            incomes 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
            AND owner_id = ${id}
          GROUP BY 
            YEAR(date),
            type;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await income)?.[0]
  }

  // TOTAL INCOME
  public static async total (id: number, selectedHistory: IHistoryOption) {
    const client = Database.connection()
    let income: any

    switch (selectedHistory) {
      case 'current-year':
        income = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              incomes 
          WHERE 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
              MONTH(date)
          ) AS t;
        `)
        break;

      case 'current-month':
        income = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              DAY(date) AS period_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              incomes 
          WHERE 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) = 0
            AND owner_id = ${id}
          GROUP BY 
              DAY(date)
          ) AS t;
        `)
        break;

      case 'past-6-months':
        income = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              MONTH(date) AS period_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              incomes 
            WHERE 
              TIMESTAMPDIFF(MONTH, TIMESTAMP(date), TIMESTAMP(NOW())) BETWEEN 1 AND 6
              AND owner_id = ${id}
            GROUP BY 
              MONTH(date)
          ) AS t;
        `)
        break;
  
      case 'past-6-years':
        income = client.rawQuery(`
          SELECT SUM (total_amount) as total
          FROM (
            SELECT 
              YEAR(date) AS period_number, 
              COALESCE(SUM(amount), 0) AS total_amount 
            FROM 
              incomes 
            WHERE 
              TIMESTAMPDIFF(YEAR, TIMESTAMP(date), NOW()) BETWEEN 1 AND 6
              AND owner_id = ${id}
            GROUP BY 
              YEAR(date)
          ) AS t;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await income)?.[0]?.[0]?.total ?? 0
  }
}