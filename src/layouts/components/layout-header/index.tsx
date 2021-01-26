import React from "react";
import { Menu, Dropdown } from "antd";
import styles from "./index.less";
import logoSrc from "@/assets/image/logo.png";
import LayoutHeaderMenu from "../layout-header-menu";
import { history } from "umi";
import ImageIcon from "@/components/image-icon";
import headPortraitSrc from "@/assets/image/head-portrait.jpg"

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
            
        ]
    },
    {
        name: "系统管理",
        icon: "",
        menuData: [
            {
                name: "基础数据",
                icon: "",
                path: "/all"
            },
            
        ]
    },
    {
        name: "权限管理",
        icon: "",
        menuData: [
            {
                name: "基础数据",
                icon: "",
                path: "/all"
            },
            
        ]
    }
]

const LayoutHeader: React.FC = () => {
    // TODO 点击个人信息对应的一些方法都还么写
    const myBaseInfoMenu = (
        <Menu>
            <div className={styles.myNameContent}>
                zhangsongyun
            </div>
            <Menu.Item>
                <span className={styles.headerMenuIcon}>
                    <ImageIcon width={18} height={18} imgUrl="messager.png" />
                </span>
                <span>个人信息</span>
            </Menu.Item>
            <Menu.Item>
                <span className={styles.headerMenuIcon}>
                    <ImageIcon width={18} height={18} imgUrl="lack.png" />
                </span>
                <span>密码修改</span>
            </Menu.Item>
            <Menu.Item>
                <span className={styles.headerMenuIcon}>
                    <ImageIcon width={18} height={18} imgUrl="qiehuan.png" />
                </span>
                <span>切换账号</span>
            </Menu.Item>
            <Menu.Item>
                <span className={styles.headerMenuIcon}>
                    <ImageIcon width={18} height={18} imgUrl="out.png" />
                </span>
                <span>安全退出</span>
            </Menu.Item>
        </Menu>
    )

    const menuSelectEvent = (name: string, path: string) => {
        history.push(path)
    }
    // TODO 获取menu需要根据权限进行处理一下，没权限的不用展示出来
    const menuContent = testData.map((item, index) => {
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
                                <img className={styles.myHeadPortait} src={headPortraitSrc} />
                                <div className={styles.foldIcon}>
                                    <ImageIcon imgUrl="fold.png" width={8} height={8} />
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