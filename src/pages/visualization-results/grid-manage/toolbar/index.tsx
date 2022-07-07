import { getrepeatPointdata } from '@/services/grid-manage/treeMenu'
import { AimOutlined, SearchOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Form, message, Space, Spin, Table } from 'antd'
import { useState } from 'react'
import { useMyContext } from '../Context'
import { FEATUREOPTIONS, POWERSUPPLY, TRANSFORMERSUBSTATION } from '../DrawToolbar/GridUtils'
import { LEFTMENUWIDTH } from '../tools'
import styles from './index.less'

interface RepeatPointType {
  geom: string
  id: string
  name: string
}

const Toolbar = (props: { leftMenuVisible: boolean }) => {
  const { leftMenuVisible } = props
  const {
    setdrawToolbarVisible,
    setImportModalVisible,
    setzIndex,
    drawToolbarVisible,
    pageDrawState,
    checkLineIds,
  } = useMyContext()

  // 设备筛选列表是否显示
  const [toolbalHasShow, setToolbalHasShow] = useState(false)
  // 查重列表是否显示
  const [repeatPointState, setRepeatPointState] = useState(false)
  // 查重表格数据
  const [repeatPointTableData, setrepeatPointTableData] = useState<RepeatPointType[]>([])

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

  // 是否显示查重列表
  const hasShowRepetPoint = () => {
    if (!repeatPointState) {
      return 'translateX(-400px)'
    }
    return leftMenuVisible ? `translateX(${LEFTMENUWIDTH + 10}px)` : `translateX(10px)`
  }

  // 请求查重数据
  const { data: repeatPointData, loading, run: getrepeatPoint } = useRequest(getrepeatPointdata, {
    manual: true,
    onSuccess: () => {
      setrepeatPointTableData(repeatPointData as RepeatPointType[])
    },
    onError: () => {},
  })

  // 查重逻辑
  const repeatPointHand = async () => {
    const ids = [...new Set(checkLineIds)]
    const lineIds: string[] = ids
      .map((item: string) => {
        const exist = item.includes('_&Line')
        if (exist) {
          return item.split('_&Line')[0]
        }
        return ''
      })
      .filter((item: string) => item)
    if (!lineIds.length) {
      message.info('请勾选线路')
      return
    }
    setRepeatPointState(!repeatPointState)
    !repeatPointState && (await getrepeatPoint({ lineIds }))
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
          <Button type="primary" onClick={repeatPointHand}>
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
        <Form style={{ zIndex: 999 }}>
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
          zIndex: 999,
        }}
        onClick={() => setToolbalHasShow(!toolbalHasShow)}
      />

      <div
        className={styles.repeatPointWrap}
        style={{
          transform: hasShowRepetPoint(),
        }}
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            bordered
            key="id"
            pagination={false}
            dataSource={repeatPointTableData}
            size="small"
            scroll={{ y: 160 }}
          />
        </Spin>
      </div>
    </>
  )
}
export default Toolbar
