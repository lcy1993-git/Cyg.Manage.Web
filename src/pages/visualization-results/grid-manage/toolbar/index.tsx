import { AimOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Space, Table } from 'antd'
import { useState } from 'react'
import { useMyContext } from '../Context'
import { FEATUREOPTIONS, POWERSUPPLY, TRANSFORMERSUBSTATION } from '../DrawToolbar/GridUtils'
import { LEFTMENUWIDTH } from '../tools'
import styles from './index.less'

const Toolbar = (props: { leftMenuVisible: boolean }) => {
  const { leftMenuVisible } = props
  const {
    setdrawToolbarVisible,
    setImportModalVisible,
    setzIndex,
    drawToolbarVisible,
    pageDrawState,
  } = useMyContext()

  // 设备筛选列表是否显示
  const [toolbalHasShow, setToolbalHasShow] = useState(false)
  // 查重列表是否显示
  const [repeatPoint, setRepeatPoint] = useState(false)

  /** 搜索设备 **/
  const searchEquipmentType = () => {}
  // 表格标题
  const columns = [
    {
      title: '点位名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 62,
      render: () => {
        return <AimOutlined />
      },
    },
  ]
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
    },
    {
      key: '41',
      name: 'Jim Red',
      age: 32,
    },
    {
      key: '42',
      name: 'Jim Red',
      age: 32,
    },
    {
      key: '43',
      name: 'Jim Red',
      age: 32,
    },
    {
      key: '44',
      name: 'Jim Red',
      age: 32,
    },
  ]
  // 是否显示查重列表
  const hasShowRepetPoint = () => {
    if (!repeatPoint) {
      return 'translateX(-400px)'
    }
    return leftMenuVisible ? `translateX(${LEFTMENUWIDTH + 10}px)` : `translateX(10px)`
  }
  return (
    <>
      <div
        className={styles.toolbar}
        style={{
          left: leftMenuVisible ? `${LEFTMENUWIDTH + 20}px` : 20,
        }}
      >
        <Space>
          <Button type="primary" onClick={() => setImportModalVisible(true)}>
            数据导入
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setzIndex('create')
              setdrawToolbarVisible(true)
            }}
          >
            手动绘制
          </Button>
          <Button type="primary" onClick={() => setRepeatPoint(!repeatPoint)}>
            一键查重
          </Button>
        </Space>
      </div>
      <div
        className={styles.searchWrap}
        style={{
          right: toolbalHasShow ? `${drawToolbarVisible || pageDrawState ? 398 : 20}px` : -200,
        }}
      >
        <Form>
          <Form.Item name="featureType">
            <Checkbox.Group
              className="EditFeature"
              options={FEATUREOPTIONS.filter(
                (item) => item.value !== POWERSUPPLY && item.value !== TRANSFORMERSUBSTATION
              )}
              onChange={searchEquipmentType}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<SearchOutlined />}
        className={styles.toolbarBtn}
        style={{
          right: drawToolbarVisible || pageDrawState ? '398px' : '20px',
        }}
        onClick={() => setToolbalHasShow(!toolbalHasShow)}
      />

      <div
        className={styles.repeatPointWrap}
        style={{
          transform: hasShowRepetPoint(),
        }}
      >
        <Table
          columns={columns}
          bordered
          pagination={false}
          dataSource={data}
          size="small"
          scroll={{ y: 160 }}
        />
      </div>
    </>
  )
}
export default Toolbar
