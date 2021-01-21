
import { Dropdown, Menu } from "antd";
import React from "react";
import styles from "./index.less"

interface MenuItemParams {
    name: string
    jurisdiction?: string
    icon?: string
    path: string
}

interface MenuProps {
    name: string
    icon: string
    menuData: MenuItemParams[]
    onSelect: (name: string, path: string) => void
}

const LayoutHeaderMenu: React.FC<MenuProps> = (props) => {
    const { name, icon, menuData,onSelect } = props;

    const toPath = (name: string,path: string) => {
        onSelect(name,path)
    }

    const menuElementList = menuData.map((item,index) => {
        return (
            <Menu.Item key={`headerMenuListItem_${index}`} onClick={() => toPath(item.name,item.path)}>
                <div>
                    {icon ? <span>{item.icon}</span> : null}
                    <span>{item.name}</span>
                </div>
            </Menu.Item>
        )
    })

    const menuElement = (
        <Menu>
            {menuElementList}
        </Menu>
    )

    return (
        <div className={styles.layoutHeaderMenuItemContent}>
            <Dropdown overlay={menuElement} className="headerMenuItem">
                <div>
                    <div className={styles.layoutHeaderMenuItem}>
                        <div className={styles.layoutHeaderMenuItemName}>
                            {name}
                        </div>
                    </div>
                </div>
            </Dropdown>
        </div>
    )
}

export default LayoutHeaderMenu