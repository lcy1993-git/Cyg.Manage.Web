import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './index.less';
import LayoutHeaderMenu from '../layout-header-menu';
import { history } from 'umi';
import ImageIcon from '@/components/image-icon';
import headPortraitSrc from '@/assets/image/head-portrait.jpg';
import { signOut } from '@/services/login';
import EditPassword from '../edit-password';
import CutAccount from '../cut-account';
import PersonInfoModal from '../person-info-modal';
import { useGetFunctionModules, useGetUserInfo } from '@/utils/hooks';
import LogoComponent from '@/components/logo-component';
import { BellOutlined } from '@ant-design/icons';
import VersionInfoModal from '../version-info-modal';

const LayoutHeader: React.FC = () => {
  const [editPasswordModalVisible, setEditPasswordModalVisible] = useState<boolean>(false);
  const [cutAccoutModalVisible, setCutAccountModalVisible] = useState<boolean>(false);
  const [personInfoModalVisible, setPersonInfoModalVisible] = useState<boolean>(false);
  const [versionModalVisible, setVersionModalVisible] = useState<boolean>(false);

  const userInfo = useGetUserInfo();

  const loginOut = async () => {
    history.push('/login');
    await signOut();
    localStorage.setItem('Authorization', '');
  };

  const menuData: any[] = useGetFunctionModules();

  const personInfoEditEvent = () => {
    setPersonInfoModalVisible(true);
  };

  // TODO 点击个人信息对应的一些方法都还么写
  const myBaseInfoMenu = (
    <Menu>
      <div className={styles.myNameContent}>{userInfo.userName}</div>
      <Menu.Item onClick={() => personInfoEditEvent()}>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="messager.png" />
        </span>
        <span>个人信息</span>
      </Menu.Item>
      <Menu.Item onClick={() => setEditPasswordModalVisible(true)}>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="lack.png" />
        </span>
        <span>密码修改</span>
      </Menu.Item>
      {/* <Menu.Item onClick={() => setCutAccountModalVisible(true)}>
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="qiehuan.png" />
        </span>
        <span>快捷登录</span>
      </Menu.Item> */}
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
  const menuContent =
    menuData &&
    menuData.length &&
    menuData
      ?.filter((item) => item.category === 1)
      .map((item, index) => {
        return (
          <>
            <LayoutHeaderMenu
              key={`headerMenu_${index}`}
              onSelect={menuSelectEvent}
              name={item.name}
              icon={item.icon}
              menuData={item.children}
            />
          </>
        );
      });

  return (
    <div className={styles.layoutHeader}>
      <div className={styles.layoutHeaderContainer}>
        <div className={styles.layoutHeaderLogo}>
          <LogoComponent />
        </div>
        <div className={styles.layoutHeaderContent}>{menuContent}</div>

        <div className={styles.layoutMyBaseInfo}>
          <div onClick={() => setVersionModalVisible(true)}>
            <BellOutlined style={{ height: '32px' }} className={styles.myMessageTips} />
          </div>
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
      <PersonInfoModal visible={personInfoModalVisible} onChange={setPersonInfoModalVisible} />
      <VersionInfoModal visible={versionModalVisible} onChange={setVersionModalVisible} />
    </div>
  );
};

export default LayoutHeader;
