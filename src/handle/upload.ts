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
      "classroom",
      "teacher",
      "content",
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
      "教室",
      "中教 & 外教(如果不写按默认设定老师记录)",
      "课程内容",
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
          const classroom = data[i][4];
          const teacher = data[i][5].split("&");
          const teacher1 = teacher[0];
          const teacher2 = teacher[1];
          const content = data[i][6];
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
}