import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Select, Space } from 'antd'
import { useState } from 'react'
import { useMyContext } from '../Context'
import CityList from './CityList'

const DrawGridToolbar = (props: any) => {
  const [visible, setVisible] = useState(false)
  const { setdrawToolbarVisible } = useMyContext()

  const menu = (
    <Menu>
      <Menu.Item key="projectDetail">数据导入</Menu.Item>
      <Menu.Item key="handDrawn" onClick={() => setdrawToolbarVisible(true)}>
        手动绘制
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div className="flex h-full w-full justify-start items-center pl-2 space-x-2.5 ">
        <Select
          defaultValue="地区定位"
          style={{ width: 140 }}
          className="w-44 flex-grow-0 truncate"
          open={false}
          onClick={() => setVisible(!visible)}
        />
        <Space wrap>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="primary">
              <Space>
                网架绘制
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </div>
      <CityList visible={visible} />
    </>
  )
}
export default DrawGridToolbar
