import AddEngineerModal from '@/pages/project-management/all-project/components/add-engineer-modal'
import { getrepeatPointdata } from '@/services/grid-manage/treeMenu'
import { AimOutlined, BulbOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Button, Checkbox, Form, Input, message, Space, Spin, Table } from 'antd'
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
import { getShowPoints, locationByGeom } from '../PlanMap/utils/initializeMap'
import { loadAllPointLayer } from '../PlanMap/utils/loadLayer'
import { twinkle } from '../PlanMap/utils/style'
import { LEFTMENUWIDTH } from '../tools'
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

  //规划立项
  const [createProjectVisible, setCreateProjectVisible] = useState<boolean>(false)

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
  /** 根据设备展示数据 **/
  const checkGroupChange = (checkedValue: any) => {
    setSelectedFeatureType(checkedValue)
    loadAllPointLayer(mapRef.map, [TRANSFORMERSUBSTATION, POWERSUPPLY, ...checkedValue])
  }
  /** 点击根据设备展示数据弹窗高亮按钮 **/
  const highlightHandle = (value: any) => {
    let types = [...highlightFeatureType]
    if (highlightFeatureType.includes(value)) {
      types = types.filter((item) => item !== value)
    } else {
      types.push(value)
    }
    setHighlightFeatureType(types)
    twinkle(mapRef.map, types)
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
    if (!checkLineIds.length) {
      setRepeatPointState(false)
      message.info('请勾选线路')
      return
    }
    const linesAndPoints = getShowPoints(mapRef.map)
    setSearchState(!searchState)
    repeatPointState && setRepeatPointState(false)
    !searchState && setTableData([])
    !searchState && setKeyWord('')
    const filterData = linesAndPoints.map((item: any, index: any) => {
      const data = item.get('data')
      const name = FEATUERTYPE[data.featureType] + '-' + (item.name ? item.name : `未命名-${index}`)
      return {
        ...data,
        name,
      }
    })
    setTableData(filterData)
    setCopySearchData(filterData)
  }
  // 点击按设备筛选按钮
  const filterByequipmentHand = () => {
    if (!checkLineIds.length) {
      setToolbalHasShow(false)
      message.info('请勾选线路')
      return
    }
    setToolbalHasShow(!toolbalHasShow)
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

  /**根据框选规划数据立项 */
  const createProject = () => {
    setCreateProjectVisible(true)
  }

  useUpdateEffect(() => {
    setRepeatPointState(false)
    setSearchState(false)
    setToolbalHasShow(false)
    // 重置按设备筛选弹窗内容
    form.resetFields()
    setSelectedFeatureType(initialFeatureType.map((item) => item.value))
    setHighlightFeatureType([])
    twinkle(mapRef.map, [])
  }, [checkLineIds, form, mapRef])

  return (
    <>
      <div
        className={styles.toolbar}
        style={{
          left: leftMenuVisible ? `${LEFTMENUWIDTH + 20}px` : 20,
        }}
      >
        <Space>
          <Button type="primary" onClick={createProject}>
            立项
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
          <Form style={{ zIndex: 999 }} form={form} initialValues={ininFromData}>
            <Form.Item name="featureType">
              <Checkbox.Group
                onChange={checkGroupChange}
                className="EditFeature"
                options={initialFeatureType}
              />
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
        onClick={filterByequipmentHand}
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
      {createProjectVisible && (
        <AddEngineerModal visible={createProjectVisible} onChange={setCreateProjectVisible} />
      )}
    </>
  )
}
export default Toolbar
