import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";


const FunctionModule = Loadable({ loader: () => import("@/pages/system-config/function-module"), loading: Loading, delay: 150 })
const CompanyManage = Loadable({ loader: () => import("@/pages/system-config/company-manage"), loading: Loading, delay: 150 })

export default [
    {
        title: "功能管理",
        path: "/system-config/function-module",
        component: <FunctionModule />
    },
    {
        title: "电力公司",
        path: "/system-config/company-manage",
        component: <CompanyManage />
    },
]