import * as fs from "fs";
import secret from "../config";
import * as mysql from "mysql2";
import * as jwt from "jsonwebtoken";
import { createHash } from "crypto";
import Logger from "../loaders/logger";
import { Message } from "../utils/enums";
import getFormatDate from "../utils/date";
import { connection } from "../utils/mysql";
import { Request, Response } from "express";
import { createMathExpr } from "svg-captcha";
import * as path from "path";
import { error } from "winston";
import { getIdentityMenu } from "../utils/identity";
const authButtons = require("../json/authButtons");
const operator = require("../json/operator");

const utils = require("@pureadmin/utils");

/** 保存验证码 */
let generateVerify: number;

/** 过期时间 单位：毫秒 默认 24h分钟过期，方便演示 */
let expiresIn = 86400000;

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

// /**
//  * @typedef Login
//  * @property {string} username.required - 用户名 - eg: admin
//  * @property {string} password.required - 密码 - eg: admin123
//  * @property {integer} verify.required - 验证码
//  */

/**
 * @typedef Login
 * @property {string} username.required - 用户名 - eg: admin
 * @property {string} password.required - 密码 - eg: admin123
 */

/**
 * @route POST /login
 * @param {Login.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 登录
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Login>} Login
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
  /** 登录传进来的一定是md5加密过的数据*/
  const { username, password } = req.body;
  let sql: string =
    "select * from users where status = 1 and phone_number=" + "'" + username + "'";
  connection.query(sql, async function (err, data: any) {
    if (err){
      Logger.error(err);
      await res.json({
        success:false
      })
    }
    /** 没找到登陆时输入的用户*/
    if (data.length == 0) {
      await res.json({
        code: 500,
        success: false,
        msg: "当前用户名未注册",
        data: { message: Message[1] },
      });
    } else {
      if (
        /** 因为前端传过来的就是md5加密过的密码，所以验证不需要解密，如果密码和数据库中的md5加密过的数据相同，即登陆成功*/
        password == data[0].password
      ) {
        const accessToken = jwt.sign(
          {
            accountId: data[0].phone_number,
            role: data[0].role,
          },
          secret.jwtSecret,
          { expiresIn }
        );
        await res.json({
          success: true,
          data: {
            message: Message[2],
            access_token: accessToken,
            role: data[0].role,
            phone_number: data[0].phone_number,
            username: data[0].username,
            // 这里模拟刷新token，根据自己需求修改
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expires: new Date(new Date()).getTime() + expiresIn,
          },
        });
      } else {
        /** 密码错误 */
        await res.json({
          code: 500,
          success: false,
          msg: "密码错误",
          data: { message: Message[3] },
        });
      }
    }
  });
};

// /**
//  * @typedef Register
//  * @property {string} username.required - 用户名
//  * @property {string} password.required - 密码
//  * @property {integer} verify.required - 验证码
//  */
/**
 * @typedef Register
 * @property {string} username.required - 用户名
 * @property {string} password.required - 密码
 */

/**
 * @route POST /register
 * @param {Register.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 注册
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Register>} Register
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const register = async (req: Request, res: Response) => {
  const { username,phone_number, password, role, campus = "" } = req.body;
  /** 如果密码长度小于6*/
  if (password.length < 6)
    return res.json({
      success: false,
      data: { message: Message[4] },
    });
  /** 看看username是否被注册了*/
  let sql: string =
    "select * from users where phone_number=" + "'" + phone_number + "'";
  connection.query(sql, async (err, data: any) => {
    if (data.length > 0) {
      await res.json({
        success: false,
        data: { message: Message[5] },
      });
    } else {
      /** 没人注册且密码长度>6时进行注册，判断前端传过来的数据是不是md5加密过的，所以直接存入数据库*/
      let sql: string = `insert into users (username,phone_number,password,role,campus) value (?,?,?,?,?)`;
      let newPassword =
        password.length >= 32
          ? password
          : createHash("md5").update(password).digest("hex");
      connection.query(
        sql,
        [username, phone_number, newPassword, role, campus],
        async function (err) {
          if (err) {
            Logger.error(err);
          } else {
            await res.json({
              success: true,
              data: { message: Message[6] },
            });
          }
        }
      );
    }
  });
};

