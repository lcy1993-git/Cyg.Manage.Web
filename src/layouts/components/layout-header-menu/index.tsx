import { Dropdown, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React from 'react';
import styles from './index.less';

interface MenuItemParams {
  name: string;
  jurisdiction?: string;
  icon?: string;
  url: string;
  category: number;
  children: any[];
  authCode: string;
}

interface MenuProps {
  name: string;
  icon: string;
  menuData: MenuItemParams[];
  onSelect: (name: string, path: string) => void;
}

const LayoutHeaderMenu: React.FC<MenuProps> = (props) => {
  const { name, icon, menuData, onSelect } = props;

  const toPath = (name: string, path: string) => {
    onSelect(name, path);
  };

  // const subMenuList = menuData.map((item) => {
  //   item.children.map((ite: any, index: any) => {
  //     if (ite.category === 2) {
  //       console.log(ite);
  //       return (
  //         <SubMenu>
  //           <Menu.Item
  //             key={`headerMenuListItem_${index}`}
  //             onClick={() => toPath(ite.name, ite.url)}
  //           >
  //             {icon ? <span>{ite.icon}</span> : null}
  //             <span>{ite.name}</span>
  //           </Menu.Item>
  //         </SubMenu>
  //       );
  //     }
  //     return;
  //   });
  // });

  // console.log(subMenuList, '11');

  console.log(menuData);

  const menuElementList = menuData
    .filter((item) => item.category === 2)
    .map((item, index) => {
      return item.authCode === 'organization-structure' ? (
        <SubMenu key={`headerMenuListItem_${index}`} title={item.name}>
          <Menu.Item>
            {item.children.map((ite: any) => {
              return (
                <div>
                  {icon ? <span>{item.icon}</span> : null}
                  <span>{item.name}</span>
                </div>
              );
            })}
          </Menu.Item>
        </SubMenu>
      ) : (
        <Menu.Item key={`headerMenuListItem_${index}`} onClick={() => toPath(item.name, item.url)}>
          <div>
            {icon ? <span>{item.icon}</span> : null}
            <span>{item.name}</span>
          </div>
        </Menu.Item>
      );
    });
  // console.log(subMenuList, '三级');

  const menuElement = <Menu>{menuElementList}</Menu>;

  return (
    <div className={styles.layoutHeaderMenuItemContent}>
      <Dropdown overlay={menuElement} className="headerMenuItem">
        <div>
          <div className={styles.layoutHeaderMenuItem}>
            <div className={styles.layoutHeaderMenuItemName}>{name}</div>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default LayoutHeaderMenu;
