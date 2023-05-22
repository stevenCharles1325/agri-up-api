/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import URL from "url-parse";
import Env from "@ioc:Adonis/Core/Env";
import Application from "@ioc:Adonis/Core/Application";
import { DatabaseConfig, MysqlConfig } from "@ioc:Adonis/Lucid/Database";

const PROD_MYSQL_DB = new URL(Env.get("CLEARDB_DATABASE_URL", ""));
const productionConfig: MysqlConfig = {
  client: "mysql2",
  connection: {
    host: PROD_MYSQL_DB.host as string,
    port: Env.get("MYSQL_PORT", ""),
    user: PROD_MYSQL_DB.username as string,
    password: PROD_MYSQL_DB.password as string,
    database: PROD_MYSQL_DB.pathname.substr(1) as string,
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
};

const developmentConfig: MysqlConfig = {
  client: "mysql2",
  connection: {
    host: Env.get("MYSQL_HOST"),
    port: Env.get("MYSQL_PORT"),
    user: Env.get("MYSQL_USER"),
    password: Env.get("MYSQL_PASSWORD", ""),
    database: Env.get("MYSQL_DB_NAME"),
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
};

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get("DB_CONNECTION"),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql2
    |
    */
    mysql: developmentConfig,
    // mysql: Application.inProduction ? productionConfig : developmentConfig,
  },
};

export default databaseConfig;
