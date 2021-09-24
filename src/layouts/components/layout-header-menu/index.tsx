import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
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

const { SubMenu } = Menu;

const LayoutHeaderMenu: React.FC<MenuProps> = (props) => {
  const { name, icon, menuData, onSelect } = props;

  const toPath = (name: string, path: string) => {
    onSelect(name, path);
  };

  const menuElementList = menuData
    .filter((item) => item.category === 2)
    .map((item, index) => {
      return item.authCode === 'organization-structure' ? (
        <SubMenu
          key={`headerMenuListItem_${index}`}
          className={styles.subMenu}
          title={
            <>
              <span className={styles.subMenuItem}>{item.name}</span>
            </>
          }
        >
          {item.children.map((ite) => {
            return (
              <Menu.Item onClick={() => toPath(ite.name, ite.url)}>
                <div>
                  {icon ? <span>{ite.icon}</span> : null}
                  <span>{ite.name}</span>
                </div>
              </Menu.Item>
            );
          })}
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

  const menuElement = <Menu>{menuElementList}</Menu>;

  return (
    <Dropdown overlay={menuElement} className="headerMenuItem">
      <div className={styles.layoutHeaderMenuItemContent}>
        <div>
          <div className={styles.layoutHeaderMenuItem}>
            <div className={styles.layoutHeaderMenuItemName}>
              {name}
              <CaretDownOutlined style={{ fontSize: '11px', marginLeft: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

export default LayoutHeaderMenu;
