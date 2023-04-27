import app from "./app";
// import * as open from "open";
import config from "./config";
import * as dayjs from "dayjs";
import * as multer from "multer";
import { user } from "./models/mysql";
import {
  schedule,
  campus,
  teachers,
  classroom,
  AuditionTable,
  classManage,
  student,
  contract,
  classHour_operate,
} from "./models/mysql/schedule";
import Logger from "./loaders/logger";
import { queryTable, queryTableUser } from "./utils/mysql";
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(config.options);

queryTableUser(user);
queryTable(schedule);
queryTable(campus);
queryTable(classroom);
queryTable(teachers);
queryTable(classManage);
queryTable(AuditionTable);
queryTable(student);
queryTable(contract);
queryTable(classHour_operate);

import {
  login,
  register,
  getMenu,
  getButton,
  getUserList,
  epxortUsers,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  upload,
  captcha, editUser, changePassword,
} from "./handle/login";
import {
  addNewsSchedule,
  deleteSchedule,
  editSchedule,
  searchOneDaySchedule,
  searchTodaySchedule,
  searchWeekSchedule,
  useLastWeekSchedule,
} from "./handle/schedule";
import {
  addCampus,
  deleteCampus,
  editCampus,
  searchCampus,
} from "./handle/campus";
import {
  addTeacher,
  deleteTeacher,
  editTeacher,
  searchTeacher,
  searchTeacherByCategory,
} from "./handle/teachers";
import {
  addClassRoom,
  deleteClassRoom,
  editClassRoom,
  searchClassRoom,
} from "./handle/classroom";
import {
  addAuditionTable,
  countRatio,
  deleteAuditionTable,
  editAuditionTable,
  searchAuditionTable,
} from "./handle/AuditionTable";
import {
  addClassManage,
  deleteClassManage,
  editClassManage,
  searchClassManage,
  searchClassName,
} from "./handle/classMangage";
import { getExcelTemplate, uploadExcel } from "./handle/upload";
import {
  addStudent,
  deleteStudent,
  editStudent, getStudentByClassId,
  searchStudent,
} from "./handle/students";
import {operateClassHour, searchClassHourOperate} from "./handle/class_hour";

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/register", (req, res) => {
  register(req, res);
});

app.post("/changePassword", (req, res) => {
  changePassword(req, res);
});

app.post("/user/list", (req, res) => {
  getUserList(req, res);
});
// 编辑用户接口
app.post("/user/edit", (req, res) => {
  editUser(req, res);
});

app.post("/user/export", (req, res) => {
  epxortUsers(req, res);
});

app.get("/menu/list", (req, res) => {
  getMenu(req, res);
});

app.get("/auth/buttons", (req, res) => {
  getButton(req, res);
});

app.put("/updateList/:id", (req, res) => {
  updateList(req, res);
});

app.delete("/deleteList/:id", (req, res) => {
  deleteList(req, res);
});

app.post("/searchPage", (req, res) => {
  searchPage(req, res);
});

app.post("/searchVague", (req, res) => {
  searchVague(req, res);
});

