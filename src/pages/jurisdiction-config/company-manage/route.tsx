import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";


const CompanyManage = Loadable({ loader: () => import("@/pages/jurisdiction-config/company-manage"), loading: Loading, delay: 150 })


export default [
    {
        title: "电力公司",
        path: "/jurisdiction-config/company-manage",
        component: <CompanyManage />
    },
]