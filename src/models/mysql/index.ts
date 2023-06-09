import Logger from "../../loaders/logger";
import {connection} from "../../utils/mysql";
import {createHash} from "crypto";

/** 创建用户表,当第一次初始化的时候会 */
const user =
  "CREATE TABLE if not EXISTS users(id int PRIMARY key auto_increment,username varchar(32),phone_number varchar(32),password varchar(32),campus varchar(32),status int DEFAULT 1,create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',role varchar(20))";

const haveUser = (options,callback) =>{
    // 在新增用户之前按应该首先查看是否有该username的用户这条数据，没有再插入
    connection.query(`select username from users where phone_number = ?`,[options.username],(err,result)=>{
        err ? Logger.error(err) : result[0] ? Logger.info(`${options.username}用户已存在`) : callback(options)
    })
}

/** 新增用户*/
const insertUser = (username,phone_number,password,role,campus = "") =>{
    // 应该首先查看是否有admin用户这条数据，没有再插入
    haveUser({username,phone_number,password,role,campus},({username,phone_number,password,role,campus}) =>{
        connection.query(`insert into users (username,phone_number,password,role,campus) values (?,?,?,?,?)`,[username,phone_number,createHash("md5").update(password).digest("hex"),role,campus],(err)=>{
            err ? Logger.error(err) : Logger.info(`${username}用户插入成功`);
        })
    })
}
/** 删除用户*/


/** 修改用户，会把username,*/


export { user,insertUser };
