/** classManage 表 class_id  campus, class_name, teacher1_name, teacher1_contact, teacher2_name, teacher2_contact */

import {Response} from "express";
import {connection} from "../utils/mysql";
import Logger from "../loaders/logger";

export async function  addClassManage(req: any, res: Response) {
    const {campus, class_name, teacher1_name="", teacher1_contact="", teacher2_name="", teacher2_contact=""} = req.body;
    connection.query(
        `insert into classManage(campus, class_name, teacher1_name, teacher1_contact, teacher2_name, teacher2_contact) values (?,?,?,?,?,?)`,
        [campus, class_name, teacher1_name, teacher1_contact, teacher2_name, teacher2_contact],
        async function (err) {
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "班级添加失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "班级添加成功" },
                });
            }
        }
    );
}

export async function searchClassName(req: any, res: Response) {
    const { campus } = req.body;
    connection.query(
        `select class_id,class_name,teacher1_name,teacher2_name from classManage where campus = ? order by create_time desc`,
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

export async function searchClassManage(req: any, res: Response) {
    const { class_name="", campus } = req.body;
    connection.query(
        `select * from classManage where campus = ? ${ class_name!== "" ? "and class_name regexp ?" : "" }`,
        class_name!== "" ?[campus,class_name]:[campus],
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

export async function editClassManage(req: any, res: Response) {
    // 根据id进行删除,然后重新插入数据
    const {class_id,campus, class_name, teacher1_name="", teacher1_contact="", teacher2_name="", teacher2_contact=""} = req.body;
    connection.query(
        `update classManage set campus=?, class_name=?, teacher1_name=?, teacher1_contact=?, teacher2_name=?, teacher2_contact=? where class_id = ?`,
        [campus, class_name, teacher1_name, teacher1_contact, teacher2_name, teacher2_contact,class_id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "班级修改失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "班级修改成功" },
                });
            }
        }
    )
}

export async function deleteClassManage(req: any, res: Response) {
    const { class_id } = req.body;
    connection.query(
        `delete from classManage where class_id = ?`,
        [class_id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "班级删除失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "班级删除成功" },
                });
            }
        }
    )
}






