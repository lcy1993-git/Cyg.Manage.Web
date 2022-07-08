import { getlinesComponment, getrepeatPointdata } from '@/services/grid-manage/treeMenu'
import { AimOutlined, SearchOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Form, message, Space, Spin, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import {
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  FEATUREOPTIONS,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { loadMapLayers, locationByGeom } from '../GridMap/utils/initializeMap'
import { dataHandle, LEFTMENUWIDTH } from '../tools'
import styles from './index.less'

interface RepeatPointType {
  geom: string
  id: string
  name: string
}
const { useForm } = Form

const Toolbar = (props: { leftMenuVisible: boolean }) => {
  const { leftMenuVisible } = props
  const {
    setdrawToolbarVisible,
    setImportModalVisible,
    setzIndex,
    drawToolbarVisible,
    pageDrawState,
    checkLineIds,
    mapRef,
    isDragPoint,
  } = useMyContext()

  // 地图设备类型显示
  const [form] = useForm()

  // 设备筛选列表是否显示
  const [toolbalHasShow, setToolbalHasShow] = useState(false)
  // 查重列表是否显示
  const [repeatPointState, setRepeatPointState] = useState(false)
  // 查重表格数据
  const [repeatPointTableData, setrepeatPointTableData] = useState<RepeatPointType[]>([])
  // 查重表格标题
  const columns = [
    {
      title: '点位名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 62,
      render: (_: any, record: RepeatPointType) => {
        return (
          <AimOutlined
            onClick={() => {
              locationByGeom(mapRef.map, record.geom)
            }}
          />
        )
      },
    },
  ]
  // 设备筛选表单初始数据
  const ininFromData = {
    featureType: [
      CABLEWELL,
      TOWER,
      BOXTRANSFORMER,
      RINGNETWORKCABINET,
      ELECTRICITYDISTRIBUTIONROOM,
      SWITCHINGSTATION,
      COLUMNCIRCUITBREAKER,
      COLUMNTRANSFORMER,
      CABLEBRANCHBOX,
    ],
  }

  // 根据设备展示数据--- 请求数据
  const { data: TreeData, run: getSearchEquipmentTypeData } = useRequest(
    () => {
      const lineIds = currentChecklineIds()
      return getlinesComponment({
        lineIds,
        kvLevels: [],
      })
    },
    {
      manual: true,
      onSuccess: () => {
        const features = form.getFieldValue('featureType').map((item: string) => {
          const s = item.replace(item[0], item[0].toLowerCase())
          return s + 'List'
        })
        const treeDatas = dataHandle(TreeData)
        const data: {
          powerSupplyList: any
          transformerSubstationList: any
          lineList: any
          lineRelationList: any
        } = {
          powerSupplyList: [],
          transformerSubstationList: [],
          lineList: [],
          lineRelationList: [],
        }
        features.forEach((item: string) => {
          data[item] = treeDatas[item]
        })
        data.powerSupplyList = treeDatas.powerSupplyList
        data.transformerSubstationList = treeDatas.transformerSubstationList
        data.lineList = treeDatas.lineList
        data.lineRelationList = treeDatas.lineRelationList
        loadMapLayers({ ...data }, mapRef.map)
      },
    }
  )
  /** 根据设备展示数据 **/
  const searchEquipmentType = (value: any) => {
    const lineIds = currentChecklineIds()
    if (!lineIds.length) {
      return
    }
    getSearchEquipmentTypeData()
  }

  // 当前选中的主线线路
  const currentChecklineIds = () => {
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
    return lineIds
  }

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
    const lineIds = currentChecklineIds()
    if (!lineIds.length) {
      message.info('请勾选线路')
      return
    }
    setRepeatPointState(!repeatPointState)
    !repeatPointState && (await getrepeatPoint({ lineIds }))
  }

  useEffect(() => {
    if (repeatPointState) {
      const lineIds = currentChecklineIds()
      if (!lineIds.length) {
        return
      }
      const currentDragPointId = localStorage.getItem('dragPointId')
      const exist = repeatPointData?.some((item) => item.id === currentDragPointId)
      if (exist) {
        getrepeatPoint({ lineIds })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragPoint])

  useEffect(() => {
    if (checkLineIds.length) {
      form.resetFields()
    }
  }, [checkLineIds, form])

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
        <Form
          style={{ zIndex: 999 }}
          form={form}
          onFinish={searchEquipmentType}
          initialValues={ininFromData}
        >
          <Form.Item name="featureType">
            <Checkbox.Group
              className="EditFeature"
              options={FEATUREOPTIONS.filter(
                (item) => item.value !== POWERSUPPLY && item.value !== TRANSFORMERSUBSTATION
              )}
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
