import * as mysql from "mysql2";
import mysqlConfig from "../config";
import Logger from "../loaders/logger";
import { insertUser } from "../models/mysql/index";
/** user数据库 */
export const connection = mysql.createConnection(
  Object.assign({ database: "user" }, mysqlConfig.mysql)
);

export function queryTable(s: string): void {
  connection.query(s, (err) => {
    err ? Logger.error(err) : Logger.info(`${s}表创建成功`);
  });
}
export function queryTableUser(s: string): void {
  connection.query(s, (err) => {
    err ? Logger.error(err) : Logger.info(`${s}表创建成功`);
  });
  /** 项目初始化的时候会首先向user表中添加admin用户 */
  insertUser('admin','admin','123456','admin')
}

