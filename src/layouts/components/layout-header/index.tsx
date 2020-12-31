import React, {useState} from "react";
import { Menu, Dropdown, Tabs } from "antd";
import { UserOutlined, EditOutlined, UserSwitchOutlined, LogoutOutlined } from "@ant-design/icons"
import styles from "./index.less";
import logoSrc from "@/assets/image/logo.png";
import headerSrc from "@/assets/image/header.jpg";
import LayoutHeaderMenu from "../layout-header-menu";
import {history} from "umi";

const {TabPane} = Tabs;

const testData = [
    {
        name: "工程项目管理",
        icon: "",
        menuData: [
            {
                name: "所有项目",
                icon: "",
                path: "/index"
            },
            {
                name: "统计图表",
                icon: "",
                path: "/login"
            },
            {
                name: "甘特图",
                icon: "",
                path: "/index?id=21"
            },
            {
                name: "可视化成果",
                icon: "",
                path: "/login?id=24"
            },
        ]
    },
    {
        name: "系统管理",
        icon: "",
        menuData: [
            {
                name: "基础数据",
                icon: "",
                path: "/all5"
            },
            {
                name: "系统模块",
                icon: "",
                path: "/all6"
            },
            {
                name: "功能模块",
                icon: "",
                path: "/all7"
            },
            {
                name: "字典管理",
                icon: "",
                path: "/all8"
            },
        ]
    }
]

interface HistoryRouteListItem {
    name: string
    path: string
    canDelete: boolean
}

const LayoutHeader: React.FC = () => {

    const myBaseInfoMenu = (
        <Menu>
            <Menu.Item>
                <span>
                    <UserOutlined />
                </span>
                <span>个人信息</span>
            </Menu.Item>
            <Menu.Item>
                <span>
                    <EditOutlined />
                </span>
                <span>密码修改</span>
            </Menu.Item>
            <Menu.Item>
                <span>
                    <UserSwitchOutlined />
                </span>
                <span>切换账号</span>
            </Menu.Item>
            <Menu.Item>
                <span>
                    <LogoutOutlined />
                </span>
                <span>安全退出</span>
            </Menu.Item>
        </Menu>
    )

    const menuSelectEvent = (name: string, path: string) => {
        history.push(path)
    }

    const menuContent = testData.map((item,index) => {
        return (
            <LayoutHeaderMenu key={`headerMenu_${index}`} onSelect={menuSelectEvent} name={item.name} icon={item.icon} menuData={item.menuData} />
        )
    })

    return (
        <div className={styles.layoutHeader}>
            <div className={styles.layoutHeaderContainer}>
                <div className={styles.layoutHeaderLogo}>
                    <img src={logoSrc} />
                </div>
                <div className={styles.layoutHeaderContent}>
                    {menuContent}
                </div>
                <div className={styles.layoutMyBaseInfo}>
                    <Dropdown overlay={myBaseInfoMenu}>
                        <div>
                            <div className={styles.myBaseInfo}>
                                <div>
                                    <img className={styles.layoutHeaderImage} src={headerSrc} />
                                </div>
                                <div className={styles.myBaseInfoWord}>
                                    <span>admin</span> <br />
                                    <span>平台管理员</span>
                                </div>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default LayoutHeader