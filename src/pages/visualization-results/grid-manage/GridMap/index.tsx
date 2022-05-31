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
  modifyBoxTransformer,
  modifyCableBranchBox,
  modifyCableWell,
  modifyColumnCircuitBreaker,
  modifyColumnTransformer,
  modifyElectricityDistributionRoom,
  modifyLine,
  modifyPowerSupply,
  modifyRingNetworkCabinet,
  modifySwitchingStation,
  modifyTower,
  modifyTransformerSubstation,
  uploadAllFeature,
} from '@/services/grid-manage/treeMenu'
import { useMount, useRequest } from 'ahooks'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { message } from 'antd/es'
import { useEffect, useRef, useState } from 'react'
import { useMyContext } from '../Context'
import {
  BELONGINGCAPACITY,
  BELONGINGLINE,
  BELONGINGMODEL,
  BELONGINGPROPERITIES,
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUIT,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  FEATUERTYPE,
  KVLEVELOPTIONS,
  KVLEVELTYPES,
  LINE,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../DrawToolbar/GridUtils'
import { clear, getDrawLines, getDrawPoints, initMap } from './utils/initializeMap'
import { deletCurrrentSelectFeature, editFeature, getDeleFeatures } from './utils/select'
interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
}

interface pointType {
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
  model?: string
  properties?: string
  lng?: string
  geom: string
  id: string
}

