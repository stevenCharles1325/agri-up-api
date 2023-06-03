import { IHistoryOption } from "App/Interfaces/IHistoryOption";
import Database from '@ioc:Adonis/Lucid/Database'

export default class HerdReporter {
  public static async byStage (id: number, selectedHistory: IHistoryOption, herdType: string) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT
            stage,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            stage;
        `)
        break;
      case 'current-month':
        result = client.rawQuery(`
          SELECT
            stage,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            stage;
        `)
        break;
      case 'past-6-years':
        result = client.rawQuery(`
          SELECT
            stage,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            stage;
        `)
        break;
      case 'past-6-months':
        result = client.rawQuery(`
          SELECT
            stage,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            stage;
        `)
        break;
      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }

  public static async byGender (id: number, selectedHistory: IHistoryOption, herdType: string) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT
            gender,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            gender;
        `)
        break;
      case 'current-month':
        result = client.rawQuery(`
          SELECT
            gender,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            gender;
        `)
        break;
      case 'past-6-years':
        result = client.rawQuery(`
          SELECT
            gender,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            gender;
        `)
        break;
      case 'past-6-months':
        result = client.rawQuery(`
          SELECT
            gender,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            gender;
        `)
        break;
      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }

  public static async byStatus (id: number, selectedHistory: IHistoryOption, herdType: string) {
    const client = Database.connection()
    let result: any

    switch (selectedHistory) {
      case 'current-year':
        result = client.rawQuery(`
          SELECT
            status,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            status;
        `)
        break;
      case 'current-month':
        result = client.rawQuery(`
          SELECT
            status,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) = 0)
            AND owner_id = '${id}'
          GROUP BY 
            status;
        `)
        break;
      case 'past-6-years':
        result = client.rawQuery(`
          SELECT
            status,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(YEAR, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            status;
        `)
        break;
      case 'past-6-months':
        result = client.rawQuery(`
          SELECT
            status,
            COALESCE(COUNT(*), 0) AS total_count 
          FROM 
            herds 
          WHERE
            type = '${herdType}' 
            AND (TIMESTAMPDIFF(MONTH, TIMESTAMP(entered_at), TIMESTAMP(NOW())) BETWEEN 1 AND 6)
            AND owner_id = '${id}'
          GROUP BY 
            status;
        `)
        break;
      default:
        throw new Error('Invalid time-frame type')
    }

    return (await result)?.[0]
  }
}