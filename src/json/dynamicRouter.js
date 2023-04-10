module.exports = {
  code: 200,
  data: [
    {
      path: "/home/index",
      name: "home",
      component: "/home/index",
      meta: {
        icon: "HomeFilled",
        title: "首页",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: true,
        isKeepAlive: true,
      },
    },
    {
      path: "/dataScreen",
      name: "dataScreen",
      component: "/dataScreen/index",
      meta: {
        icon: "Histogram",
        title: "数据大屏",
        isLink: "",
        isHide: false,
        isFull: true,
        isAffix: false,
        isKeepAlive: true,
      },
    },
    {
      path: "/student_management",
      name: "student_management",
      component: "/student_management/index",
      meta: {
        icon: "Histogram",
        title: "学生管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
    },
    {
      path: "/class_management",
      name: "class_management",
      redirect: "/class_management/schedule_management",
      meta: {
        icon: "Histogram",
        title: "班级管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/class_management/classList_info",
          name: "classList_info",
          component: "/class_management/classList_info/index",
          meta: {
            icon: "Histogram",
            title: "班级列表",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/class_management/schedule_management",
          name: "schedule_management",
          component: "/class_management/schedule_management/index",
          meta: {
            icon: "Histogram",
            title: "课表管理",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/class_management/auditionlist_management",
          name: "auditionlist_management",
          component: "/class_management/auditionlist_management/index",
          meta: {
            icon: "Histogram",
            title: "试听课管理",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        }
      ],
    },
    {
      path: "/campus_management",
      name: "campus_management",
      component: "/campus_management/index",
      meta: {
        icon: "Histogram",
        title: "校区管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
    },
    {
      path: "/classroom_management",
      name: "classroom_management",
      redirect: "/classroom_management/classroom_list",
      meta: {
        icon: "Histogram",
        title: "教室管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/classroom_management/classroom_list",
          name: "classroom_list",
          component: "/classroom_management/classroom_list/index",
          meta: {
            icon: "Histogram",
            title: "教室列表",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/classroom_management/classroom_time",
          name: "classroom_time",
          component: "/classroom_management/classroom_time/index",
          meta: {
            icon: "Histogram",
            title: "教室安排时间查询",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/teacher_management",
      name: "teacher_management",
      component: "/teacher_management/index",
      meta: {
        icon: "Histogram",
        title: "教师管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
    },
    {
      path: "/proTable",
      name: "proTable",
      redirect: "/proTable/useProTable",
      meta: {
        icon: "MessageBox",
        title: "超级表格",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/proTable/useProTable",
          name: "useProTable",
          component: "/proTable/useProTable/index",
          meta: {
            icon: "Menu",
            title: "使用 ProTable",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
          children: [
            {
              path: "/proTable/useProTable/detail/:id",
              name: "useProTableDetail",
              component: "/proTable/useProTable/detail",
              meta: {
                icon: "Menu",
                title: "ProTable 详情",
                activeMenu: "/proTable/useProTable",
                isLink: "",
                isHide: true,
                isFull: false,
                isAffix: false,
                isKeepAlive: true,
              },
            },
          ],
        },
        {
          path: "/proTable/useTreeFilter",
          name: "useTreeFilter",
          component: "/proTable/useTreeFilter/index",
          meta: {
            icon: "Menu",
            title: "使用 TreeFilter",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/proTable/useTreeFilter/detail/:id",
          name: "useTreeFilterDetail",
          component: "/proTable/useTreeFilter/detail",
          meta: {
            icon: "Menu",
            title: "TreeFilter 详情",
            activeMenu: "/proTable/useTreeFilter",
            isLink: "",
            isHide: true,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/proTable/useSelectFilter",
          name: "useSelectFilter",
          component: "/proTable/useSelectFilter/index",
          meta: {
            icon: "Menu",
            title: "使用 SelectFilter",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/proTable/complexProTable",
          name: "complexProTable",
          component: "/proTable/complexProTable/index",
          meta: {
            icon: "Menu",
            title: "复杂 ProTable",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/proTable/document",
          name: "proTableDocument",
          component: "/proTable/document/index",
          meta: {
            icon: "Menu",
            title: "ProTable 文档",
            isLink: "https://juejin.cn/post/7166068828202336263/#heading-14",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/auth",
      name: "auth",
      redirect: "/auth/menu",
      meta: {
        icon: "Lock",
        title: "权限管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/auth/menu",
          name: "authMenu",
          component: "/auth/menu/index",
          meta: {
            icon: "Menu",
            title: "菜单权限",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/auth/button",
          name: "authButton",
          component: "/auth/button/index",
          meta: {
            icon: "Menu",
            title: "按钮权限",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/assembly",
      name: "assembly",
      redirect: "/assembly/guide",
      meta: {
        icon: "Briefcase",
        title: "常用组件",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/assembly/guide",
          name: "guide",
          component: "/assembly/guide/index",
          meta: {
            icon: "Menu",
            title: "引导页",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/selectIcon",
          name: "selectIcon",
          component: "/assembly/selectIcon/index",
          meta: {
            icon: "Menu",
            title: "图标选择器",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/selectFilter",
          name: "selectFilter",
          component: "/assembly/selectFilter/index",
          meta: {
            icon: "Menu",
            title: "分类筛选器",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/treeFilter",
          name: "treeFilter",
          component: "/assembly/treeFilter/index",
          meta: {
            icon: "Menu",
            title: "树形筛选器",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/svgIcon",
          name: "svgIcon",
          component: "/assembly/svgIcon/index",
          meta: {
            icon: "Menu",
            title: "SVG 图标",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/uploadFile",
          name: "uploadFile",
          component: "/assembly/uploadFile/index",
          meta: {
            icon: "Menu",
            title: "文件上传",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/batchImport",
          name: "batchImport",
          component: "/assembly/batchImport/index",
          meta: {
            icon: "Menu",
            title: "批量添加数据",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/wangEditor",
          name: "wangEditor",
          component: "/assembly/wangEditor/index",
          meta: {
            icon: "Menu",
            title: "富文本编辑器",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/assembly/draggable",
          name: "draggable",
          component: "/assembly/draggable/index",
          meta: {
            icon: "Menu",
            title: "拖拽组件",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/dashboard",
      name: "dashboard",
      redirect: "/dashboard/dataVisualize",
      meta: {
        icon: "Odometer",
        title: "Dashboard",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/dashboard/dataVisualize",
          name: "dataVisualize",
          component: "/dashboard/dataVisualize/index",
          meta: {
            icon: "Menu",
            title: "数据可视化",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/dashboard/embedded",
          name: "embedded",
          component: "/dashboard/embedded/index",
          meta: {
            icon: "Menu",
            title: "内嵌页面",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/form",
      name: "form",
      redirect: "/form/proForm",
      meta: {
        icon: "Tickets",
        title: "表单 Form",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/form/proForm",
          name: "proForm",
          component: "/form/proForm/index",
          meta: {
            icon: "Menu",
            title: "超级 Form",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/form/basicForm",
          name: "basicForm",
          component: "/form/basicForm/index",
          meta: {
            icon: "Menu",
            title: "基础 Form",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/form/validateForm",
          name: "validateForm",
          component: "/form/validateForm/index",
          meta: {
            icon: "Menu",
            title: "校验 Form",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/form/dynamicForm",
          name: "dynamicForm",
          component: "/form/dynamicForm/index",
          meta: {
            icon: "Menu",
            title: "动态 Form",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/echarts",
      name: "echarts",
      redirect: "/echarts/waterChart",
      meta: {
        icon: "TrendCharts",
        title: "Echarts",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/echarts/waterChart",
          name: "waterChart",
          component: "/echarts/waterChart/index",
          meta: {
            icon: "Menu",
            title: "水型图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/echarts/columnChart",
          name: "columnChart",
          component: "/echarts/columnChart/index",
          meta: {
            icon: "Menu",
            title: "柱状图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/echarts/lineChart",
          name: "lineChart",
          component: "/echarts/lineChart/index",
          meta: {
            icon: "Menu",
            title: "折线图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/echarts/pieChart",
          name: "pieChart",
          component: "/echarts/pieChart/index",
          meta: {
            icon: "Menu",
            title: "饼图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/echarts/radarChart",
          name: "radarChart",
          component: "/echarts/radarChart/index",
          meta: {
            icon: "Menu",
            title: "雷达图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/echarts/nestedChart",
          name: "nestedChart",
          component: "/echarts/nestedChart/index",
          meta: {
            icon: "Menu",
            title: "嵌套环形图",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/directives",
      name: "directives",
      redirect: "/directives/copyDirect",
      meta: {
        icon: "Stamp",
        title: "自定义指令",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/directives/copyDirect",
          name: "copyDirect",
          component: "/directives/copyDirect/index",
          meta: {
            icon: "Menu",
            title: "复制指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/directives/watermarkDirect",
          name: "watermarkDirect",
          component: "/directives/watermarkDirect/index",
          meta: {
            icon: "Menu",
            title: "水印指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/directives/dragDirect",
          name: "dragDirect",
          component: "/directives/dragDirect/index",
          meta: {
            icon: "Menu",
            title: "拖拽指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/directives/debounceDirect",
          name: "debounceDirect",
          component: "/directives/debounceDirect/index",
          meta: {
            icon: "Menu",
            title: "防抖指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/directives/throttleDirect",
          name: "throttleDirect",
          component: "/directives/throttleDirect/index",
          meta: {
            icon: "Menu",
            title: "节流指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/directives/longpressDirect",
          name: "longpressDirect",
          component: "/directives/longpressDirect/index",
          meta: {
            icon: "Menu",
            title: "长按指令",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/menu",
      name: "menu",
      redirect: "/menu/menu1",
      meta: {
        icon: "List",
        title: "菜单嵌套",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/menu/menu1",
          name: "menu1",
          component: "/menu/menu1/index",
          meta: {
            icon: "Menu",
            title: "菜单1",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/menu/menu2",
          name: "menu2",
          redirect: "/menu/menu2/menu21",
          meta: {
            icon: "Menu",
            title: "菜单2",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
          children: [
            {
              path: "/menu/menu2/menu21",
              name: "menu21",
              component: "/menu/menu2/menu21/index",
              meta: {
                icon: "Menu",
                title: "菜单2-1",
                isLink: "",
                isHide: false,
                isFull: false,
                isAffix: false,
                isKeepAlive: true,
              },
            },
            {
              path: "/menu/menu2/menu22",
              name: "menu22",
              redirect: "/menu/menu2/menu22/menu221",
              meta: {
                icon: "Menu",
                title: "菜单2-2",
                isLink: "",
                isHide: false,
                isFull: false,
                isAffix: false,
                isKeepAlive: true,
              },
              children: [
                {
                  path: "/menu/menu2/menu22/menu221",
                  name: "menu221",
                  component: "/menu/menu2/menu22/menu221/index",
                  meta: {
                    icon: "Menu",
                    title: "菜单2-2-1",
                    isLink: "",
                    isHide: false,
                    isFull: false,
                    isAffix: false,
                    isKeepAlive: true,
                  },
                },
                {
                  path: "/menu/menu2/menu22/menu222",
                  name: "menu222",
                  component: "/menu/menu2/menu22/menu222/index",
                  meta: {
                    icon: "Menu",
                    title: "菜单2-2-2",
                    isLink: "",
                    isHide: false,
                    isFull: false,
                    isAffix: false,
                    isKeepAlive: true,
                  },
                },
              ],
            },
            {
              path: "/menu/menu2/menu23",
              name: "menu23",
              component: "/menu/menu2/menu23/index",
              meta: {
                icon: "Menu",
                title: "菜单2-3",
                isLink: "",
                isHide: false,
                isFull: false,
                isAffix: false,
                isKeepAlive: true,
              },
            },
          ],
        },
        {
          path: "/menu/menu3",
          name: "menu3",
          component: "/menu/menu3/index",
          meta: {
            icon: "Menu",
            title: "菜单3",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
    {
      path: "/system",
      name: "system",
      redirect: "/system/accountManage",
      meta: {
        icon: "Tools",
        title: "系统管理",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
      children: [
        {
          path: "/system/accountManage",
          name: "accountManage",
          component: "/system/accountManage/index",
          meta: {
            icon: "Menu",
            title: "账号管理",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/system/roleManage",
          name: "roleManage",
          component: "/system/roleManage/index",
          meta: {
            icon: "Menu",
            title: "角色管理",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/system/departmentManage",
          name: "departmentManage",
          component: "/system/departmentManage/index",
          meta: {
            icon: "Menu",
            title: "部门管理",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
        {
          path: "/system/systemLog",
          name: "systemLog",
          component: "/system/systemLog/index",
          meta: {
            icon: "Menu",
            title: "系统日志",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
          },
        },
      ],
    },
  ],
  msg: "成功",
};
