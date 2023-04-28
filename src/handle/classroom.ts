import {Response} from "express";
import {connection} from "../utils/mysql";
import Logger from "../loaders/logger";

export async function  addClassRoom(req: any, res: Response) {
    const {campus , classroom} = req.body;
    connection.query(
        `select * from classroom where campus = ? and classroom = ?`,
        [campus,classroom],
        async function (err,result){
            // 如果没有找到相同的数据，才插入进去
            if (!result[0]){
                connection.query(
                    `insert into classroom(classroom,campus) values (?,?)`,
                    [classroom,campus],
                    async function (err) {
                        if (err) {
                            Logger.error(err);
                            await res.json({
                                success: false,
                                data: { message: "教室添加失败" },
                            });
                        } else {
                            await res.json({
                                success: true,
                                data: { message: "教室添加成功" },
                            });
                        }
                    }
                );
            }else{
                await res.json({
                    success: false,
                    data: { message: "不可添加重复的教室" },
                });
            }
        }
    )

}

export async function searchClassRoom(req: any, res: Response) {
    const {campus,classroom=""} = req.body;
    connection.query(
        `select * from classroom where campus = ? ${ classroom!== "" ? "and classroom regexp ?" : "" } order by create_time desc`,
        classroom!=""?[campus,classroom]:[campus],
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

export async function  editClassRoom(req: any, res: Response) {
    const { id , classroom , campus} = req.body;
    connection.query(
        `select * from classroom where campus = ? and classroom = ?`,
        [campus,classroom],
        async function (err,result){
            if (err){
                Logger.error(err);
                await res.json({
                    success:false
                })
            }
            // 如果没有找到相同的数据，才插入进去
            if (!result[0]){
                connection.query(
                    `update classroom set classroom = ?,campus = ? where id = ?`,
                    [classroom,campus,id],
                    async function (err){
                        if (err) {
                            Logger.error(err);
                            await res.json({
                                success: false,
                                data: { message: "教室修改失败" },
                            });
                        } else {
                            await res.json({
                                success: true,
                                data: { message: "教室修改成功" },
                            });
                        }
                    }
                )
            }else{
                await res.json({
                    success: false,
                    data: { message: "该教室已存在" },
                });
            }
        }
    )

}

export async function  deleteClassRoom(req: any, res: Response) {
    const { id } = req.body;
    connection.query(
        `delete from classroom where id = ?`,
        [id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "教室删除失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "教室删除成功" },
                });
            }
        }
    )
}