const { useForm } = Form
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}
const GridMap = () => {
  const [form] = useForm()
  const { mapRef, setisRefresh, isRefresh, setzIndex, zIndex } = useMyContext()

  const ref = useRef<HTMLDivElement>(null)
  const [currentFeatureType, setcurrentFeatureType] = useState('')
  const [currentfeatureData, setcurrentfeatureData] = useState({})
  /**所属线路数据**/
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])
  const [visible, setvisible] = useState<boolean>(false)
  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, { manual: true })

  /** 上传本地数据 **/
  const uploadLocalData = async () => {
    const pointData = getDrawPoints()
    const lineData = getDrawLines()
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
      })
    }
  }

  const isActiveFeature = (data: pointType | null) => {
    if (data) {
      const featureData = { ...data }
      setvisible(true)
      setzIndex('edit')
      form.resetFields()
      setcurrentFeatureType(featureData.featureType)
      setcurrentfeatureData({
        id: featureData.id,
        geom: featureData.geom,
      })
      const geom = featureData.geom
        .substring(featureData.geom.indexOf('(') + 1, featureData.geom.indexOf(')'))
        .split(' ')

      form.setFieldsValue({
        ...featureData,
        lat: geom[1],
        lng: geom[0],
      })
    } else {
      form.resetFields()
      setvisible(false)
    }
  }

  const onClose = () => {
    setzIndex('create')
    setvisible(false)
  }

  /** 编辑 **/
  const onFinish = async (value: any) => {
    const params = {
      ...value,
      ...currentfeatureData,
    }

    try {
      switch (currentFeatureType) {
        case TOWER:
          await modifyTower(params)
          break
        case BOXTRANSFORMER:
          await modifyBoxTransformer(params)
          break
        case POWERSUPPLY:
          await modifyPowerSupply(params)
          break
        case TRANSFORMERSUBSTATION:
          await modifyTransformerSubstation(params)
          break
        case CABLEWELL:
          await modifyCableWell(params)
          break
        case RINGNETWORKCABINET:
          await modifyRingNetworkCabinet(params)
          break
        case ELECTRICITYDISTRIBUTIONROOM:
          await modifyElectricityDistributionRoom(params)
          break
        case SWITCHINGSTATION:
          await modifySwitchingStation(params)
          break
        case COLUMNCIRCUITBREAKER:
          await modifyColumnCircuitBreaker(params)
          break
        case COLUMNTRANSFORMER:
          await modifyColumnTransformer(params)
          break
        case CABLEBRANCHBOX:
          await modifyCableBranchBox(params)
          break
        case CABLECIRCUIT: // 电缆线路
          await modifyLine({
            ...params,
            isOverhead: false,
          })
          break
        case LINE: // 架空线路
          await modifyLine({
            ...params,
            isOverhead: true,
          })
          break
      }
      editFeature(mapRef.map, {
        ...params,
        featureType: currentFeatureType,
      })
      message.info('上传成功')
    } catch (err) {
      message.error('上传失败')
    }
  }

  // 删除地图要素
  const deleteFeature = async () => {
    const deleteData = getDeleFeatures()
    const PromiseAll = []
    for (let i = 0; i < deleteData.length; i++) {
      switch (deleteData[i].featureType) {
        case TOWER:
          PromiseAll.push(deleteTower([deleteData[i].id]))
          break
        case BOXTRANSFORMER:
          PromiseAll.push(deleteBoxTransformer([deleteData[i].id]))
          break
        case POWERSUPPLY:
          PromiseAll.push(deletePowerSupply([deleteData[i].id]))
          break
        case TRANSFORMERSUBSTATION:
          PromiseAll.push(deleteTransformerSubstation([deleteData[i].id]))
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
      })
      .catch((err) => {
        message.info('删除失败')
      })
  }

  // 挂载地图
  useMount(() => {
    initMap({ mapRef, ref, isActiveFeature })
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        // 上传本地绘制数据
        uploadLocalData()
        // 退出手动绘制
        clear()
        // 刷新列表
        setisRefresh(true)
      }
      if (e.keyCode === 46) {
        deletCurrrentSelectFeature(mapRef.map)
        deleteFeature()
      }
    })
  })

  // 获取所有所属线路
  const { data, run } = useRequest(getAllBelongingLineItem, {
    manual: true,
    onSuccess: () => {
      data && setbelongingLineData(data)
    },
  })

  useEffect(() => {
    run()
  }, [isRefresh, run])

  return (
    <>
      <div ref={ref} id="map" className="w-full h-full"></div>
      <div id="tag"></div>
      <Drawer
        title={`编辑${FEATUERTYPE[currentFeatureType]}属性`}
        visible={visible}
        getContainer={false}
        style={{
          position: 'absolute',
          width: '378px',
          height: '100%',
          overflow: 'hidden',
          zIndex: zIndex === 'edit' ? 1000 : 900,
        }}
        mask={false}
        onClose={onClose}
      >
        <Form {...formItemLayout} style={{ marginTop: '10px' }} form={form} onFinish={onFinish}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="kvLevel"
            label="电压等级"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Select dropdownStyle={{ zIndex: 3000 }}>
              {KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
                item.belonging.find((type: string) => type.includes(currentFeatureType))
              ).map((item) => (
                <Option key={item.kvLevel} value={item.kvLevel}>
                  {item.label}
                </Option>
              ))}
            </Select>
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

          {/* 杆塔 柱上断路器 柱上变压器*/}
          {BELONGINGLINE.includes(currentFeatureType) && (
            <Form.Item
              name="lineId"
              label="所属线路"
              rules={[{ required: true, message: '请选择所属线路' }]}
            >
              <Select dropdownStyle={{ zIndex: 3000 }}>
                {belongingLineData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 箱变 柱上变压器*/}
          {BELONGINGCAPACITY.includes(currentFeatureType) && (
            <>
              <Form.Item name="capacity" label="容量">
                <Input />
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
            <Form.Item name="properties" label="配变性质">
              <Select dropdownStyle={{ zIndex: 3000 }}>
                <Option value="公变">公变</Option>
                <Option value="专变">专变</Option>
              </Select>
            </Form.Item>
          )}

          {currentFeatureType === CABLECIRCUIT || currentFeatureType === LINE ? (
            <></>
          ) : (
            <>
              <Form.Item name="lng" label="经度">
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度">
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default GridMap
