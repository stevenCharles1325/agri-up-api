import { IHistoryOption } from "App/Interfaces/IHistoryOption";
import Database from '@ioc:Adonis/Lucid/Database'

export default class MilkReporter {
  public static async stocks (selectedHistory: IHistoryOption, herdType) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_inventories 
          WHERE 
            herd_type = '${herdType}' AND 
            TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0
          GROUP BY 
            herd_type;
        `)
        break;

      case 'current-month':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_inventories 
          WHERE 
            herd_type = '${herdType}' AND 
            TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0
          GROUP BY 
            herd_type;
        `)
        break;

      case 'past-6-years':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_inventories 
          WHERE 
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
          GROUP BY 
            herd_type;
        `)
        break;

      case 'past-6-months':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_inventories 
          WHERE 
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), NOW()) BETWEEN 1 AND 6)
          GROUP BY 
            herd_type;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }

  public static async amountOfMilkSold (selectedHistory: IHistoryOption, herdType) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE 
            reason = 'sold' AND
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0)
          GROUP BY 
            herd_type;
        `)
        break;

      case 'current-month':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE 
            reason = 'sold' AND
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0)
          GROUP BY 
            herd_type;
        `)
        break;

      case 'past-6-years':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE 
            reason = 'sold' AND
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
          GROUP BY 
            herd_type;
        `)
        break;

      case 'past-6-months':
        result = client.rawQuery(`
          SELECT 
            herd_type,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE 
            reason = 'sold' AND
            herd_type = '${herdType}' AND 
            (TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), NOW()) BETWEEN 1 AND 6)
          GROUP BY 
            herd_type;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }

  public static async reductions (selectedHistory: IHistoryOption, herdType) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT 
            reason,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0
          GROUP BY 
            reason;
        `)
        break;

      case 'current-month':
        result = client.rawQuery(`
          SELECT 
            reason,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) = 0
          GROUP BY 
            reason;
        `)
        break;

      case 'past-6-years':
        result = client.rawQuery(`
          SELECT 
            reason,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE TIMESTAMPDIFF(MONTH, TIMESTAMP(created_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6
          GROUP BY 
            reason;
        `)
        break;

      case 'past-6-months':
        result = client.rawQuery(`
          SELECT 
            reason,
            COALESCE(SUM(quantity), 0) AS total_quantity 
          FROM 
            milk_reductions 
          WHERE TIMESTAMPDIFF(YEAR, TIMESTAMP(created_at), NOW()) BETWEEN 1 AND 6
          GROUP BY 
            reason;
        `)
        break;

      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }
}