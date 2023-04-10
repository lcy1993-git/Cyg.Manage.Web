import { SearchOutlined } from '@ant-design/icons'
import { Button, Select, Space } from 'antd'
import { useState } from 'react'
// import { useMyContext } from '../Context'
import CityList from './CityList'
import GridFilterModal from './grid-filter-modal'

const DrawGridToolbar = () => {
  const [visible, setVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
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

        <Button type="primary" onClick={() => setFilterVisible(true)}>
          <Space>
            筛选
            <SearchOutlined />
          </Space>
        </Button>
      </div>
      <CityList visible={visible} />
      <GridFilterModal onChange={setFilterVisible} visible={filterVisible} />
    </>
  )
}
export default DrawGridToolbar
