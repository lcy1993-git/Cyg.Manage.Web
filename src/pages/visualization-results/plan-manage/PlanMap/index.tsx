import {
  deleteBoxTransformer,
  deleteCableBranchBox,
  deleteCableWell,
  deleteColumnCircuitBreaker,
  deleteColumnTransformer,
  deleteElectricityDistributionRoom,
  deleteLineRelations,
  deletePowerSupply,
  deleteRingNetworkCabinet,
  deleteSwitchingStation,
  deleteTower,
  deleteTransformerSubstation,
  getAllBelongingLineItem,
  getIntervalByTransformer,
  modifyBoxTransformer,
  modifyCableBranchBox,
  modifyCableWell,
  modifyColumnCircuitBreaker,
  modifyColumnTransformer,
  modifyElectricityDistributionRoom,
  modifyPowerSupply,
  modifyRelationLine,
  modifyRingNetworkCabinet,
  modifySwitchingStation,
  modifyTower,
  modifyTransformerSubstation,
  uploadAllFeature,
} from '@/services/grid-manage/treeMenu'
import { useMount, useRequest, useSize, useUpdateEffect } from 'ahooks'
import { Button, Cascader, Drawer, Form, FormInstance, Input, Modal, Select } from 'antd'
import { message } from 'antd/es'
import { useEffect, useRef, useState } from 'react'
import { useMyContext } from '../Context'
import {
  BELONGINGCAPACITY,
  BELONGINGCAREA,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUIT,
  CABLECIRCUITMODEL,
  CABLEWELL,
  COLORU,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  FEATUERTYPE,
  KVLEVELOPTIONS,
  LINE,
  LINEMODEL,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import {
  transformAreaDataToArr,
  transformArrtToAreaData,
  verificationLat,
  verificationLng,
  verificationNaturalNumber,
  verificationNaturalNumber0to100,
} from '../tools'
import {
  clear,
  deletBoxFeature,
  getDrawLines,
  getDrawPoints,
  initMap,
  setDrawBox,
} from './utils/initializeMap'
import {
  deletCurrrentSelectFeature,
  deletFeatureByTable,
  editFeature,
  getCurrrentSelectFeature,
  getDeleFeatures,
} from './utils/select'
import { dataHandle } from './utils/utils'
interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
  color: string
}
export interface pointType {
  featureType: string
  name?: string
  kvLevel?: string
  designScaleMainTransformer?: string
  builtScaleMainTransformer?: string
  mainWiringMode?: string
  powerType?: string
  installedCapacity?: string
  schedulingMode?: string
  lineId?: string
  capacity?: string
  isOverhead?: boolean
  model?: string
  lineType?: string
  properties?: string
  lng?: string
  geom: string
  color?: string
  companyId: string
  id: string
}

const { useForm } = Form
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

