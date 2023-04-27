import {Response} from "express";
import {connection} from "../utils/mysql";
import Logger from "../loaders/logger";

/** 存储教师的详细信息teacher_id，姓名teacher_name， 性别teacher_gender，教师类别（分为中教和外教）teacher_category，联系方式teacher_contact，住址teacher_address，校区campus，备注others*/
export async function  addTeacher(req: any, res: Response) {
    const {teacher_name, teacher_gender, teacher_category, teacher_contact="", teacher_address="", campus, others=""} = req.body;
    connection.query(
        `insert into teachers(teacher_name, teacher_gender, teacher_category, teacher_contact, teacher_address, campus, others) values (?,?,?,?,?,?,?)`,
        [teacher_name, teacher_gender, teacher_category, teacher_contact, teacher_address, campus, others],
        async function (err) {
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "教师信息添加失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "教师信息添加成功" },
                });
            }
        }
    );
}
/** 根据校区和搜索老师 */
export async function searchTeacher(req: any, res: Response) {
    const { campus, type = "" } = req.body;
    connection.query(
        `select * from teachers where campus = ? ${ type !== "" ? type == 1 ? "and teacher_category = '中教'" : "and teacher_category = '外教'":"" }`,
        [campus],
        async function (err,result){
            if (err){
                Logger.error(err);
                await res.json({
                    success:false
                })
            }else{
                await res.json({
                    success:true,
                    data:result
                })
            }
        }
    )
}
/** 根据教师类别搜索老师 */
export async function searchTeacherByCategory(req: any, res: Response) {
    const { teacher_category, campus } = req.body;
    connection.query(
        `select * from teachers where teacher_category = ? and campus = ?`,
        [teacher_category, campus],
        async function (err,result){
            if (err){
                Logger.error(err);
                await res.json({
                    success:false
                })
            }else{
                await res.json({
                    success:true,
                    data:result
                })
            }
        }
    )
}

export async function  editTeacher(req: any, res: Response) {
    // 根据id进行删除,然后重新插入数据
    const { teacher_id ,teacher_name, teacher_gender, teacher_category, teacher_contact="", teacher_address="", campus, others=""} = req.body;
    connection.query(
        `update teachers set teacher_name = ?, teacher_gender = ?, teacher_category = ?, teacher_contact = ?, teacher_address = ?, campus = ?, others = ? where teacher_id = ?`,
        [teacher_name, teacher_gender, teacher_category, teacher_contact, teacher_address, campus, others, teacher_id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "教师信息修改失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "教师信息修改成功" },
                });
            }
        }
    )
}

export async function  deleteTeacher(req: any, res: Response) {
    const { id } = req.body;
    connection.query(
        `delete from teachers where id = ?`,
        [id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "教师信息删除失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "教师信息删除成功" },
                });
            }
        }
    )
}