// 课程相关
app.post("/schedule/addNews", (req, res) => {
  addNewsSchedule(req, res);
});
app.post("/schedule/search", (req, res) => {
  // searchSchedule(req, res);
  searchTodaySchedule(req, res);
});
app.post("/schedule/searchOneDay", (req, res) => {
  searchOneDaySchedule(req, res);
});
app.post("/schedule/edit", (req, res) => {
  editSchedule(req, res);
});
app.post("/schedule/delete", (req, res) => {
  deleteSchedule(req, res);
});
app.post("/schedule/batch", (req, res) => {
  useLastWeekSchedule(req, res);
});
app.post("/schedule/export", (req, res) => {
  searchWeekSchedule(req, res);
});
app.post("/schedule/getExcelTemplate", (req, res) => {
  getExcelTemplate(req, res);
});
app.post("/file/upload/excel", (req, res) => {
  uploadExcel(req, res);
});
//校区相关
app.post("/campus/addCampus", (req, res) => {
  addCampus(req, res);
});
app.post("/campus/search", (req, res) => {
  searchCampus(req, res);
});
app.post("/campus/edit", (req, res) => {
  editCampus(req, res);
});
app.post("/campus/delete", (req, res) => {
  deleteCampus(req, res);
});
// 教室相关
app.post("/classroom/add", (req, res) => {
  addClassRoom(req, res);
});
app.post("/classroom/search", (req, res) => {
  searchClassRoom(req, res);
});
app.post("/classroom/edit", (req, res) => {
  editClassRoom(req, res);
});
app.post("/classroom/delete", (req, res) => {
  deleteClassRoom(req, res);
});
// 教师相关
app.post("/teacher/add", (req, res) => {
  addTeacher(req, res);
});
app.post("/teacher/search", (req, res) => {
  searchTeacher(req, res);
});
app.post("/teacher/edit", (req, res) => {
  editTeacher(req, res);
});
app.post("/teacher/delete", (req, res) => {
  deleteTeacher(req, res);
});
app.post("/teacher/searchTeacherByCategory", (req, res) => {
  searchTeacherByCategory(req, res);
});
// 班级相关
app.post("/classManage/add", (req, res) => {
  addClassManage(req, res);
});
app.post("/classManage/search", (req, res) => {
  searchClassManage(req, res);
});
app.post("/classManage/searchName", (req, res) => {
  searchClassName(req, res);
});
app.post("/classManage/edit", (req, res) => {
  editClassManage(req, res);
});
app.post("/classManage/delete", (req, res) => {
  deleteClassManage(req, res);
});
// 课时相关
app.post("/classHour/operate", (req, res) => {
  operateClassHour(req, res);
});
app.post("/classHour/search", (req, res) => {
  searchClassHourOperate(req, res);
});
// 试听相关addAuditionTable
app.post("/auditiontable/add", (req, res) => {
  addAuditionTable(req, res);
});
app.post("/auditiontable/search", (req, res) => {
  searchAuditionTable(req, res);
});
app.post("/auditiontable/edit", (req, res) => {
  editAuditionTable(req, res);
});
app.post("/auditiontable/delete", (req, res) => {
  deleteAuditionTable(req, res);
});
app.post("/auditiontable/countRatio", (req, res) => {
  countRatio(req, res);
});
// 学生相关的table
app.post("/student/add", (req, res) => {
  addStudent(req, res);
});
app.post("/student/search", (req, res) => {
  searchStudent(req, res);
});
app.post("/student/edit", (req, res) => {
  editStudent(req, res);
});
app.post("/student/delete", (req, res) => {
  deleteStudent(req, res);
});
app.post("/student/getStudentByClassId", (req, res) => {
  getStudentByClassId(req, res);
});
// 新建存放临时文件的文件夹
const upload_tmp = multer({ dest: "upload_tmp/" });
app.post("/upload", upload_tmp.any(), (req, res) => {
  upload(req, res);
});

app.get("/captcha", (req, res) => {
  captcha(req, res);
});

app.ws("/socket", function (ws, req) {
  ws.send(
    `${dayjs(new Date()).format("YYYY年MM月DD日HH时mm分ss秒")}成功连接socket`
  );

  // 监听客户端是否关闭socket
  ws.on("close", function (msg) {
    console.log("客户端已关闭socket", msg);
    ws.close();
  });

  // 监听客户端发送的消息
  ws.on("message", function (msg) {
    // 如果客户端发送close，服务端主动关闭该socket
    if (msg === "close") ws.close();

    ws.send(
      `${dayjs(new Date()).format(
        "YYYY年MM月DD日HH时mm分ss秒"
      )}接收到客户端发送的信息，服务端返回信息：${msg}`
    );
  });
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: "无效的token" });
  }
  res.send({
    code: 500,
    msg: "服务器错误",
  });
});

app
  .listen(config.port, () => {
    Logger.info(`
    ################################################
    🛡️  Swagger文档地址: http://localhost:${config.port} 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    Logger.error(err);
    process.exit(1);
  });

// open(`http://localhost:${config.port}`); // 自动打开默认浏览器