// 修改用户密码
const changePassword = async (req: any, res: Response) => {
    let { oldPassword, newPassword } = req.body;
    oldPassword =
        oldPassword.length >= 32
            ? oldPassword
            : createHash("md5").update(oldPassword).digest("hex");
    let phone_number = req.auth.accountId;
    // 首先判断旧密码是否正确
    let sql: string = `select * from users where phone_number = ?`;
    connection.query(sql, [phone_number], async function (err, data: any) {
        if (err) {
            Logger.error(err);
            res.json({
              success: false,
              data: { message: "操作失败" },
            })
        } else {
            if (data.length > 0) {
                if (data[0].password == oldPassword) {
                    // 旧密码正确，修改密码
                    await updatePassword(newPassword, phone_number, res);
                } else {
                    // 旧密码错误
                    await res.json({
                      success: false,
                      data: { message: "旧密码错误" },
                    });
                }
            } else {
                await res.json({
                  success: false,
                  data: { message: "操作失败" },
                });
            }
        };
    });
};

// 修改密码
const updatePassword = async (password: string, phone_number: string, res: Response) => {
  let sql: string = `update users set password = ? where phone_number = ?`;
  let newPassword =
      password.length >= 32
          ? password
          : createHash("md5").update(password).digest("hex");
  connection.query(sql, [newPassword, phone_number], async function (err) {
    if (err) {
      Logger.error(err);
      res.json({
        success: false,
        data: { message: "操作失败" },
      })
    } else {
      await res.json({
        success: true,
        data: { message: "操作成功" },
      });
    }
  });
};

// 获取菜单列表，根据登录人员的身份返回数据。后面的接口中可以根据token来判断身份，进而返回不同内容
const getMenu = async (req: any, res: Response) => {
  let identity = req.auth.role;
    // 不同身份的人返回不同的路由页面
  res.send(await getIdentityMenu(identity));
};
const getButton = async (req: any, res: Response) => {
  let identity = req.auth.role;
  let file: {};
  switch (identity){
    case 'admin':
      file = authButtons;
      break;
    case 'operator':
      file = operator;
      break;
    case 'campus_admin':
      file = authButtons;
      break;
    case 'campus_operator':
      file = operator;
      break;
    default:
      file = operator;
  };
  res.send(file);
};

const getUserList = async (req: Request, res: Response) => {
    let { page, campus = "", username = "" } = req.body;
    page = (page-1)*7;
    // 先获取到所有用户的数量，之后根据分页获取用户列表、
    connection.query(`select count(*) as total from users where campus like '%${campus}%' ${username ? `and username like '%${username}%'` : ''}`, async function (err, resu: any) {
        if (err) {
            Logger.error(err);
        } else {
          let sql: string = `select * from users where campus like '%${campus}%' ${username ? `and username like '%${username}%'` : ''} order by create_time desc limit ${page},7`;
          connection.query(sql, async function (err, result: any) {
            if (err) {
              Logger.error(err);
            } else {
              result[0] ? result[0].total = resu[0].total : "";
              await res.json({
                code: 200,
                success: true,
                data: result
              });
            }
          })
        }
    })
};

// 编辑用户详情
const editUser = async (req: Request, res: Response) => {
  const {id,username, phone_number, role, campus = "", status = 1} = req.body;
  /** 看看username是否被注册了*/
  let sql: string =
      "select id from users where phone_number=" + "'" + phone_number + "'";
  connection.query(sql, async (err, data: any) => {
    if (data[0].id !== id) {
      await res.json({
        success: false,
        data: {message: Message[5]},
      });
    } else {
        let sql = `update users set username=?,phone_number=?,role=?,campus=?,status=? where id=?`;
        connection.query(sql, [username, phone_number, role, campus,status, id], async function (err) {
          if (err) {
            Logger.error(err);
          } else {
            await res.json({
              success: true,
              data: {message: Message[6]},
            });
          }
        });
    }
  })
};

// 有个注意的点就是，尽量不要层级太深，非得user.detail.age才能拿到age
const epxortUsers = async (req, res) => {
  let arr = [
    {
      id: "568668428175172767",
      username: "陆娟",
      gender: 2,
      user: {
        detail: {
          age: 26,
        },
      },
      idCard: "568668428175172767",
      email: "t.lxmxre@crsspeoqg.td",
      address: "云南省 楚雄彝族自治州",
      createTime: "2019-08-22 06:09:02",
      status: 0,
      avatar: "https://i.imgtg.com/2023/01/16/QRBHS.jpg",
    },
    {
      id: "568668428175172767",
      username: "陆娟",
      gender: 2,
      user: {
        detail: {
          age: 26,
        },
      },
      idCard: "568668428175172767",
      email: "t.lxmxre@crsspeoqg.td",
      address: "云南省 楚雄彝族自治州",
      createTime: "2019-08-22 06:09:02",
      status: 0,
      avatar: "https://i.imgtg.com/2023/01/16/QRBHS.jpg",
    },
  ];
  res.send(arr);
};

/**
 * @typedef UpdateList
 * @property {string} username.required - 用户名 - eg: admin
 */

