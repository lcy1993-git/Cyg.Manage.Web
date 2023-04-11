import headPortraitSrc from '@/assets/image/head-portrait.jpg'
import ImageIcon from '@/components/image-icon'
import LogoComponent from '@/components/logo-component'
import { Stop } from '@/pages/login'
import { baseUrl } from '@/services/common'
import { signOut } from '@/services/login'
import { useGetFunctionModules, useGetUserInfo } from '@/utils/hooks'
import { uploadAuditLog } from '@/utils/utils'
import { BellOutlined } from '@ant-design/icons'
import { useInterval } from 'ahooks'
import { Badge, Dropdown, Menu } from 'antd'
import uuid from 'node-uuid'
import React, { useState } from 'react'
import { history } from 'umi'
import CutAccount from '../cut-account'
import EditPassword from '../edit-password'
import LayoutHeaderMenu from '../layout-header-menu'
import PersonInfoModal from '../person-info-modal'
import VersionInfoModal from '../version-info-modal'
import styles from './index.less'

const LayoutHeader: React.FC = () => {
  const [editPasswordModalVisible, setEditPasswordModalVisible] = useState<boolean>(false)
  const [cutAccoutModalVisible, setCutAccountModalVisible] = useState<boolean>(false)
  const [personInfoModalVisible, setPersonInfoModalVisible] = useState<boolean>(false)
  const [versionModalVisible, setVersionModalVisible] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [stopServerInfo, setStopServerInfo] = useState<Stop>({} as Stop)

  const userInfo = useGetUserInfo()

  const loginOut = async () => {
    history.push('/login')
    uploadAuditLog([
      {
        auditType: 1,
        eventType: 2,
        executionUserId: userInfo?.id,
        executionUserName: userInfo?.userName,
        executionResult: '成功',
        eventDetailType: '退出登录',
        serviceAdress: `${baseUrl.common}/Users/SignOut`,
        auditLevel: 2,
        clientVersion: '',
      },
    ])
    await signOut()
    localStorage.setItem('Authorization', '')
  }

  const menuData: any[] = useGetFunctionModules()

  const personInfoEditEvent = () => {
    setPersonInfoModalVisible(true)
  }
  useInterval(() => {
    let info = JSON.parse(sessionStorage.getItem('stopServerInfo') || '{}')
    if (Object.keys(info).length !== 0) {
      setCount(1)
      setStopServerInfo(info)
    } else {
      setCount(0)
      setStopServerInfo({} as Stop)
    }
  }, 10000)
  // TODO 点击个人信息对应的一些方法都还么写
  const myBaseInfoMenu = (
    <Menu>
      <div className={styles.myNameContent} key="userName">
        {userInfo.userName}
      </div>
      <Menu.Item onClick={() => personInfoEditEvent()} key="info">
        <span className={styles.headerMenuIcon}>
          <ImageIcon width={18} height={18} imgUrl="messager.png" />
        </span>
        <span>个人信息</span>
      </Menu.Item>
      <Menu.Item onClick={() => setEditPasswordModalVisible(true)} key="setPwd">
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
      <Menu.Item onClick={() => loginOut()} key="out">
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

  const isAdminCategory = localStorage.getItem('isAdminCategory') === '0'
  const AdminCategoryMenu = (
    <div className={styles.adminCategorymenu}>
      <div onClick={() => menuSelectEvent('首页', '/admin-index/home')}>首页</div>
      <div onClick={() => menuSelectEvent('报表', '/admin-index/report/11')}>报表</div>
    </div>
  )

  // TODO 获取menu需要根据权限进行处理一下，没权限的不用展示出来

  const menuContent = menuData
    ?.filter((item) => item.category === 1)
    .map((item, index) => {
      return (
        <div key={uuid.v1()} style={{ height: '100%' }}>
          <LayoutHeaderMenu
            key={`headerMenu_${index}`}
            onSelect={menuSelectEvent}
            name={item.name}
            icon={item.icon}
            menuData={item.children}
          />
        </div>
      )
    })

  return (
    <div className={styles.layoutHeader}>
      <div className={styles.layoutHeaderContainer}>
        <div className={styles.layoutHeaderLogo}>
          <LogoComponent />
        </div>
        <div className={styles.layoutHeaderContent}>
          {isAdminCategory ? AdminCategoryMenu : menuContent}
        </div>

        <div className={styles.layoutMyBaseInfo}>
          <div onClick={() => setVersionModalVisible(true)}>
            <Badge count={count} color={'red'} size={'small'} offset={[1, 20]} dot>
              <BellOutlined style={{ height: '32px' }} className={styles.myMessageTips} />
            </Badge>
          </div>
          <Dropdown overlay={myBaseInfoMenu}>
            <div className={styles.myBaseInfo}>
              <img className={styles.myHeadPortait} src={headPortraitSrc} alt="" />
              <div className={styles.foldIcon}>
                <ImageIcon imgUrl="fold.png" width={8} height={8} />
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      <EditPassword visible={editPasswordModalVisible} onChange={setEditPasswordModalVisible} />
      <CutAccount visible={cutAccoutModalVisible} onChange={setCutAccountModalVisible} />
      <PersonInfoModal visible={personInfoModalVisible} onChange={setPersonInfoModalVisible} />
      <VersionInfoModal
        visible={versionModalVisible}
        onChange={setVersionModalVisible}
        stopServerInfo={stopServerInfo}
      />
    </div>
  )
}

export default LayoutHeader
