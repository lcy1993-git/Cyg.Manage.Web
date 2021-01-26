import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";


const FunctionModule = Loadable({ loader: () => import("@/pages/system-config/function-module"), loading: Loading, delay: 150 })

export default [
    {
        title: "功能管理",
        path: "/system-config/function-module",
        component: <FunctionModule />
    },
]