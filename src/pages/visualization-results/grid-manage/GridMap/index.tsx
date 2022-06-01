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
import { useMount, useRequest } from 'ahooks'
import { Button, Drawer, Form, FormInstance, Input, Modal, Select } from 'antd'
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
  CABLECIRCUITMODEL,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  createFeatureId,
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
  isOverhead?: boolean
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
  const [currentfeatureData, setcurrentfeatureData] = useState({ id: '', geom: '' })
  /**所属线路数据**/
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])
  const [visible, setvisible] = useState<boolean>(false)
  // 变电站间隔模态框
  const [editModel, seteditModel] = useState(false)
  // 上传所有点位
  const { run: stationItemsHandle } = useRequest(uploadAllFeature, { manual: true })
  const [selectLineType, setselectLineType] = useState('')
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
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
      const transformerIntervalList = transformerStationList.map((item: { id: any }) => {
        return {
          id: createFeatureId(),
          transformerSubstationId: item.id,
          publicuse: 0,
          spare: 0,
          specialPurpose: 0,
          total: 0,
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
        transformerIntervalList,
      })
    }
  }

  /** 选择线路型号 */
  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
    })
  }

  const isActiveFeature = (data: pointType | null) => {
    if (data) {
      const featureData = { ...data }
      setvisible(true)
      setzIndex('edit')
      form.resetFields()
      setcurrentLineKvLevel(Number(data.kvLevel))
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
        lineType: featureData.isOverhead ? 'Line' : 'CableCircuit',
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
          await modifyRelationLine({
            ...params,
            isOverhead: false,
          })
          break
        case LINE: // 架空线路
          await modifyRelationLine({
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
    if (deleteData && deleteData.length) {
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

  const FormRules = () => ({
    validator(_: any, value: string) {
      // const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/ 0到100的正整数 包含0 和100
      const reg = /^([0]|[1-9][0-9]*)$/
      if (reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('请输入0或正整数'))
    },
  })

  const FormRuleslng = () => ({
    validator: (_: any, value: string, callback: any) => {
      const reg =
        /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
      if (value === '' || !value) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('经度范围：-180~180（保留小数点后十五位）'))
        }
        callback()
      }
    },
  })
  const FormRuleslat = () => ({
    validator: (_: any, value: string, callback: any) => {
      const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
      if (value === '' || !value) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('纬度范围：-90~90（保留小数点后十五位）'))
        }
        callback()
      }
    },
  })

  useEffect(() => {
    run()
  }, [isRefresh, run])

  return (
    <>
      <div ref={ref} id="map" className="w-full h-full"></div>
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
          width: zIndex === 'edit' ? '378px' : 0,
          height: '100%',
          overflow: 'hidden',
          display: zIndex === 'edit' ? 'block' : 'none',
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

          <Form.Item
            name="kvLevel"
            label="电压等级"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Select
              dropdownStyle={{ zIndex: 3000 }}
              onChange={(value: number) => {
                setcurrentLineKvLevel(value)
              }}
            >
              {KVLEVELOPTIONS.map((item) => (
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
              <Form.Item name="capacity" label="容量" rules={[FormRules]}>
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
            <Form.Item name="properties" label="性质">
              <Select dropdownStyle={{ zIndex: 3000 }}>
                <Option value="公变">公变</Option>
                <Option value="专变">专变</Option>
              </Select>
            </Form.Item>
          )}

          {currentFeatureType === CABLECIRCUIT || currentFeatureType === LINE ? (
            <>
              <Form.Item
                name="lineType"
                label="线路类型"
                rules={[{ required: true, message: '请选择线路类型' }]}
              >
                <Select allowClear onChange={onChangeLineType} dropdownStyle={{ zIndex: 3000 }}>
                  <Option value="Line">架空线路</Option>
                  <Option value="CableCircuit">电缆线路</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="lineModel"
                label="线路型号"
                rules={[{ required: true, message: '请选择线路型号' }]}
              >
                <Select dropdownStyle={{ zIndex: 3000 }}>
                  {selectLineType === 'Line' && selectLineType
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
              {currentLineKvLevel === 3 && (
                <Form.Item
                  name="color"
                  label="颜色"
                  rules={[{ required: true, message: '请选择线路颜色' }]}
                >
                  <Select allowClear>
                    <Option value="#00FFFF">青</Option>
                    <Option value="#1EB9FF">蓝</Option>
                    <Option value="#F2DA00">黄</Option>
                    <Option value="#FF3E3E">红</Option>
                    <Option value="#FF5ECF">洋红</Option>
                  </Select>
                </Form.Item>
              )}
            </>
          ) : (
            <>
              {currentLineKvLevel === 3 && (
                <Form.Item
                  name="color"
                  label="颜色"
                  rules={[{ required: true, message: '请选择线路颜色' }]}
                >
                  <Select allowClear>
                    <Option value="#00FFFF">青</Option>
                    <Option value="#1EB9FF">蓝</Option>
                    <Option value="#F2DA00">黄</Option>
                    <Option value="#FF3E3E">红</Option>
                    <Option value="#FF5ECF">洋红</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item name="lng" label="经度" rules={[FormRuleslng]}>
                <Input />
              </Form.Item>
              <Form.Item name="lat" label="纬度" rules={[FormRuleslat]}>
                <Input />
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
          <Form.Item wrapperCol={{ offset: 5, span: 18 }}>
            <Button type="primary" htmlType="submit" block>
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

export default GridMap
const formItemModelLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const EditTransformerSubstation = (props: any) => {
  const { editModel, handleOk, handleCancel, id } = props

  const FormRules = () => ({
    validator(_: any, value: string) {
      // const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/
      const reg = /^([0]|[1-9][0-9]*)$/
      if (reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('请输入0到100的正整数'))
    },
  })

  // 获取所有所属线路
  const { data, run } = useRequest(() => getIntervalByTransformer({ transformerId: id }), {
    manual: true,
    onSuccess: () => {
      // 获取间隔数据，初始化表单
      if (data && data.length) {
        const formData = {}
        data.forEach((item) => {
          if (item.type === 6) {
            formData['publicuse_110'] = item.publicuse || 0
            formData['spare_110'] = item.spare || 0
            formData['specialPurpose_110'] = item.specialPurpose || 0
            formData['total_110'] = item.total || 0
          }
          if (item.type === 5) {
            formData['publicuse_35'] = item.publicuse || 0
            formData['spare_35'] = item.spare || 0
            formData['specialPurpose_35'] = item.specialPurpose || 0
            formData['total_35'] = item.total || 0
          }
          if (item.type === 3) {
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

  // getIntervalByTransformer

  /** 转换数据 **/
  const convertData = (data: any, id: string) => {
    const Kv_110 = {
      publicuse_110: '',
      spare_110: '',
      specialPurpose_110: '',
      total_110: '',
    }
    const Kv_10 = {
      publicuse_10: '',
      spare_10: '',
      specialPurpose_10: '',
      total_10: '',
    }
    const Kv_35 = {
      publicuse_35: '',
      spare_35: '',
      specialPurpose_35: '',
      total_35: '',
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
        type: 6,
        transformerSubstationId: id,
        id: createFeatureId(),
      },
      {
        publicuse: Kv_10.publicuse_10,
        spare: Kv_10.spare_10,
        specialPurpose: Kv_10.specialPurpose_10,
        total: Kv_10.total_10,
        type: 3,
        transformerSubstationId: id,
        id: createFeatureId(),
      },
      {
        publicuse: Kv_35.publicuse_35,
        spare: Kv_35.spare_35,
        specialPurpose: Kv_35.specialPurpose_35,
        total: Kv_35.total_35,
        type: 5,
        transformerSubstationId: id,
        id: createFeatureId(),
      },
    ]
  }

  const [form] = useForm()
  return (
    <Modal
      title="编辑变压器出线间隔"
      visible={editModel}
      onOk={() => {
        const formData = form.getFieldsValue()
        const data = convertData(formData, id)
        form.resetFields()
        handleOk(data)
      }}
      onCancel={() => {
        form.resetFields()
        handleCancel()
      }}
    >
      <div className="editTransformerSubstation">
        <Form form={form} {...formItemModelLayout}>
          <Form.Item label="110kV出线间隔公用" name="publicuse_110" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="110kV出线间隔专用" name="specialPurpose_110" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="110kV出线间隔备用" name="spare_110" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="110kV出线间隔总数" name="total_110" rules={[FormRules]}>
            <Input />
          </Form.Item>

          <Form.Item label="35kV出线间隔公用" name="publicuse_35" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="35kV出线间隔专用" name="specialPurpose_35" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="35kV出线间隔备用" name="spare_35" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="35kV出线间隔总数" name="total_35" rules={[FormRules]}>
            <Input />
          </Form.Item>

          <Form.Item label="10kV出线间隔公用" name="publicuse_10" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="10kV出线间隔专用" name="specialPurpose_10" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="10kV出线间隔备用" name="spare_10" rules={[FormRules]}>
            <Input />
          </Form.Item>
          <Form.Item label="10kV出线间隔总数" name="total_10" rules={[FormRules]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
