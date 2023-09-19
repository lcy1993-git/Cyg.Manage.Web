import EnumSelect from '@/components/enum-select'
import { postBatchSyncProject, QgcTypeEnum } from '@/services/project-management/all-project'
import { CaretDownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Dropdown, Menu, message, Modal, Spin } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'

interface MenuItemParams {
  name: string
  jurisdiction?: string
  icon?: string
  url: string
  category: number
  children: any[]
  authCode: string
}

interface MenuProps {
  name: string
  icon: string
  menuData: MenuItemParams[]
  onSelect: (name: string, path: string) => void
}

const { SubMenu } = Menu

const LayoutHeaderMenu: React.FC<MenuProps> = (props) => {
  const { name, icon, menuData, onSelect } = props
  const [qgcType, setQgcType] = useState<string>('0')
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const toPath = async (name: string, path: string) => {
    if (name === '项目数据同步') {
      setSelectVisible(true)
      return
    }
    onSelect(name, path)
  }

  const qgcBatchEvent = async () => {
    try {
      setLoading(true)
      await postBatchSyncProject(qgcType)
      message.success('项目同步成功!')
      setSelectVisible(false)
      setLoading(false)
    } catch (err) {
      setSelectVisible(false)
      setLoading(false)
      return
    }
    return
  }

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
              <Menu.Item key={ite.name} onClick={() => toPath(ite.name, ite.url)}>
                <div>
                  {icon ? <span>{ite.icon}</span> : null}
                  <span>{ite.name}</span>
                </div>
              </Menu.Item>
            )
          })}
        </SubMenu>
      ) : (
        <Menu.Item key={`headerMenuListItem_${index}`} onClick={() => toPath(item.name, item.url)}>
          <div>
            {icon ? <span>{item.icon}</span> : null}
            <span>{item.name}</span>
          </div>
        </Menu.Item>
      )
    })

  const menuElement = <Menu>{menuElementList}</Menu>

  return (
    <>
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
      <Modal
        maskClosable={false}
        width="400px"
        visible={selectVisible}
        onCancel={() => setSelectVisible(false)}
        bodyStyle={{
          padding: '24px 24px 12px 24px',
        }}
        onOk={qgcBatchEvent}
        destroyOnClose
      >
        <Spin spinning={loading} tip="数据同步中，请稍后...">
          <div>
            <ExclamationCircleFilled /> 请选择项目数据同步类型
          </div>

          <EnumSelect
            placeholder="请选择"
            enumList={QgcTypeEnum}
            value={qgcType}
            onChange={(value: any) => setQgcType(String(value))}
            style={{ width: '100%', padding: '12px 0' }}
          />
        </Spin>
      </Modal>
    </>
  )
}

export default LayoutHeaderMenu
