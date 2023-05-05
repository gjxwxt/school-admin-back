/** 创建课程表,当第一次初始化的时候会 */
/** 创建课程表，week:0~6代表星期几，campus表示哪个校区，startTime课程开始时间，endTime课程结束时间，class班级，teacher，content字符串，update更新点读包，remark*/
const schedule =
  "CREATE TABLE if not EXISTS schedules(id int PRIMARY key auto_increment,weeks int(5),campus varchar(32),startTime BIGINT NOT NULL,endTime BIGINT NOT NULL,teacher1 varchar(32),teacher2 varchar(32),content varchar(32),classes varchar(32),class_id int,classroom varchar(32),updatePRPackage varchar(32),remarks varchar(32),auditions_num varchar(5),age_range varchar(20),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建校区表,当第一次初始化的时候会 */
/** 存储校区的详细信息，地址，电话， */
const campus =
  "CREATE TABLE if not EXISTS campus(id int PRIMARY key auto_increment,campus varchar(32),address varchar(255),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建教室表 */
/** 记录教室名，用于下拉框进行选择班级*/
const classroom =
  "CREATE TABLE if not EXISTS classroom(id int PRIMARY key auto_increment,campus varchar(32),classroom varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建教师表 */
/** 存储教师的详细信息teacher_id，姓名teacher_name， 性别teacher_gender，教师类别（分为中教和外教）teacher_category，联系方式teacher_contact，住址teacher_address，校区campus，备注others*/
const teachers =
  "CREATE TABLE if not EXISTS teachers(teacher_id int PRIMARY key auto_increment,teacher_name varchar(20) NOT NULL,teacher_gender enum('男','女') NOT NULL,teacher_category enum('中教','外教') NOT NULL,campus varchar(32) NOT NULL,teacher_address varchar(255),teacher_contact varchar(32),others varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建班级， 一个是班级管理人员的表，一个是班级成员的表*/
/** classManage表 class_id  campus class_name  teacher1_name teacher1_contact teacher2_name teacher2_contact */
const classManage =
  "CREATE TABLE if not EXISTS classManage(class_id int PRIMARY key auto_increment,campus varchar(32),class_name varchar(20),teacher1_name varchar(20),teacher1_contact varchar(32),teacher2_name varchar(20),teacher2_contact varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建试听表，先完善用户信息，然后选择课程, 就是为了存储试听数据的，方便计算当签率之类的 */
/**校区campus 名称audition_name 年龄audition_age 有无基础audition_basics 试听人员其他备注audition_info_others
 * 试听表schedule_id 多个id的字符串 负责对接communicate_person 对接人员联系方式communicate_person_contact
 * 信息来源info_source 补充info_others 是否到访visited_or_not 访问次数visited_count 是否签单signed_or_not 登记日期create_time
 * 签单id sign_schedule_id 签单班级sign_class
 * */
const AuditionTable =
  "CREATE TABLE if not EXISTS audition_table(audition_id int PRIMARY key auto_increment,campus varchar(32) NOT NULL," +
  "audition_name varchar(20) NOT NULL,audition_age int(3),audition_basics varchar(32),audition_info_others varchar(50)," +
  "schedule_id varchar(20),communicate_person varchar(20),communicate_person_contact varchar(32),info_source varchar(32),info_others varchar(32)," +
  "visited_or_not enum('已到访','未到访'),visited_count int(2),signed_or_not enum('已签单','未签单'),after_schedule_signed enum('当签','否') COMMENT '是否当签',sign_schedule_id varchar(20),sign_class varchar(20)," +
  "create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/**
 * 创建学生表,包括学生姓名 student_name、年龄 student_age、校区 campus、班级 classes_id、课时 class_hour 、联系方式 student_contact 、来源 student_source、签订合同的话直接往合同表里插入学员id、创建时间和更新时间、备注remarks
 */
const student =
  "CREATE TABLE if not EXISTS students(student_id int PRIMARY key auto_increment,class_hour decimal(5,2) NOT NULL,init_class_hour decimal(5,2) NOT NULL,student_name varchar(20) NOT NULL,campus varchar(32) NOT NULL,student_age varchar(10),class_id int,class_name varchar(20),student_contact varchar(20),student_source varchar(20),remarks varchar(32),status int NOT NULL DEFAULT 1,create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

// 创建一个专门存贮合同图片的表，包括合同id，图片二进制，学员id，创建时间，更新时间
const contract =
  "CREATE TABLE if not EXISTS contract(contract_id int PRIMARY key auto_increment,contract_img varchar(255),student_id int,create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

// 对课时的操作，需要记录下操作人，操作时间，课程id，学生id，学生姓名，操作类型（扣还是加），操作数量（扣/加了多少），操作前课时，操作后课时，备注
// 创建一个表，参数是class_id, student_id, student_name, type, operate_num, before_class_hour, remarks, operator
const classHour_operate =
  "CREATE TABLE if not EXISTS class_hour_operate(operation_id int PRIMARY key auto_increment,campus varchar(32),class_id int,class_name varchar(20),student_id int,student_name varchar(20),type int,operate_num float,before_class_hour decimal(5,2),after_class_hour decimal(5,2),remarks varchar(32),operator varchar(20),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

export {
  schedule,
  campus,
  classroom,
  teachers,
  classManage,
  AuditionTable,
  student,
  contract,
  classHour_operate,
};
