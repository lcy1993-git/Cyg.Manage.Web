import React from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './index.less';
import logoSrc from '@/assets/image/logo.png';
import LayoutHeaderMenu from '../layout-header-menu';
import { history } from 'umi';
import ImageIcon from '@/components/image-icon';
import headPortraitSrc from '@/assets/image/head-portrait.jpg';

const testData = [
  {
    name: '系统管理',
    icon: '',
    menuData: [
      {
        name: '字典管理',
        icon: '',
        path: '/system-config/dictionary-manage',
      },
      {
        name: '功能管理',
        icon: '',
        path: '/system-config/function-module',
      },
      {
        name: '日志管理',
        icon: '',
        path: '/system-config/log-manage',
      },
    ],
  },
  {
    name: '权限管理',
    icon: '',
    menuData: [
      {
        name: '公司管理',
        icon: '',
        path: '/jurisdiction-config/company-manage',
      },
      {
        name: '平台角色',
        icon: '',
        path: '/jurisdiction-config/platform-role',
      },
      {
        name: '平台授权',
        icon: '',
        path: '/jurisdiction-config/platform-authorization',
      },
    ],
  },
  {
    name: '人员管理',
    icon: '',
    menuData: [
      {
        name: '管理用户',
        icon: '',
        path: '/personnel-config/manage-user',
      },
    ],
  },
];

const LayoutHeader: React.FC = () => {
  const loginOut = () => {
    history.push("/login");
    localStorage.setItem("Authorization", "")
  }

  // TODO 点击个人信息对应的一些方法都还么写
  const myBaseInfoMenu = (
    <Menu>
      <div className={styles.myNameContent}>zhangsongyun</div>
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
      <Menu.Item onClick={() => loginOut()}>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="out.png" />
        </span>
        <span>安全退出</span>
      </Menu.Item>
    </Menu>
  );

  const menuSelectEvent = (name: string, path: string) => {
    history.push(path);
  };
  // TODO 获取menu需要根据权限进行处理一下，没权限的不用展示出来
  const menuContent = testData.map((item, index) => {
    return (
      <LayoutHeaderMenu
        key={`headerMenu_${index}`}
        onSelect={menuSelectEvent}
        name={item.name}
        icon={item.icon}
        menuData={item.menuData}
      />
    );
  });

  return (
    <div className={styles.layoutHeader}>
      <div className={styles.layoutHeaderContainer}>
        <div className={styles.layoutHeaderLogo}>
          <img src={logoSrc} />
        </div>
        <div className={styles.layoutHeaderContent}>{menuContent}</div>

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
  );
};

export default LayoutHeader;
