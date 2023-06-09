import {Response} from "express";
import {connection} from "../utils/mysql";
import Logger from "../loaders/logger";

export async function  addCampus(req: any, res: Response) {
    const {campus, address} = req.body;
    connection.query(
        `insert into campus(campus, address) values (?,?)`,
        [campus, address],
        async function (err) {
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "校区添加失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "校区添加成功" },
                });
            }
        }
    );
}

export async function searchCampus(req: any, res: Response) {
    // 如果req.auth.role是admin或者operator，就可以查看所有的校区
    if (req.auth.role === "admin" || req.auth.role === "operator") {
    connection.query(
        `select * from campus`,
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
    )}else{
        // 如果req.auth.role不是admin或者operator，就只能查看自己的校区
        connection.query(
            `select campus from users where phone_number = ?`,
            [req.auth.accountId],
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
}

export async function  editCampus(req: any, res: Response) {
    // 根据id进行删除,然后重新插入数据
    const { id ,campus="",address="" } = req.body;
    connection.query(
        `update campus set campus = ?, address = ? where id = ?`,
        [campus,address,id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "校区修改失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "校区修改成功" },
                });
            }
        }
    )
}

export async function  deleteCampus(req: any, res: Response) {
    const { id } = req.body;
    connection.query(
        `delete from campus where id = ?`,
        [id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "校区删除失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "校区删除成功" },
                });
            }
        }
    )
}
