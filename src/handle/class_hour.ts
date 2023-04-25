import { Response } from "express";
import { connection } from "../utils/mysql";
import Logger from "../loaders/logger";

// 对课时的操作，需要记录下操作人，操作时间，课程id，学生id，学生姓名，操作类型（扣还是加），操作数量（扣/加了多少），操作前课时，操作后课时，备注
export function operateClassHour(req: any, res: Response) {
  // 传过来的参数：class_id, class_name,student_id, student_name, type, operate_num, before_class_hour, remarks, operator
  const { data } = req.body;
  let length = data.length;
  // 传过来是数组，就需要开启事务，一起提交，如果失败，就回滚
  connection.beginTransaction(function (err) {
    if (err) {
      Logger.error(err);
      res.json({
        success: false,
        data: { message: "开启事务失败" },
      });
      return connection.rollback(function () {
        throw err;
      });
    } else {
      // 将数组中的每一项都插入到数据库中，如果有一项插入失败，就回滚。item中包括：class_id, student_id, student_name, type, operate_num, before_class_hour, remarks, operator
      data.forEach((item: any, index: number) => {
        connection.query(
          "insert into class_hour_operate(campus, class_id, class_name,student_id, student_name, type, operate_num, before_class_hour, after_class_hour, remarks, operator) values (?,?,?,?,?,?,?,?,?,?,?)",
          [
            item.campus,
            item.class_id,
            item.class_name,
            item.student_id,
            item.student_name,
            item.type,
            item.operate_num,
            item.before_class_hour,
            item.type = 1 ? item.before_class_hour - item.operate_num : item.before_class_hour + item.operate_num,
            item.remarks,
            item.operator,
          ],
           function (err) {
            if (err) {
              Logger.error(err);
              res.json({
                success: false,
                data: { message: "插入操作失败" },
              });
              return connection.rollback(function () {
                throw err;
              });
            } else {
              // 修改学生表中的课时
                connection.query(
                    "update students set class_hour = ? where student_id = ?",
                    [item.type = 1 ? item.before_class_hour - item.operate_num : item.before_class_hour + item.operate_num, item.student_id],
                    function (err) {
                        if (err) {
                            Logger.error(err);
                            res.json({
                                success: false,
                                data: { message: "修改学生课时失败" },
                            });
                            return connection.rollback(function () {
                                throw err;
                            });
                        }
                    }
                );
              // 如果是最后一项，就提交事务
              if (index === length - 1) {
                connection.commit(function (err) {
                  if (err) {
                    Logger.error(err);
                  }
                });
                res.json({
                  success: true,
                  data: { message: "课时操作成功" },
                });
              }
            }
          }
        );
      });
    }
  });
}

// 根据student_id查询学生的课时操作记录
export async function searchClassHourOperate(req: any, res: Response) {
    const { student_id } = req.body;
    connection.query(
        "select * from class_hour_operate where student_id = ?",
        [student_id],
        function (err, result) {
            if (err) {
                Logger.error(err);
                res.json({
                    success: false,
                    message: "查询课时操作记录失败",
                });
            } else {
                res.json({
                    success: true,
                    data: result,
                });
            }
        }
    );
}
