import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './index.less';
import logoSrc from '@/assets/image/logo.png';
import LayoutHeaderMenu from '../layout-header-menu';
import { history } from 'umi';
import ImageIcon from '@/components/image-icon';
import headPortraitSrc from '@/assets/image/head-portrait.jpg';
import { signOut } from '@/services/login';
import EditPassword from '../edit-password';
import CutAccount from '../cut-account';
import { useGetUserInfo } from '@/utils/hooks';

const testData = [
  {
    name: '工程项目管理',
    icon: '',
    menuData: [
      {
        name: '所有项目',
        icon: '',
        path: '/project-management/all-project',
      },
      {
        name: '可视化成果',
        icon: '',
        path: '/visualization-results/result-page',
      },
      {
        name: '地州项目一览表',
        icon: '',
        path: '/project-management/project-statistics',
      },
    ],
  },
  {
    name: '系统管理',
    icon: '',
    menuData: [
      {
        name: '基础数据',
        icon: '',
        path: '/system-config/basic-data',
      },
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
      {
        name: '上报日志',
        icon: '',
        path: '/system-config/report-log',
      },
      {
        name: '电力公司',
        icon: '',
        path: '/system-config/electric-company',
      },
      {
        name: '平台反馈',
        icon: '',
        path: '/system-config/platform-feedback',
      },
      {
        name: '数据映射',
        icon: '',
        path: '/system-config/map-field',
      },
      {
        name: '终端设备',
        icon: '',
        path: '/system-config/terminal-unit',
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
      {
        name: '公司用户',
        icon: '',
        path: '/personnel-config/company-user',
      },
      {
        name: '用户反馈',
        icon: '',
        path: '/personnel-config/feedback',
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
      {
        name: '角色权限',
        icon: '',
        path: '/jurisdiction-config/role-permissions',
      },
      {
        name: '下辖公司',
        icon: '',
        path: '/jurisdiction-config/subordinate-company',
      },
    ],
  },
  {
    name: '运维管理',
    icon: '',
    menuData: [
      {
        name: '部组管理',
        icon: '',
        path: '/operation-config/company-group',
      },
      {
        name: '公司文件',
        icon: '',
        path: '/operation-config/company-file',
      },
    ],
  },
  {
    name: '资源库管理',
    icon: '',
    menuData: [
      {
        name: '资源库',
        icon: '',
        path: '/resource-config/resource-lib',
      },
      {
        name: '图纸',
        icon: '',
        path: '/resource-config/drawing',
      },
      {
        name: '物料',
        icon: '',
        path: '/resource-config/material',
      },
      {
        name: '组件',
        icon: '',
        path: '/resource-config/component',
      },
      {
        name: '电气设备',
        icon: '',
        path: '/resource-config/electrical-equipment',
      },
      {
        name: '电缆设计',
        icon: '',
        path: '/resource-config/cable-design',
      },
      {
        name: '架空设计',
        icon: '',
        path: '/resource-config/overhead-design',
      },
      {
        name: '应力弧垂表',
        icon: '',
        path: '/resource-config/line-stress-sag',
      },
      {
        name: '版本对比',
        icon: '',
        path: '/resource-config/source-compare',
      },
    ],
  },
  {
    name: '物料管理',
    icon: '',
    menuData: [
      {
        name: '协议库存管理',
        icon: '',
        path: '/material-config/inventory',
      },
      {
        name: '物料利库管理',
        icon: '',
        path: '/material-config/ware-house',
      },
    ],
  },
];

const LayoutHeader: React.FC = () => {

  const [editPasswordModalVisible, setEditPasswordModalVisible] = useState<boolean>(false);
  const [cutAccoutModalVisible, setCutAccountModalVisible] = useState<boolean>(false);

  const userInfo = useGetUserInfo();

  const loginOut = async () => {
    history.push('/login');
    await signOut();
    localStorage.setItem('Authorization', '');
  };

  const menuData:any[] = JSON.parse(localStorage.getItem("functionModules") ?? "[]");

  // TODO 点击个人信息对应的一些方法都还么写
  const myBaseInfoMenu = (
    <Menu>
      <div className={styles.myNameContent}>{userInfo.userName}</div>
      {/* <Menu.Item>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="messager.png" />
        </span>
        <span>个人信息</span>
      </Menu.Item> */}
      <Menu.Item onClick={() => setEditPasswordModalVisible(true)}>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="lack.png" />
        </span>
        <span>密码修改</span>
      </Menu.Item>
      <Menu.Item onClick={() => setCutAccountModalVisible(true)}>
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
  const menuContent = menuData?.filter((item) => item.category === 1).map((item, index) => {
    return (
      <LayoutHeaderMenu
        key={`headerMenu_${index}`}
        onSelect={menuSelectEvent}
        name={item.name}
        icon={item.icon}
        menuData={item.children}
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
      <EditPassword visible={editPasswordModalVisible} onChange={setEditPasswordModalVisible} />
      <CutAccount visible={cutAccoutModalVisible} onChange={setCutAccountModalVisible} />
    </div>
  );
};

export default LayoutHeader;
