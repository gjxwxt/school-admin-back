import {Response} from "express";
import {connection} from "../utils/mysql";
import Logger from "../loaders/logger";

/**校区campus 名称 audition_name 年龄 audition_age 有无基础 audition_basics 试听人员其他备注 audition_info_others
 * 课程表id：schedule_id 负责对接 communicate_person 对接人员联系方式 communicate_person_contact
 * 信息来源 info_source 补充 info_others 是否到访 visited_or_not 访问次数 visited_count 是否签单 signed_or_not 签单课程id sign_schedule_id 登记日期 create_time */

/** 分表，主要是为了记录试听人员信息，用课程id与试听课表之间链接起来。 多个id代表多次访问，来区分多次访问*/
export async function  addAuditionTable(req: any, res: Response) {
    const {campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not = "未到访",visited_count,signed_or_not,sign_schedule_id="",after_schedule_signed="否",sign_class=""} = req.body;
    connection.query(
        `insert into audition_table(campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id,after_schedule_signed,sign_class) 
values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id,after_schedule_signed,sign_class],
        async function (err) {
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "试听课添加失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "试听课添加成功" },
                });
            }
        }
    );
}

// 增加访问次数的直接根据audition_id，和返回的schedule_id修改schedule_id
// export async function  addScheduleId(req: any, res: Response) {
//     // 根据id进行删除,然后重新插入数据
//     const { audition_id ,campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id="" } = req.body;
//     connection.query(
//         `update audition_table set campus = ?, audition_name = ?,audition_age = ?,audition_basics = ?,audition_info_others = ?,schedule_id = ?,communicate_person = ?,communicate_person_contact = ?,info_source = ?,info_others = ?,visited_or_not = ?,visited_count = ?,signed_or_not = ?,sign_schedule_id = ? where audition_id = ?`,
//         [campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id,audition_id],
//         async function (err){
//             if (err) {
//                 Logger.error(err);
//                 await res.json({
//                     success: false,
//                     data: { message: "试听人员修改失败" },
//                 });
//             } else {
//                 await res.json({
//                     success: true,
//                     data: { message: "试听人员修改成功" },
//                 });
//             }
//         }
//     )
// }

// 搜索试听表：查一周的
export async function searchAuditionTable(req: any, res: Response) {
    let { startDay,endDay,campus,page,name,ChoiceStatus } = req.body;
    let ChoiceStatusStr = '',startDayStr,nameStr,campusStr;
    if (ChoiceStatus && ChoiceStatus != "全部"){
        ChoiceStatusStr = ChoiceStatus == '当签' ? `and a.after_schedule_signed = "${ChoiceStatus}"` : ChoiceStatus.indexOf('到访') != -1 ? `and a.visited_or_not = "${ChoiceStatus}"` : `and a.signed_or_not = "${ChoiceStatus}"`
    }
    startDayStr = startDay ? `and s.startTime >= ${startDay} and s.endTime <= ${endDay} ` : '';
    nameStr = name ? `and a.audition_name regexp "${name}"` : '';
    campusStr = campus ? `and s.campus = "${campus}"` : '';
    page = (page-1)*7;
    // 两表联查，
    connection.query(
        "select count(*) as total from audition_table a,schedules s where a.schedule_id = s.id "+ campusStr + startDayStr + nameStr + ChoiceStatusStr,
        [startDay,endDay,campus],
        async function (err,resu){
            if (err){
                Logger.error(err);
            }else{
                connection.query(
                    "select a.audition_id,s.id as schedule_id,a.audition_name,a.audition_age,a.audition_basics,a.audition_info_others,s.classes,s.teacher1,s.teacher2,a.communicate_person,a.communicate_person_contact,a.info_source,a.info_others,a.visited_or_not,a.visited_count,a.signed_or_not,a.sign_class,a.after_schedule_signed,s.startTime,s.endTime,UNIX_TIMESTAMP(a.create_time)*1000 create_time from audition_table a,schedules s where a.schedule_id = s.id "+ campusStr + startDayStr + nameStr + ChoiceStatusStr +"ORDER BY s.startTime LIMIT "+ page +",7",
                    async function (err,result){
                        if (err){
                            Logger.error(err);
                            await res.json({
                                success:false
                            })
                        }else{
                            result[0] ? result[0].total = resu[0].total : "";
                            await res.json({
                                success:true,
                                data:result
                            })
                        }
                    }
                )
            }
        }
    )

}
/**校区campus 名称 audition_name 年龄 audition_age 有无基础 audition_basics 试听人员其他备注 audition_info_others
 * 课程表id：schedule_id 负责对接 communicate_person 对接人员联系方式 communicate_person_contact
 * 信息来源 info_source 补充 info_others 是否到访 visited_or_not 访问次数 visited_count 是否签单 signed_or_not 登记日期 create_time */

export async function  editAuditionTable(req: any, res: Response) {
    // 根据id进行删除,然后重新插入数据
    const { audition_id ,campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id="",after_schedule_signed="否",sign_class="" } = req.body;
    connection.query(
        `update audition_table set campus = ?, audition_name = ?,audition_age = ?,audition_basics = ?,audition_info_others = ?,schedule_id = ?,communicate_person = ?,communicate_person_contact = ?,info_source = ?,info_others = ?,visited_or_not = ?,visited_count = ?,signed_or_not = ?,sign_schedule_id = ?,after_schedule_signed = ?,sign_class = ? where audition_id = ?`,
        [campus,audition_name,audition_age,audition_basics,audition_info_others,schedule_id,communicate_person,communicate_person_contact,info_source,info_others,visited_or_not,visited_count,signed_or_not,sign_schedule_id,after_schedule_signed,sign_class,audition_id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "试听人员修改失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "试听人员修改成功" },
                });
            }
        }
    )
}

export async function  deleteAuditionTable(req: any, res: Response) {
    const { audition_id } = req.body;
    connection.query(
        `delete from audition_table where audition_id = ?`,
        [audition_id],
        async function (err){
            if (err) {
                Logger.error(err);
                await res.json({
                    success: false,
                    data: { message: "试听课删除失败" },
                });
            } else {
                await res.json({
                    success: true,
                    data: { message: "试听课删除成功" },
                });
            }
        }
    )
}

// 计算各种率
export async function countRatio(req: any, res: Response) {
    const { startDay,endDay,campus } = req.body;
    let order:any = [],visit:any = [],sign:any = [],afterSign:any = [];
    const search = async () => {
        return new Promise((resolve,reject)=>{
            connection.query(
                `SELECT schedule_id,count(*) as 'order',s.teacher1,s.teacher2 from audition_table a,schedules s where a.schedule_id = s.id and s.startTime >= ? and s.endTime <= ? and s.campus = ? GROUP BY schedule_id;`,
                [startDay,endDay,campus],
                async function (err,result){
                    if (err){
                        Logger.error(err);
                        await res.json({
                            success:false
                        })
                    }else{
                        order = result;
                        connection.query(
                            `SELECT schedule_id,count(*) as '到访次数' from audition_table a,schedules s where a.schedule_id = s.id and s.startTime >= ? and s.endTime <= ? and s.campus = ? and visited_or_not = '已到访' GROUP BY schedule_id;`,
                            [startDay,endDay,campus],
                            async function (err,result){
                                if (err){
                                    Logger.error(err);
                                    await res.json({
                                        success:false
                                    })
                                }else{
                                    visit = result;
                                    connection.query(
                                        `SELECT schedule_id,count(*) as '签单次数' from audition_table a,schedules s where a.schedule_id = s.id and s.startTime >= ? and s.endTime <= ? and s.campus = ? and signed_or_not = '已签单' GROUP BY schedule_id;`,
                                        [startDay,endDay,campus],
                                        async function (err,result){
                                            if (err){
                                                Logger.error(err);
                                                await res.json({
                                                    success:false
                                                })
                                            }else{
                                                sign = result;
                                                connection.query(
                                                    `SELECT schedule_id,count(*) as '当签次数' from audition_table a,schedules s where a.schedule_id = s.id and s.startTime >= ? and s.endTime <= ? and s.campus = ? and after_schedule_signed = '当签' GROUP BY schedule_id;`,
                                                    [startDay,endDay,campus],
                                                    async function (err,result){
                                                        if (err){
                                                            Logger.error(err);
                                                            await res.json({
                                                                success:false
                                                            })
                                                        }else{
                                                            afterSign = result;
                                                            resolve('success')
                                                        }
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            )
        })
    };
    search().then(()=>{
        // 对数据进行扁平化
        let dataAll:any = order;
        for (let i = 0; i < order.length; i++) {
            for (let j = 0; j < order.length; j++) {
               if(visit[j].schedule_id === order[i].schedule_id){
                   dataAll[i].visit = visit[j]['到访次数']
               }
               if (sign[j].schedule_id === order[i].schedule_id){
                   dataAll[i].sign = sign[j]['签单次数']
               }
               if (afterSign[j].schedule_id === order[i].schedule_id){
                   dataAll[i].afterSign = afterSign[j]['当签次数']
               }
            }
        }
         res.json({
            data:dataAll
        })
    })

}
