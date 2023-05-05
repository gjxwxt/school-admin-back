import { Response } from "express";
import { connection } from "../utils/mysql";
import Logger from "../loaders/logger";

/** 存储学生的详细信息*/
export async function addStudent(req: any, res: Response) {
  //学生表,包括学生姓名 student_name、年龄 student_age、性别 、校区 campus、班级 class_id、班级名 class_name 、联系方式 student_contact 、来源 student_source、创建时间和更新时间、备注 remarks
  const {
    student_name,
    class_hour,
    student_age,
    class_id,
    class_name,
    student_contact = "",
    student_source = "",
    campus,
    remarks = "",
  } = req.body;
  connection.query(
    `insert into students(student_name, class_hour, init_class_hour, student_age, class_id, class_name, student_contact, student_source, campus, remarks) values (?,?,?,?,?,?,?,?,?,?)`,
    [
      student_name,
      class_hour,
      class_hour,
      student_age,
      class_id,
      class_name,
      student_contact,
      student_source,
      campus,
      remarks,
    ],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "学生信息添加失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "学生信息添加成功" },
        });
      }
    }
  );
}
/** 根据校区、班级、学生名搜索学生，校区必填，还要拿着class_id查询class_name呢*/
export async function searchStudent(req: any, res: Response) {
  let { campus, class_name = "", student_name = "", page } = req.body;
  let nameStr = student_name ? `and student_name regexp "${student_name}"` : "";
  // let campusStr = campus ? `and campus = "${campus}"` : '';
  let classesStr = class_name ? `and class_name regexp "${class_name}"` : "";
  page = (page - 1) * 7;
  connection.query(
    "select count(*) as total from students where campus = ? " +
      nameStr +
      classesStr +
      " and status = 1",
    [campus],
    async function (err, resu) {
      if (err) {
        Logger.error(err);
      } else {
        connection.query(
          "select * from students where campus = ? " +
            nameStr +
            classesStr +
            " and status = 1 order by create_time LIMIT " +
            page +
            ",7",
          [campus],
          async function (err, result) {
            if (err) {
              Logger.error(err);
              await res.json({
                success: false,
              });
            } else {
              result[0] ? (result[0].total = resu[0].total) : "";
              await res.json({
                success: true,
                data: result,
              });
            }
          }
        );
      }
    }
  );
}

// 根据class_id查询学生信息
export async function getStudentByClassId(req: any, res: Response) {
  const { class_id } = req.body;
  connection.query(
    `select * from students where class_id = ? and status = 1 order by create_time`,
    [class_id],
    async function (err, result) {
      if (err) {
        Logger.error(err);
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

// 根据class_name和campus查询学生信息
export function getStudentByClassName(req: any, res: Response) {
  const { class_name, campus } = req.body;
  connection.query(
    `select * from students where class_name = ? and campus = ? and status = 1 order by create_time`,
    [class_name, campus],
    function (err, result) {
      if (err) {
        Logger.error(err);
        res.json({
          success: false,
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

export async function editStudent(req: any, res: Response) {
  // 根据id进行删除,然后重新插入数据
  const {
    student_id,
    student_name,
    student_age,
    class_id,
    class_name,
    student_contact = "",
    student_source = "",
    campus,
    remarks = "",
  } = req.body;
  connection.query(
    `update students set student_name = ?, student_age = ?, class_id = ?, class_name = ?,student_contact = ?, student_source = ?, campus = ?, remarks = ? where student_id = ?`,
    [
      student_name,
      student_age,
      class_id,
      class_name,
      student_contact,
      student_source,
      campus,
      remarks,
      student_id,
    ],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "学生信息修改失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "学生信息修改成功" },
        });
      }
    }
  );
}

export async function deleteStudent(req: any, res: Response) {
  const { student_id } = req.body;
  connection.query(
    `update students set status = 0 where student_id = ?`,
    [student_id],
    async function (err) {
      if (err) {
        Logger.error(err);
        await res.json({
          success: false,
          data: { message: "学生信息删除失败" },
        });
      } else {
        await res.json({
          success: true,
          data: { message: "学生信息删除成功" },
        });
      }
    }
  );
}