const PlanMap = () => {
  const {
    mapRef,
    setIsRefresh,
    isRefresh,
    setzIndex,
    zIndex,
    setlineAssemble,
    setpageDrawState,
    setisDragPoint,
    companyId,
    areaData,
    areaMap,
  } = useMyContext()

  const ref = useRef<HTMLDivElement>(null)
  const [form] = useForm()

  const [currentFeatureType, setcurrentFeatureType] = useState('')
  const [currentfeatureData, setcurrentfeatureData] = useState({ id: '', geom: '', color: '' })
  /**所属线路数据**/
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])
  const [visible, setvisible] = useState<boolean>(false)
  // 变电站间隔模态框
  const [editModel, seteditModel] = useState(false)
  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, { manual: true })
  const [selectLineType, setSelectLineType] = useState('')

  //当前点击点位公司id
  const [clickCompanyId, setClickCompanyId] = useState<string | undefined>('')
  //是否显示保存按钮
  const [isSaveVisible, setIsSaveVisible] = useState<boolean>(false)

  const size = useSize(ref)

  useUpdateEffect(() => {
    mapRef.map.updateSize()
  }, [size])

  /** 上传本地数据 **/
  const uploadLocalData = async () => {
    const pointDatas = getDrawPoints()
    const lineDatas = getDrawLines()

    // 点位数据处理
    const pointData = dataHandle(pointDatas)
    // 线路数据处理
    const lineData = dataHandle(lineDatas)
    if ((pointData && pointData.length) || (lineData && lineData.length)) {
      const powerSupplyList = pointData.filter(
        (item: { featureType: string }) => item.featureType === POWERSUPPLY
      )

      const transformerStationList = pointData.filter(
        (item: { featureType: string }) => item.featureType === TRANSFORMERSUBSTATION
      )
      const cableWellList = pointData.filter(
        (item: { featureType: string }) => item.featureType === CABLEWELL
      )
      const towerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === TOWER
      )
      const boxTransformerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === BOXTRANSFORMER
      )
      const ringNetworkCabinetList = pointData.filter(
        (item: { featureType: string }) => item.featureType === RINGNETWORKCABINET
      )
      const electricityDistributionRoomList = pointData.filter(
        (item: { featureType: string }) => item.featureType === ELECTRICITYDISTRIBUTIONROOM
      )
      const switchingStationList = pointData.filter(
        (item: { featureType: string }) => item.featureType === SWITCHINGSTATION
      )
      const columnCircuitBreakerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === COLUMNCIRCUITBREAKER
      )
      const columnTransformerList = pointData.filter(
        (item: { featureType: string }) => item.featureType === COLUMNTRANSFORMER
      )
      const cableBranchBoxList = pointData.filter(
        (item: { featureType: string }) => item.featureType === CABLEBRANCHBOX
      )
      const lineElementRelationList = lineData.map((item: { lineType: string }) => {
        return {
          ...item,
          isOverhead: item.lineType === LINE,
        }
      })

      // const transformerIntervalList = transformerStationList.map((item: { id: any }) => {
      //   return {
      //     id: createFeatureId(),
      //     transformerSubstationId: item.id,
      //     publicuse: 0,
      //     spare: 0,
      //     specialPurpose: 0,
      //     total: 0,
      //   }
      // })

      if (powerSupplyList.length || transformerStationList.length) {
        setlineAssemble(true)
        setIsRefresh(true)
      }

      await stationItemsHandle({
        towerList,
        switchingStationList,
        ringNetworkCabinetList,
        electricityDistributionRoomList,
        columnTransformerList,
        columnCircuitBreakerList,
        cableWellList,
        cableBranchBoxList,
        boxTransformerList,
        powerSupplyList,
        transformerStationList,
        lineElementRelationList,
        // transformerIntervalList,
      })
      message.info('数据已上传，请重新插入图符')

      if (powerSupplyList.length || transformerStationList.length) {
        setlineAssemble(false)
        setIsRefresh(false)
      }
    }
  }

  /** 点位或者线路激活 */
  const isActiveFeature = (data: pointType | null) => {
    let lineType
    setClickCompanyId(data?.companyId)
    if (data) {
      const featureData = { ...data }
      setcurrentfeatureData({
        id: featureData.id,
        geom: featureData.geom,
        color: featureData.color || '',
      })
      setvisible(true)
      setpageDrawState(true)
      setzIndex('edit')
      form.resetFields()
      setcurrentFeatureType(featureData.featureType)
      const geom = featureData.geom
        .substring(featureData.geom.indexOf('(') + 1, featureData.geom.indexOf(')'))
        .split(' ')

      if (featureData.lineType) {
        lineType = featureData.lineType === 'Line' ? LINE : CABLECIRCUIT
      } else {
        lineType = featureData.isOverhead ? LINE : CABLECIRCUIT
      }

      setSelectLineType(lineType)
      form.setFieldsValue({
        ...featureData,
        lat: geom[1],
        lng: geom[0],
        lineType: lineType,
        lineId: featureData.lineId?.split(','),
        areas: transformAreaDataToArr(featureData),
      })
    } else {
      form.resetFields()
      setvisible(false)
      setpageDrawState(false)
    }
  }

  useUpdateEffect(() => {
    if (!clickCompanyId || clickCompanyId === companyId) {
      setIsSaveVisible(false)
    } else {
      setIsSaveVisible(true)
    }
  }, [clickCompanyId])

  const onClose = () => {
    setzIndex('create')
    setvisible(false)
    setpageDrawState(false)
  }

  /** 编辑 **/
  const onFinish = async (value: any) => {
    let color
    const currentThread = belongingLineData.find((item) => item.id === value.lineId[0]) // 上传数据颜色处理
    if (currentFeatureType === TRANSFORMERSUBSTATION) {
      // 如果是变电站就根据电压等级显示
      const kv = KVLEVELOPTIONS.find((item) => item.kvLevel === value.kvLevel)
      color = kv?.color[0].label
    } else if (currentFeatureType === POWERSUPPLY) {
      color = '咖啡'
    } else {
      // 否则就根据主线路的颜色显示
      color = currentThread ? currentThread.color : ''
    }
    let areaData = {}
    if (BELONGINGCAREA.includes(currentFeatureType)) {
      // 变电站和电源
      areaData = transformArrtToAreaData(value.areas, areaMap)
    }

    const params = {
      ...value,
      ...currentfeatureData,
      color,
      gridDataType: 1,
      ...areaData,
      lineId: value.lineId.join(),
    }
    try {
      switch (currentFeatureType) {
        case TOWER:
          await modifyTower({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case BOXTRANSFORMER:
          await modifyBoxTransformer({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case POWERSUPPLY:
          await modifyPowerSupply({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          setIsRefresh(!isRefresh)
          break
        case TRANSFORMERSUBSTATION:
          await modifyTransformerSubstation({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          setIsRefresh(!isRefresh)
          break
        case CABLEWELL:
          await modifyCableWell({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case RINGNETWORKCABINET:
          await modifyRingNetworkCabinet({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case ELECTRICITYDISTRIBUTIONROOM:
          await modifyElectricityDistributionRoom({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case SWITCHINGSTATION:
          await modifySwitchingStation({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case COLUMNCIRCUITBREAKER:
          await modifyColumnCircuitBreaker({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case COLUMNTRANSFORMER:
          await modifyColumnTransformer({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
        case CABLEBRANCHBOX:
          await modifyCableBranchBox({
            ...params,
            geom: `POINT (${value.lng} ${value.lat})`,
          })
          break
      }

      await modifyRelationLine({
        ...params,
        isOverhead: selectLineType === LINE,
      })

      let drawColor // 本地修改颜色处理
      if (currentFeatureType === TRANSFORMERSUBSTATION) {
        const exist = KVLEVELOPTIONS.find((item) => item.kvLevel === value.kvLevel)
        drawColor = exist ? exist.color[0].value : ''
      } else if (currentFeatureType === POWERSUPPLY) {
        drawColor = '#4D3900'
      } else {
        if (currentThread) {
          const exist = COLORU.find((item) => item.label === currentThread.color)
          drawColor = exist ? exist.value : ''
        }
      }
      editFeature(mapRef.map, {
        ...params,
        featureType: currentFeatureType,
        color: drawColor,
      })
      message.info('上传成功')
    } catch (err) {
      message.error('上传失败')
    }
  }

  // 删除地图要素
  const deleteFeature = async () => {
    const deleteData = getDeleFeatures()
    if (deleteData && deleteData.length) {
      try {
        const PromiseAll = []
        const deleteDataIds: string[] = []
        setIsRefresh(true)
        setisDragPoint(true)
        for (let i = 0; i < deleteData.length; i++) {
          deleteDataIds.push(deleteData[i].id)
          switch (deleteData[i].featureType) {
            case TOWER:
              PromiseAll.push(deleteTower([deleteData[i].id]))
              break
            case BOXTRANSFORMER:
              PromiseAll.push(deleteBoxTransformer([deleteData[i].id]))
              break
            case POWERSUPPLY:
              const PowerSupplyP = new Promise(async (resolve) => {
                const lines = await deletePowerSupply([deleteData[i].id])
                resolve(lines)
              })
              PromiseAll.push(PowerSupplyP)
              break
            case TRANSFORMERSUBSTATION:
              const TransformeP = new Promise(async (resolve) => {
                const lines = deleteTransformerSubstation([deleteData[i].id])
                resolve(lines)
              })
              PromiseAll.push(TransformeP)
              break
            case CABLEWELL:
              PromiseAll.push(deleteCableWell([deleteData[i].id]))
              break
            case RINGNETWORKCABINET:
              PromiseAll.push(deleteRingNetworkCabinet([deleteData[i].id]))
              break
            case ELECTRICITYDISTRIBUTIONROOM:
              PromiseAll.push(deleteElectricityDistributionRoom([deleteData[i].id]))
              break
            case SWITCHINGSTATION:
              PromiseAll.push(deleteSwitchingStation([deleteData[i].id]))
              break
            case COLUMNCIRCUITBREAKER:
              PromiseAll.push(deleteColumnCircuitBreaker([deleteData[i].id]))
              break
            case COLUMNTRANSFORMER:
              PromiseAll.push(deleteColumnTransformer([deleteData[i].id]))
              break
            case CABLEBRANCHBOX:
              PromiseAll.push(deleteCableBranchBox([deleteData[i].id]))
              break
            case CABLECIRCUIT: // 电缆线路
              PromiseAll.push(deleteLineRelations([deleteData[i].id]))
              break
            case LINE: // 架空线路
              PromiseAll.push(deleteLineRelations([deleteData[i].id]))
              break
          }
        }
        Promise.all(PromiseAll)
          .then((res) => {
            message.info('删除成功')
            setisDragPoint(false)
            // 删除点位后，需要刷新重复点位数据
            localStorage.setItem('deletePointIds', JSON.stringify(deleteDataIds))
            const rootData = deleteData.filter(
              (item: { featureType: string }) =>
                item.featureType === TRANSFORMERSUBSTATION || item.featureType === POWERSUPPLY
            )
            if (rootData.length) {
              setIsRefresh(false)
            }
            if (res && res.length) {
              const linesId = res.flat(Infinity).filter((item) => item)
              deletFeatureByTable(mapRef.map, null, linesId as string[])
            }
          })
          .catch((err) => {
            message.info('删除失败')
          })
      } catch (err) {}
    }
  }

  const handleOk = async (modelForm: FormInstance) => {
    // 上传间隔数据
    try {
      await stationItemsHandle({ transformerIntervalList: modelForm })
      seteditModel(false)
    } catch (err) {
      seteditModel(false)
    }
  }
  const handleCancel = () => {
    seteditModel(false)
  }

  // 是否拖动结束
  const isDragPointend = (isDrag: boolean) => {
    setisDragPoint(isDrag)
  }

  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref, isActiveFeature, isDragPointend })
    document.addEventListener('keydown', async (e) => {
      if (e.keyCode === 27) {
        // 上传本地绘制数据
        await uploadLocalData()
        // 退出手动绘制
        clear()
      }
      if (e.keyCode === 46) {
        // Delete键删除
        deletCurrrentSelectFeature(mapRef.map)
        deletBoxFeature(mapRef.map)
        deleteFeature()
      }
      if (e.keyCode === 16) {
        // Shift开启拉框删除
        setDrawBox(true)
      }
    })
  })

  document.addEventListener('keyup', async (e) => {
    if (e.keyCode === 16) {
      // Shift关闭拉框删除
      setDrawBox(false)
    }
  })

  // 获取所有所属线路
  const { data, run } = useRequest(getAllBelongingLineItem, {
    manual: true,
    onSuccess: () => {
      data && setbelongingLineData(data)
    },
  })

  /**  电压等级处理 */
  const EditKvLevel = () => {
    const currentKv = KVLEVELOPTIONS.filter((item) =>
      item.belonging.some((kv) => kv === currentFeatureType)
    )
    return currentKv.map((item) => {
      return (
        <Option key={item.kvLevel} value={item.kvLevel}>
          {item.label}
        </Option>
      )
    })
  }

  useEffect(() => {
    run(1)
  }, [isRefresh, run])

  return (
    <>
      <div ref={ref} id="planMap" className="w-full h-full"></div>
      <div
        id="tag"
        style={{ border: '1px solid black', background: 'white', padding: '0 5px' }}
      ></div>
      <Drawer
        title={`编辑${FEATUERTYPE[currentFeatureType]}属性`}
        visible={visible}
        getContainer={false}
        style={{
          position: 'absolute',
          width: getCurrrentSelectFeature() ? '378px' : 0,
          height: '100%',
          overflow: 'hidden',
          zIndex: zIndex === 'edit' ? 1000 : 900,
        }}
        mask={false}
        onClose={onClose}
      >
        <Form {...formItemLayout} style={{ marginTop: '10px' }} form={form} onFinish={onFinish}>
          {currentFeatureType !== CABLECIRCUIT && currentFeatureType !== LINE && (
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input />
            </Form.Item>
          )}
          {/* 杆塔 柱上断路器 柱上变压器*/}
          {BELONGINGLINE.includes(currentFeatureType) && (
            <Form.Item
              name="lineId"
              label="所属线路"
              rules={[{ required: true, message: '请选择所属线路' }]}
            >
              <Select dropdownStyle={{ zIndex: 3000 }} mode="multiple">
                {belongingLineData?.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="kvLevel"
            label="电压等级"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Select dropdownStyle={{ zIndex: 3000 }}>{EditKvLevel()}</Select>
          </Form.Item>
          {/* 变电站 */}
          {currentFeatureType === TRANSFORMERSUBSTATION && (
            <>
              <Form.Item name="designScaleMainTransformer" label="设计规模">
                <Input />
              </Form.Item>
              <Form.Item name="builtScaleMainTransformer" label="已建规模">
                <Input />
              </Form.Item>
              <Form.Item name="mainWiringMode" label="主接线方式">
                <Input />
              </Form.Item>
            </>
          )}
          {/* 杆塔 */}
          {currentFeatureType === TOWER && (
            <>
              <Form.Item name="towerSpecification" label="杆塔规格">
                <Input />
              </Form.Item>
              <Form.Item name="towerType" label="杆塔类型">
                <Input />
              </Form.Item>
              <Form.Item name="towerMaterial" label="杆塔材质">
                <Input />
              </Form.Item>
            </>
          )}
          {/* 电源 */}
          {currentFeatureType === POWERSUPPLY && (
            <>
              <Form.Item
                name="powerType"
                label="电源类型"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Select dropdownStyle={{ zIndex: 3000 }}>
                  <Option value="水电">水电</Option>
                  <Option value="火电">火电</Option>
                  <Option value="风电">风电</Option>
                  <Option value="光伏">光伏</Option>
                  <Option value="生物质能">生物质能</Option>
                </Select>
              </Form.Item>
              <Form.Item name="installedCapacity" label="装机容量">
                <Input />
              </Form.Item>
              <Form.Item name="schedulingMode" label="调度方式">
                <Input />
              </Form.Item>
            </>
          )}

          {/* 箱变 柱上变压器*/}
          {BELONGINGCAPACITY.includes(currentFeatureType) && (
            <>
              <Form.Item name="capacity" label="容量" rules={[verificationNaturalNumber]}>
                <Input addonAfter="(kAV)" />
              </Form.Item>
            </>
          )}
          {/* 环网箱 */}
          {BELONGINGMODEL.includes(currentFeatureType) && (
            <>
              <Form.Item name="model" label="型号">
                <Input />
              </Form.Item>
            </>
          )}
          {BELONGINGPROPERITIES.includes(currentFeatureType) && (
            <Form.Item name="properties" label="性质">
              <Select dropdownStyle={{ zIndex: 3000 }}>
                <Option value="公变">公变</Option>
                <Option value="专变">专变</Option>
              </Select>
            </Form.Item>
          )}
          {currentFeatureType === RINGNETWORKCABINET && (
            <Form.Item name="properties" label={`性质`}>
              <Select dropdownStyle={{ zIndex: 3000 }}>
                <Option value="公用">公用</Option>
                <Option value="专用">专用</Option>
              </Select>
            </Form.Item>
          )}
          {currentFeatureType === CABLECIRCUIT || currentFeatureType === LINE ? (
            <>
              <Form.Item name="lineType" label="线路类型">
                <Select
                  allowClear
                  dropdownStyle={{ zIndex: 3000 }}
                  onChange={(value: string) => {
                    setSelectLineType(value)
                    form.setFieldsValue({ lineModel: undefined })
                  }}
                >
                  {[
                    { label: '架空线路', value: 'Line' },
                    { label: '电缆线路', value: 'CableCircuit' },
                  ].map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="lineModel" label="线路型号">
                <Select dropdownStyle={{ zIndex: 3000 }}>
                  {selectLineType === LINE && selectLineType
                    ? LINEMODEL.map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))
                    : CABLECIRCUITMODEL.map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="lng" label="经度" rules={[verificationLng]}>
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度" rules={[verificationLat]}>
                <Input />
              </Form.Item>
            </>
          )}

          {currentFeatureType === CABLECIRCUIT && (
            <>
              <Form.Item name="channelType" label="通道类型">
                <Input placeholder="请输入通道类型" />
              </Form.Item>
              <Form.Item name="channelModel" label="通道型号">
                <Input placeholder="请输入通道型号" />
              </Form.Item>
              <Form.Item name="cableCapacity" label="电缆容量">
                <Input placeholder="请输入电缆容量" />
              </Form.Item>
            </>
          )}

          {currentFeatureType === TRANSFORMERSUBSTATION && (
            <Form.Item label="出线间隔">
              <Button
                onClick={() => {
                  seteditModel(true)
                }}
              >
                出线间隔
              </Button>
            </Form.Item>
          )}
          {BELONGINGCAREA.includes(currentFeatureType) && (
            <Form.Item name="areas" label={`区域`}>
              <Cascader options={areaData} />
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ offset: 5, span: 18 }}>
            <Button type="primary" htmlType="submit" block disabled={isSaveVisible}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      {currentFeatureType === TRANSFORMERSUBSTATION && (
        <EditTransformerSubstation
          editModel={editModel}
          id={currentfeatureData.id}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </>
  )
}

export default PlanMap

/** 编辑变电站出线间隔 */
const EditTransformerSubstation = (props: any) => {
  const { editModel, handleOk, handleCancel, id } = props
  const [form] = useForm()
  // 表单布局
  const formItemModelLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  // 获取所有所属线路
  const { data, run } = useRequest(() => getIntervalByTransformer({ transformerId: id }), {
    manual: true,
    onSuccess: () => {
      // 获取间隔数据，初始化表单
      if (data && data.length) {
        const formData = {}
        data.forEach((item) => {
          if (item.type === 6) {
            formData['id_110'] = item.id
            formData['publicuse_110'] = item.publicuse || 0
            formData['spare_110'] = item.spare || 0
            formData['specialPurpose_110'] = item.specialPurpose || 0
            formData['total_110'] = item.total || 0
          }
          if (item.type === 5) {
            formData['id_35'] = item.id
            formData['publicuse_35'] = item.publicuse || 0
            formData['spare_35'] = item.spare || 0
            formData['specialPurpose_35'] = item.specialPurpose || 0
            formData['total_35'] = item.total || 0
          }
          if (item.type === 3) {
            formData['id_10'] = item.id
            formData['publicuse_10'] = item.publicuse || 0
            formData['spare_10'] = item.spare || 0
            formData['specialPurpose_10'] = item.specialPurpose || 0
            formData['total_10'] = item.total || 0
          }
        })

        form.setFieldsValue({
          ...formData,
        })
      }
    },
  })

  useEffect(() => {
    id && editModel && run()
  }, [run, id, editModel])

  /** 转换数据 **/
  const convertData = (data: any, id: string) => {
    const Kv_110 = {
      publicuse_110: '',
      spare_110: '',
      specialPurpose_110: '',
      total_110: '',
      id_110: '',
    }
    const Kv_10 = {
      publicuse_10: '',
      spare_10: '',
      specialPurpose_10: '',
      total_10: '',
      id_10: '',
    }
    const Kv_35 = {
      publicuse_35: '',
      spare_35: '',
      specialPurpose_35: '',
      total_35: '',
      id_35: '',
    }
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (Object.keys(data)[i].includes('_10')) {
        Kv_10[Object.keys(data)[i]] = data[Object.keys(data)[i]]
      }
      if (Object.keys(data)[i].includes('_110')) {
        Kv_110[Object.keys(data)[i]] = data[Object.keys(data)[i]]
      }
      if (Object.keys(data)[i].includes('_35')) {
        Kv_35[Object.keys(data)[i]] = data[Object.keys(data)[i]]
      }
    }
    return [
      {
        publicuse: Kv_110.publicuse_110,
        spare: Kv_110.spare_110,
        specialPurpose: Kv_110.specialPurpose_110,
        total: Kv_110.total_110,
        id: Kv_110.id_110,
        type: 6,
        transformerSubstationId: id,
      },
      {
        publicuse: Kv_10.publicuse_10,
        spare: Kv_10.spare_10,
        specialPurpose: Kv_10.specialPurpose_10,
        total: Kv_10.total_10,
        id: Kv_10.id_10,
        type: 3,
        transformerSubstationId: id,
      },
      {
        publicuse: Kv_35.publicuse_35,
        spare: Kv_35.spare_35,
        specialPurpose: Kv_35.specialPurpose_35,
        total: Kv_35.total_35,
        id: Kv_35.id_35,
        type: 5,
        transformerSubstationId: id,
      },
    ]
  }

  return (
    <Modal
      title="编辑变压器出线间隔"
      visible={editModel}
      onOk={async () => {
        try {
          await form.validateFields()
          const formData = form.getFieldsValue()

          const data = convertData(formData, id)
          form.resetFields()
          handleOk(data)
        } catch (err) {}
      }}
      onCancel={() => {
        form.resetFields()
        handleCancel()
      }}
    >
      <div className="editTransformerSubstation">
        <Form form={form} {...formItemModelLayout}>
          <Form.Item name="id_110" hidden />
          <Form.Item name="id_35" hidden />
          <Form.Item name="id_10" hidden />
          <Form.Item
            label="110kV出线间隔公用"
            name="publicuse_110"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="110kV出线间隔专用"
            name="specialPurpose_110"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="110kV出线间隔备用"
            name="spare_110"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="110kV出线间隔总数"
            name="total_110"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="35kV出线间隔公用"
            name="publicuse_35"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="35kV出线间隔专用"
            name="specialPurpose_35"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="35kV出线间隔备用"
            name="spare_35"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="35kV出线间隔总数"
            name="total_35"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="10kV出线间隔公用"
            name="publicuse_10"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="10kV出线间隔专用"
            name="specialPurpose_10"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="10kV出线间隔备用"
            name="spare_10"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="10kV出线间隔总数"
            name="total_10"
            rules={[verificationNaturalNumber0to100]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