/**
 * @route PUT /updateList/{id}
 * @summary 列表更新
 * @param {UpdateList.model} point.body.required - 用户名
 * @param {UpdateList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<UpdateList>} UpdateList
 * @security JWT
 */

const updateList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  let modifySql: string = "UPDATE users SET username = ? WHERE id = ?";
  let sql: string = "select * from users where id=" + id;
  connection.query(sql, function (err, data) {
    connection.query(sql, function (err) {
      if (err) {
        Logger.error(err);
      } else {
        let modifyParams: string[] = [username, id];
        // 改
        connection.query(modifySql, modifyParams, async function (err, result) {
          if (err) {
            Logger.error(err);
          } else {
            await res.json({
              success: true,
              data: { message: Message[7] },
            });
          }
        });
      }
    });
  });
};

/**
 * @typedef DeleteList
 * @property {integer} id.required - 当前id
 */

/**
 * @route DELETE /deleteList/{id}
 * @summary 列表删除
 * @param {DeleteList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<DeleteList>} DeleteList
 * @security JWT
 */

const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  let sql: string = "DELETE FROM users where id=" + "'" + id + "'";
  connection.query(sql, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      await res.json({
        success: true,
        data: { message: Message[8] },
      });
    }
  });
};

/**
 * @typedef SearchPage
 * @property {integer} page.required - 第几页 - eg: 1
 * @property {integer} size.required - 数据量（条）- eg: 5
 */

/**
 * @route POST /searchPage
 * @param {SearchPage.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 分页查询
 * @group 用户管理相关
 * @returns {Response.model} 200
 * @returns {Array.<SearchPage>} SearchPage
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const searchPage = async (req: Request, res: Response) => {
  const { page, size } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  let sql: string =
    "select * from users limit " + size + " offset " + size * (page - 1);
  connection.query(sql, async function (err, data) {
    if (err) {
      Logger.error(err);
    } else {
      await res.json({
        success: true,
        data,
      });
    }
  });
};

/**
 * @typedef SearchVague
 * @property {string} username.required - 用户名  - eg: admin
 */

/**
 * @route POST /searchVague
 * @param {SearchVague.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 模糊查询
 * @group 用户管理相关
 * @returns {Response.model} 200
 * @returns {Array.<SearchVague>} SearchVague
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const searchVague = async (req: Request, res: Response) => {
  const { username } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  if (username === "" || username === null)
    return res.json({
      success: false,
      data: { message: Message[9] },
    });
  let sql: string = "select * from users";
  sql += " WHERE username LIKE " + mysql.escape("%" + username + "%");
  connection.query(sql, function (err, data) {
    connection.query(sql, async function (err) {
      if (err) {
        Logger.error(err);
      } else {
        await res.json({
          success: true,
          data,
        });
      }
    });
  });
};

// express-swagger-generator中没有文件上传文档写法，所以请使用postman调试
const upload = async (req: Request, res: Response) => {
  // 文件存放地址
  const des_file: any = (index: number) =>
    "./public/files/" + req.files[index].originalname;
  let filesLength = req.files.length as number;
  let result = [];

  function asyncUpload() {
    return new Promise((resolve, rejects) => {
      (req.files as Array<any>).forEach((ev, index) => {
        fs.readFile(req.files[index].path, function (err, data) {
          fs.writeFile(des_file(index), data, function (err) {
            if (err) {
              rejects(err);
            } else {
              while (filesLength > 0) {
                result.push({
                  filename: req.files[filesLength - 1].originalname,
                  filepath: utils.getAbsolutePath(des_file(filesLength - 1)),
                  fileUrl: "/files/" + req.files[filesLength - 1].originalname,
                });
                filesLength--;
              }
              if (filesLength === 0) resolve(result);
            }
          });
        });
      });
    });
  }

  asyncUpload()
    .then((fileList) => {
      res.json({
        success: true,
        data: {
          message: Message[11],
          fileList,
        },
      });
    })
    .catch((err) => {
      Logger.error(err);
      res.json({
        success: false,
        data: {
          message: Message[10],
          fileList: [],
        },
      });
    });
};

/**
 * @route GET /captcha
 * @summary 图形验证码
 * @group captcha - 图形验证码
 * @returns {object} 200
 */

const captcha = async (req: Request, res: Response) => {
  const create = createMathExpr({
    mathMin: 1,
    mathMax: 4,
    mathOperator: "+",
  });
  generateVerify = Number(create.text);
  res.type("svg"); // 响应的类型
  res.json({ success: true, data: { text: create.text, svg: create.data } });
};

export {
  login,
  register,
  changePassword,
  getMenu,
  getButton,
  getUserList,
  editUser,
  epxortUsers,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  upload,
  captcha,
};
