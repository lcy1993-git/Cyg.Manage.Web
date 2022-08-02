import { getlinesComponment, getrepeatPointdata } from '@/services/grid-manage/treeMenu'
import { AimOutlined, SearchOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Form, message, Space, Spin, Table, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import {
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  FEATUERTYPE,
  FEATUREOPTIONS,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import {
  loadMapLayers,
  locationByGeom,
  getShowLines,
  getShowPoints,
} from '../GridMap/utils/initializeMap'
import { dataHandle, LEFTMENUWIDTH } from '../tools'
import styles from './index.less'

interface RepeatPointType {
  geom: string
  id: string
  name: string
  type: string
}
const { useForm } = Form
const { Search } = Input

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
  // 表格数据
  const [tableData, setTableData] = useState<RepeatPointType[]>([])
  // 搜索列表是否显示
  const [searchState, setSearchState] = useState(false)
  // 搜索关键字
  const [keyWord, setKeyWord] = useState<string>('')
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
  const isShowBottomModal = repeatPointState || searchState
  const hasShowRepetPoint = () => {
    if (!isShowBottomModal) {
      return 'translateX(-400px)'
    }
    return leftMenuVisible ? `translateX(${LEFTMENUWIDTH + 10}px)` : `translateX(10px)`
  }

  // 请求查重数据
  const { data: repeatPointData, loading, run: getrepeatPoint } = useRequest(getrepeatPointdata, {
    manual: true,
    onSuccess: () => {
      const data = repeatPointData?.map((item, index) => {
        const name = FEATUERTYPE[item.type] + '-' + (item.name ? item.name : `未命名-${index}`)
        return {
          ...item,
          name,
        }
      })
      setTableData(data as RepeatPointType[])
    },
    onError: () => {},
  })
  // 点击查重按钮
  const repeatPointHand = async () => {
    const lineIds = currentChecklineIds()
    if (!lineIds.length) {
      setRepeatPointState(false)
      message.info('请勾选线路')
      return
    }
    setRepeatPointState(!repeatPointState)
    searchState && setSearchState(false)
    !repeatPointState && (await getrepeatPoint({ lineIds }))
  }
  // 点击搜索按钮
  const search = () => {
    const lineIds = currentChecklineIds()
    if (!lineIds.length) {
      setRepeatPointState(false)
      message.info('请勾选线路')
      return
    }
    setSearchState(!searchState)
    repeatPointState && setRepeatPointState(false)
    !searchState && setTableData([])
    !searchState && setKeyWord('')
  }
  // 搜索
  const searchEvent = () => {
    if (keyWord.trim() === '') {
      message.info('请输入关键字')
      return
    }
    const linesAndPoints = getShowLines(mapRef.map).concat(getShowPoints(mapRef.map))
    const filterData = linesAndPoints
      .map((item: any) => {
        return item.get('data')
      })
      .filter((item: any) => {
        return !!item.name && item.name.indexOf(keyWord) !== -1
      })
    setTableData(filterData)
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
      const deletePointIds = JSON.parse(localStorage.getItem('deletePointIds') || '[]')
      const isRefresh = deletePointIds.some((pointId: string) =>
        repeatPointData?.some((item) => item.id === pointId)
      )
      if (isRefresh) {
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
          <Button type="primary" onClick={search}>
            搜索
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
          {searchState && (
            <Search
              placeholder="请输入关键字进行搜索"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => searchEvent()}
            />
          )}
          <Table
            columns={columns}
            bordered
            rowKey="id"
            pagination={false}
            dataSource={tableData}
            size="small"
            scroll={{ y: 160 }}
          />
        </Spin>
      </div>
    </>
  )
}
export default Toolbar
