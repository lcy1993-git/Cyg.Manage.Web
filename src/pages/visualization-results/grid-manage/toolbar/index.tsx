import { getlinesComponment, getrepeatPointdata } from '@/services/grid-manage/treeMenu'
import { AimOutlined, SearchOutlined, CloseOutlined, BulbOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Form, message, Space, Spin, Table, Input } from 'antd'
import { type } from 'jquery'
import { includes } from 'lodash'
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
const initialFeatureType = FEATUREOPTIONS.filter(
  (item) => item.value !== POWERSUPPLY && item.value !== TRANSFORMERSUBSTATION
)

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
  // copy一份查重数据
  const [copyRepeateData, setCopyRepeateData] = useState<RepeatPointType[]>([])
  // copy一份搜索数据
  const [copySearchData, setCopySearchData] = useState<RepeatPointType[]>([])
  // 搜索列表是否显示
  const [searchState, setSearchState] = useState(false)
  // 搜索关键字
  const [keyWord, setKeyWord] = useState<string>('')
  // 按设备筛,当前选中设备
  const [selectedFeatureType, setSelectedFeatureType] = useState<string[]>(
    initialFeatureType.map((item) => item.value)
  )
  // 当前高亮的设备
  const [highlightFeatureType, setHighlightFeatureType] = useState<string[]>([])
  // 表格标题
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
  // const { data: TreeData, run: getSearchEquipmentTypeData } = useRequest(
  //   () => {
  //     const lineIds = currentChecklineIds()
  //     return getlinesComponment({
  //       lineIds,
  //       kvLevels: [],
  //     })
  //   },
  //   {
  //     manual: true,
  //     onSuccess: () => {
  //       const features = form.getFieldValue('featureType').map((item: string) => {
  //         const s = item.replace(item[0], item[0].toLowerCase())
  //         return s + 'List'
  //       })
  //       const treeDatas = dataHandle(TreeData)
  //       const data: {
  //         powerSupplyList: any
  //         transformerSubstationList: any
  //         lineList: any
  //         lineRelationList: any
  //       } = {
  //         powerSupplyList: [],
  //         transformerSubstationList: [],
  //         lineList: [],
  //         lineRelationList: [],
  //       }
  //       features.forEach((item: string) => {
  //         data[item] = treeDatas[item]
  //       })
  //       data.powerSupplyList = treeDatas.powerSupplyList
  //       data.transformerSubstationList = treeDatas.transformerSubstationList
  //       data.lineList = treeDatas.lineList
  //       data.lineRelationList = treeDatas.lineRelationList
  //       loadMapLayers({ ...data }, mapRef.map)
  //     },
  //   }
  // )
  /** 根据设备展示数据 **/
  const searchEquipmentType = (value: any) => {
    const lineIds = currentChecklineIds()
    if (!lineIds.length) {
      message.info('请勾选线路')
      return
    }
    const featureTypes = form.getFieldValue('featureType')
    setSelectedFeatureType(featureTypes)
    // console.log(featureTypes)
    // getSearchEquipmentTypeData()
  }
  /** 根据设备展示数据弹窗高亮按钮 **/
  const highlightHandle = (value: any) => {
    let types = [...highlightFeatureType]
    if (highlightFeatureType.includes(value)) {
      types = types.filter((item) => item !== value)
    } else {
      types.push(value)
    }
    setHighlightFeatureType(types)
    // console.log(types)
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

  // 是否显示底部弹窗
  const isShowBottomModal = repeatPointState || searchState
  const hasShowBottomModal = () => {
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
      setCopyRepeateData(data as RepeatPointType[])
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
    const linesAndPoints = getShowLines(mapRef.map).concat(getShowPoints(mapRef.map))
    if (linesAndPoints && linesAndPoints.length === 0) {
      // 地图未渲染
      message.info('请等待地图绘制完成后搜索')
      return
    }
    setSearchState(!searchState)
    repeatPointState && setRepeatPointState(false)
    !searchState && setTableData([])
    !searchState && setKeyWord('')
    const filterData = linesAndPoints
      .map((item: any) => {
        return item.get('data')
      })
      .sort((a: any, b: any) => {
        // 没有名字的点排在数组尾部
        if (!a.name) {
          return 1
        }
        return -1
      })
    setTableData(filterData)
    setCopySearchData(filterData)
  }
  // 搜索
  const searchEvent = () => {
    if (searchState) {
      // 当前弹窗为搜索
      if (keyWord.trim() === '') {
        setTableData(copySearchData)
        return
      }
      const filterData = copySearchData.filter((item: any) => {
        return !!item.name && item.name.indexOf(keyWord) !== -1
      })
      setTableData(filterData)
    } else {
      // 当前弹窗为查重
      if (keyWord.trim() === '') {
        setTableData(copyRepeateData)
        return
      }
      setTableData(copyRepeateData.filter((item) => item.name.indexOf(keyWord) !== -1))
    }
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
      setSelectedFeatureType(initialFeatureType.map((item) => item.value))
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
        <div style={{ width: '130px' }}>
          <Form
            style={{ zIndex: 999 }}
            form={form}
            onFinish={searchEquipmentType}
            initialValues={ininFromData}
          >
            <Form.Item name="featureType">
              <Checkbox.Group className="EditFeature" options={initialFeatureType} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ width: '140px' }}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.highlightBtnWrap}>
          {initialFeatureType.map((item, index) => {
            if (selectedFeatureType.includes(item.value)) {
              return (
                <div
                  key={item.value}
                  onClick={() => {
                    highlightHandle(item.value)
                  }}
                  className={`${styles.highlightBtn} ${
                    highlightFeatureType.includes(item.value) ? styles.red : styles.black
                  }`}
                >
                  <BulbOutlined />
                </div>
              )
            }
            return <div key={index} style={{ height: '22px' }}></div>
          })}
        </div>
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
        className={styles.bottomModalWrap}
        style={{
          transform: hasShowBottomModal(),
        }}
      >
        <Spin spinning={loading}>
          <div className={styles.title}>
            {searchState ? '搜索' : '查重'}
            <CloseOutlined
              className={styles.close}
              onClick={() => {
                setRepeatPointState(false)
                setSearchState(false)
              }}
            />
          </div>
          <Search
            placeholder="请输入关键字进行搜索"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onSearch={() => searchEvent()}
            style={{ width: '200px', marginBottom: '12px' }}
          />
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
