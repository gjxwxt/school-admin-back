import { Response } from "express";
import { connection } from "../utils/mysql";
import Logger from "../loaders/logger";
import { Message } from "../utils/enums";

export async function addNewsSchedule(req: any, res: Response) {
  const {
    startTime,
    endTime,
    weeks,
    campus,
    teacher1 = "",
    teacher2 = "",
    content = "",
    classes = "",
    class_id,
    classroom = "",
    updatePRPackage = "",
    remarks = "",
    auditions_num = "",
    age_range = "",
  } = req.body;
  connection.query(
    `insert into schedules (startTime, endTime, weeks, campus, teacher1, teacher2, content, classes, class_id, classroom, updatePRPackage, remarks,auditions_num,age_range) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      startTime,
      endTime,
      weeks,
      campus,
      teacher1,
      teacher2,
      content,
      classes,
      class_id,
      classroom,
      updatePRPackage,
      remarks,
      auditions_num,
      age_range,
    ],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "课程添加失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "课程添加成功" },
        });
      }
    }
  );
}
// 搜索出当天的课程，联查audition_table表，查出当前课程存在audition_table中的数量，连表条件是audition_table的schedule_id和schedules的id相等
export async function searchTodaySchedule(req: any, res: Response) {
  const { startDay, endDay, weeks, campus } = req.body;
  connection.query(
    `select *,(select count(*) from audition_table a GROUP BY schedule_id HAVING s.id = a.schedule_id) count from schedules s where startTime >= ? and endTime <= ? and weeks = ? and campus = ? ORDER BY startTime`,
    [startDay, endDay, weeks, campus],
    async function (err, result) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "课程查询失败" },
        });
      } else {
        await res.json({
          success: true,
          data: result,
        });
      }
    }
  );
}
export async function searchSchedule(req: any, res: Response) {
  const { startDay, endDay, weeks, campus } = req.body;
  connection.query(
    `select * from schedules where startTime >= ? and endTime <= ? and weeks = ? and campus = ? ORDER BY startTime`,
    [startDay, endDay, weeks, campus],
    async function (err, result) {
      if (err) {
        await res.json({
          success: false,
        });
      } else {
        await res.json({
          success: true,
          data: result,
        });
      }
    }
  );
}
export async function searchOneDaySchedule(req: any, res: Response) {
  const { startTime, endTime, campus } = req.body;
  connection.query(
    `select * from schedules where startTime >= ? and endTime <= ? and campus = ? ORDER BY startTime`,
    [startTime, endTime, campus],
    async function (err, result) {
      if (err) {
        await res.json({
          success: false,
        });
      } else {
        await res.json({
          success: true,
          data: result,
        });
      }
    }
  );
}

export async function searchWeekSchedule(req: any, res: Response) {
  const { startDay, endDay, campus } = req.body;
  connection.query(
    `select FROM_UNIXTIME(CONVERT(startTime,char)/1000,"%Y/%m/%d") as Date,weeks as "星期",CONCAT(FROM_UNIXTIME(CONVERT(startTime,char)/1000,"%H:%i")," - ",FROM_UNIXTIME(CONVERT(endTime,char)/1000,"%H:%i"))  as 'Class Time'
,classes as 'Class No.',CONCAT(teacher1," & ",teacher2) as Teacher, content as Content, classroom as Classroom, updatePRPackage as "更新点读包", remarks from schedules where startTime >= ? and endTime <= ? and campus = ? ORDER BY startTime`,
    [startDay, endDay, campus],
    async function (err, result) {
      if (err) {
        await res.json({
          success: false,
        });
      } else {
        await res.json({
          success: true,
          data: result,
        });
      }
    }
  );
}

export async function editSchedule(req: any, res: Response) {
  // 根据id进行删除,然后重新插入数据
  const {
    id,
    startTime,
    endTime,
    weeks,
    teacher1 = "",
    teacher2 = "",
    content = "",
    classes = "",
    class_id,
    classroom = "",
    updatePRPackage = "",
    remarks = "",
    auditions_num = "",
    age_range = "",
  } = req.body;
  connection.query(
    `update schedules set startTime = ?, endTime = ?, weeks = ?, teacher1 = ?, teacher2 = ?, 
content = ?, classes = ?, class_id = ?, classroom = ?, updatePRPackage = ?, remarks = ?, auditions_num = ?, age_range = ? where id = ?`,
    [
      startTime,
      endTime,
      weeks,
      teacher1,
      teacher2,
      content,
      classes,
      class_id,
      classroom,
      updatePRPackage,
      remarks,
      auditions_num,
      age_range,
      id,
    ],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "课程修改失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "课程修改成功" },
        });
      }
    }
  );
}

export async function deleteSchedule(req: any, res: Response) {
  const { id } = req.body;
  connection.query(
    `delete from schedules where id = ?`,
    [id],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "课程删除失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "课程删除成功" },
        });
      }
    }
  );
}

export async function useLastWeekSchedule(req: any, res: Response) {
  const { startDay, endDay, campus } = req.body;
  const batchInsert = async (res) => {
    for (let i = 0; i < res.length; i++) {
      res[i].startTime += 604800000;
      res[i].endTime += 604800000;
      await insertFun(res[i]);
    }
  };
  const insertFun = (res) => {
    const {
      startTime,
      endTime,
      weeks,
      campus,
      teacher1 = "",
      teacher2 = "",
      content = "",
      classes = "",
      class_id,
      classroom = "",
      updatePRPackage = "",
      remarks = "",
      auditions_num = "",
      age_range = "",
    } = res;
    connection.query(
      `insert into schedules (startTime, endTime, weeks, campus, teacher1, teacher2, content, classes, class_id, classroom, updatePRPackage, remarks, auditions_num, age_range) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        startTime,
        endTime,
        weeks,
        campus,
        teacher1,
        teacher2,
        content,
        classes,
        class_id,
        classroom,
        updatePRPackage,
        remarks,
        auditions_num,
        age_range,
      ]
    );
  };
  connection.query(
    `select * from schedules where startTime >= ? and endTime <= ? and campus = ? ORDER BY startTime`,
    [startDay - 604800000, endDay - 604800000, campus],
    async function (err, result) {
      if (err) {
        await res.json({
          success: false,
        });
      } else {
        await batchInsert(result);
        res.json({
          success: true,
        });
      }
    }
  );
}
