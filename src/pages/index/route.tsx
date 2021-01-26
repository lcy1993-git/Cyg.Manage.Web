import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";

const Index = Loadable({ loader: () => import("@/pages/index"), loading: Loading, delay: 150 })

export default [
    {
        title: "首页",
        path: "/index",
        component: <Index />
    },
]