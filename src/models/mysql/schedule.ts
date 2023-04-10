/** 创建课程表,当第一次初始化的时候会 */
/** 创建课程表，week:0~6代表星期几，campus表示哪个校区，startTime课程开始时间，endTime课程结束时间，class班级，teacher，content字符串，update更新点读包，remark*/
const schedule =
  "CREATE TABLE if not EXISTS schedules(id int PRIMARY key auto_increment,weeks int(5),campus varchar(32),startTime BIGINT NOT NULL,endTime BIGINT NOT NULL,teacher1 varchar(32),teacher2 varchar(32),content varchar(32),classes varchar(32),classroom varchar(32),updatePRPackage varchar(32),remarks varchar(32),auditions_num varchar(5),age_range varchar(20),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";

/** 创建校区表,当第一次初始化的时候会 */
/** 存储校区的详细信息，地址，电话， */
const campus =
    "CREATE TABLE if not EXISTS campus(id int PRIMARY key auto_increment,campus varchar(32),address varchar(255),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')"

/** 创建教室表 */
/** 记录教室名，用于下拉框进行选择班级*/
const classroom =
    "CREATE TABLE if not EXISTS classroom(id int PRIMARY key auto_increment,campus varchar(32),classroom varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')";


/** 创建教师表 */
/** 存储教师的详细信息teacher_id，姓名teacher_name， 性别teacher_gender，教师类别（分为中教和外教）teacher_category，联系方式teacher_contact，住址teacher_address，校区campus，备注others*/
const teachers =
    "CREATE TABLE if not EXISTS teachers(teacher_id int PRIMARY key auto_increment,teacher_name varchar(20) NOT NULL,teacher_gender enum('男','女') NOT NULL,teacher_category enum('中教','外教') NOT NULL,campus varchar(32) NOT NULL,teacher_address varchar(255),teacher_contact varchar(32),others varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')"


/** 创建班级， 一个是班级管理人员的表，一个是班级成员的表*/
/** classManage表 class_id  campus class_name  teacher1_name teacher1_contact teacher2_name teacher2_contact */
const classManage =
    "CREATE TABLE if not EXISTS classManage(class_id int PRIMARY key auto_increment,campus varchar(32),class_name varchar(20),teacher1_name varchar(20),teacher1_contact varchar(32),teacher2_name varchar(20),teacher2_contact varchar(32),create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')"

/** 创建试听表，先完善用户信息，然后选择课程, 就是为了存储试听数据的，方便计算当签率之类的 */
/**校区campus 名称audition_name 年龄audition_age 有无基础audition_basics 试听人员其他备注audition_info_others
 * 试听表schedule_id 多个id的字符串 负责对接communicate_person 对接人员联系方式communicate_person_contact
 * 信息来源info_source 补充info_others 是否到访visited_or_not 访问次数visited_count 是否签单signed_or_not 登记日期create_time
 * 签单id sign_schedule_id
 * */
const AuditionTable =
    "CREATE TABLE if not EXISTS audition_table(audition_id int PRIMARY key auto_increment,campus varchar(32) NOT NULL," +
    "audition_name varchar(20) NOT NULL,audition_age int(3),audition_basics varchar(32),audition_info_others varchar(50)," +
    "schedule_id varchar(20),communicate_person varchar(20),communicate_person_contact varchar(32),info_source varchar(32),info_others varchar(32)," +
    "visited_or_not enum('已到访','未到访'),visited_count int(2),signed_or_not enum('已签单','未签单'),after_schedule_signed enum('当签','否') COMMENT '是否当签',sign_schedule_id varchar(20),sign_class varchar(20)," +
    "create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间')"

/** 如何解决多次访问呢，可以单独把访问记录作为一个表，与试听表中的数据关联起来就行，当点击已签单的时候，显示出这个人试听课的数据，比如1：时间：班级，老师。，然后选择或者不选择
 * 某一条作为计入当签率的老师,
 * 时间，试听表id，中教，外教，访问详情（） */

export { schedule,campus,classroom,teachers,classManage,AuditionTable };
