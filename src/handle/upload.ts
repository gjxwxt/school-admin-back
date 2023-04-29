import { Response } from "express";
import { connection } from "../utils/mysql";
import Logger from "../loaders/logger";
const XLSX = require("node-xlsx");
const multiparty = require("multiparty");
import xlsx from "node-xlsx";
// 返回excel课程表上传模板文件
export async function getExcelTemplate(req: any, res: Response) {
  //startTime, endTime, weeks, campus, teacher1, teacher2, content, classes, classroom, updatePRPackage, remarks,auditions_num,age_range
  const data = [
    [
      "Date",
      "星期",
      "ClassTime",
      "classes",
      "teacher",
      "content",
      "classroom",
      "updatePRPackage",
      "remarks",
      "容纳试听人数",
      "年龄范围",
      "校区",
    ],
    [
      "2023/04/10",
      "1",
      "08:00 - 09:00",
      "班级",
      "外教 & 中教",
      "课程内容",
      "教室",
      "更新点读包",
      "备注",
      "3",
      "3 ~ 5",
      "校区名",
    ],
  ];
  const buffer = xlsx.build([{ name: "sheet1", data, options: {} }]);
  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + encodeURI("课程表模板.xlsx")
  );
  res.end(buffer, "binary");
}
const date2ms = (d) => {
  let date = new Date(Math.round((d - 25569) * 864e5));
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date;
};
// 用multiparty将上传的FormData数据格式解析成数据并插入mysql中
export async function uploadExcel(req: any, res: Response) {
  const form = new multiparty.Form();
  form.parse(req, async function (err: any, fields: any, files: any) {
    if (err) {
      Logger.error(err);
      await res.json({
        success: false,
        data: { message: "上传失败" },
      });
    } else {
      const { path } = files.file[0];
      const workSheetsFromFile = XLSX.parse(path);
      const data = workSheetsFromFile[0].data;
      const dataLength = data.length;
      try {
        for (let i = 1; i < dataLength; i++) {
          const Date1 = date2ms(data[i][0]);
          const weeks = data[i][1];
          const time = data[i][2].split("-");
          const startTimeStr = time[0].split(":");
          const endTimeStr = time[1].split(":");
          const startTime = new Date(
            Date1.getFullYear(),
            Date1.getMonth(),
            Date1.getDate(),
            startTimeStr[0],
            startTimeStr[1]
          ).getTime();
          const endTime = new Date(
            Date1.getFullYear(),
            Date1.getMonth(),
            Date1.getDate(),
            endTimeStr[0],
            endTimeStr[1]
          ).getTime();
          const classes = data[i][3];
          const teacher = data[i][4].split("&"); // 分为外教和中教，
          const teacher1 = teacher[1].trim() || "";
          const teacher2 = teacher[0].trim() || "";
          const content = data[i][5];
          const classroom = data[i][6];
          const updatePRPackage = data[i][7];
          const remarks = data[i][8];
          const auditions_num = data[i][9];
          const age_range = data[i][10];
          const campus = data[i][11];
          connection.query(
            `insert into schedules (startTime, endTime, weeks, campus, teacher1, teacher2, content, classes, classroom, updatePRPackage, remarks,auditions_num,age_range) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              startTime,
              endTime,
              weeks,
              campus,
              teacher1,
              teacher2,
              content,
              classes,
              classroom,
              updatePRPackage,
              remarks,
              auditions_num,
              age_range,
            ]
          );
        }
      } catch {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "课程添加失败" },
        });
      }
      res.send({
        success: true,
      });
    }
  });
};

// 将传过来的student_id和图片地址插入到contract表中
export async function uploadContract(req: any, res: Response) {
  const { student_id, img_url } = req.body;
    try {
        // 先查询是否有该学生的合同，有的话就更新，没有就插入
        connection.query(
            `select * from contract where student_id = ?`,
            [student_id],
            async function (err,result:any){
                if (err){
                    Logger.error(err);
                    await res.json({
                        success:false
                    })
                }else{
                    console.log(result);
                    if (result.length > 0){
                        connection.query(
                            `update contract set contract_img = ? where student_id = ?`,
                            [img_url, student_id],
                            async function (err,result){
                                if (err){
                                    Logger.error(err);
                                    await res.json({
                                        success:false
                                    })
                                }else{
                                    await res.json({
                                        success:true
                                    })
                                }
                            }
                        )
                    }else{
                        connection.query(
                            `insert into contract (student_id, contract_img) values (?,?)`,
                            [student_id, img_url],
                            async function (err){
                                if (err){
                                    Logger.error(err);
                                    await res.json({
                                        success:false
                                    })
                                }else{
                                    await res.json({
                                        success:true
                                    })
                                }
                            }
                        );
                    }
                }
            })
    }
    catch {
        await res.json({
            success: false,
            data: { message: "合同添加失败" },
        });
    }
}

// 将传过来的student_id去contract表拿到对应的图片地址
export async function getContract(req: any, res: Response) {
  const { student_id } = req.body;
    try {
        connection.query(
            `select contract_img from contract where student_id = ?`,
            [student_id],
            async function (err,result){
              if (err){
                Logger.error(err);
                await res.json({
                  success:false
                })
              }else{
                await res.json({
                  success:true,
                  data:result[0]
                })
              }
            }
        );
    }
    catch {
        await res.json({
            success: false,
            data: { message: "合同查询失败" },
        });
    }
}
