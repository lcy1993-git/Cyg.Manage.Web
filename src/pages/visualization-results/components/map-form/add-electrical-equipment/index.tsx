import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useMount, useUnmount } from 'ahooks'
import { Button, Form, Input, message, Modal, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import {
  getHistoriesEnums,
  saveData,
  SaveHistoryData,
} from '@/pages/visualization-results/history-grid/service'
import {
  ElectricLineData,
  ElectricPointData,
} from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import getLineLength from '@/pages/visualization-results/history-grid/components/history-map-base/utils/getLength'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'

const { Option } = Select
const { confirm } = Modal
export interface ElectricalEquipmentForm {
  name: string
  id: string
  lat: number
  lng: number
  type: string
  remark: string
  length?: number
  voltageLevel?: number | string
}

interface Props {
  updateHistoryVersion: () => void
}

const HistoryGirdForm: React.FC<Props> = (props) => {
  const { updateHistoryVersion } = props
  const {
    mode,
    UIStatus,
    selectedData = [], //被选中的元素
    currentGridData,
    historyDataSource, // 历史网架绘制元素的数据源
    preDesignDataSource, // 预设计网架绘制元素的数据源
  } = useHistoryGridContext()
  const [position, setPosition] = useState<number[]>([10, 155]) // 鼠标位置
  const [visible, setVisible] = useState<boolean>(false) // 是否可见
  const [showDetail, setShowDetail] = useState<boolean>(false) // 是否显示详情
  const [type, setType] = useState<'LineString' | 'Point'>('LineString') // 是否显示长度
  const [lineLength, setLineLength] = useState<number>(0)
  const {
    drawing, //是否绘制模式
    currentMousePosition, // 当前操作鼠标位置
    showHistoryLayer,
  } = UIStatus
  const [form] = Form.useForm()
  const [KVLevel, setKVLevel] = useState<[]>([])
  const [lineType, setLineType] = useState<[]>([])
  const [equipmentsType, setEquipmentsType] = useState<[]>([])
  const handleDelete = async () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的${type === 'Point' ? '电气设备' : '线路'}吗?`,
      async onOk() {
        const data = {
          lines: [],
          equipments: [],
        }
        if (type === 'Point') {
          // @ts-ignore
          data.toBeDeletedEquipmentIds = selectedData.map((item) => item.id)
          data['toBeDeletedLineIds'] = []
        }
        if (type === 'LineString') {
          // @ts-ignore
          data.toBeDeletedLineIds = selectedData.map((item) => item.id)
          data['toBeDeletedEquipmentIds'] = []
        }
        data['id'] = preDesignDataSource?.id
        if (mode === 'recordEdit') {
          await SaveHistoryData(data)
        } else if (mode === 'preDesigning') {
          await saveData(data)
        }
        message.success('删除成功')
        updateHistoryVersion()
      },
    })
  }
  const handleFinish = async (values: ElectricPointData | ElectricLineData) => {
    const data = {}
    const dataSource = mode === 'recordEdit' ? historyDataSource : preDesignDataSource
    if (selectedData?.length === 1) {
      values.type = Number(values.type)
      values.voltageLevel = Number(values.voltageLevel)
      if (type === 'LineString') {
        // @ts-ignore
        data['lines'] =
          dataSource?.lines.filter((item: ElectricLineData) => {
            if (item.id === selectedData[0]?.id) {
              item = Object.assign(item, values)
              return item
            }
          }) ?? []
      } else {
        // @ts-ignore
        data['equipments'] =
          dataSource?.equipments.filter((item: ElectricPointData) => {
            if (item.id === selectedData[0]?.id) {
              item = Object.assign(item, values)
              return item
            }
          }) ?? []
      }
    } else if (selectedData?.length > 1) {
      const ids = selectedData?.map((item) => item.id)
      if (type === 'LineString') {
        data['lines'] =
          // @ts-ignore
          dataSource?.lines.filter((item: ElectricLineData) => {
            if (ids?.includes(item.id)) {
              item = Object.assign(item, values)
              item.type = Number(values.type)
              item.voltageLevel = Number(values.voltageLevel)
              return item
            }
          }) ?? []
      } else {
        data['equipments'] =
          // @ts-ignore
          dataSource?.equipments.filter((item: ElectricPointData) => {
            if (ids?.includes(item.id)) {
              item = Object.assign(item, values)
              item.type = Number(values.type)
              item.voltageLevel = Number(values.voltageLevel)
              return item
            }
          }) ?? []
      }
    }
    if (Object.keys(data).includes('equipments')) {
      data['lines'] = []
    } else {
      data['equipments'] = []
    }
    data['toBeDeletedEquipmentIds'] = []
    data['toBeDeletedLineIds'] = []
    setVisible(false)

    if (mode === 'recordEdit') {
      await SaveHistoryData(data)
    } else if (mode === 'preDesigning') {
      data['id'] = preDesignDataSource?.id
      await saveData(data)
    }
    message.success('保存成功')
    updateHistoryVersion()
  }
  useMount(async () => {
    await getEnums()
  })
  const getEnums = async () => {
    const res = await getHistoriesEnums()
    const KV = res?.content?.find((item: { name: string }) => item.name === 'VoltageLevelType')
    const LT = res?.content?.find((item: { name: string }) => item.name === 'ElectricalLineType')
    const ET = res?.content?.find(
      (item: { name: string }) => item.name === 'ElectricalEquipmentType'
    )
    if (KV !== undefined) {
      // @ts-ignore
      setKVLevel(Object.entries(KV.valueDesPairs) ?? [])
    }
    if (LT !== undefined) {
      // @ts-ignore
      setLineType(Object.entries(LT.valueDesPairs) ?? [])
    }
    if (ET !== undefined) {
      // @ts-ignore
      setEquipmentsType(Object.entries(ET.valueDesPairs) ?? [])
    }
  }
  const hideModel = () => {
    setVisible(false)
  }
  const getLength = () => {
    let len = 0
    selectedData.map((item, index) => {
      len =
        len +
        getLineLength(
          // @ts-ignore
          [Number(item?.startLng!), Number(item?.startLat)],
          // @ts-ignore
          [Number(item?.endLng), Number(item?.endLat)]
        )
      return null
    })
    return len
  }
  const getEqualData = () => {
    const data = {
      name: '',
      voltageLevel: '',
      remark: '',
      type: '',
    }
    const nameArr: Iterable<any> | [] = []
    const voltageLevelArr: Iterable<any> | [] = []
    const typeArr: Iterable<any> | [] = []
    selectedData.map((item) => {
      nameArr.push(item.name)
      voltageLevelArr.push(item.voltageLevel)
      typeArr.push(item.type)
      return null
    })
    if (Array.from(new Set(nameArr)).length === 1) {
      data.name = nameArr[0]
    }
    if (Array.from(new Set(voltageLevelArr)).length === 1) {
      data.voltageLevel = voltageLevelArr[0] + ''
    }
    if (Array.from(new Set(typeArr)).length === 1) {
      data.type = typeArr[0] + ''
    }
    return data
  }
  const dragDetails = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX !== 0 && e.clientY !== 0 && e.ctrlKey && e.buttons === 1) {
      setPosition([e.pageX - 100, e.pageY - 40])
    }
  }
  useEffect(() => {
    setVisible(false)
  }, [currentGridData])
  useEffect(() => {
    if (drawing && selectedData?.length === 1) {
      setType(Object.keys(selectedData[0]).includes('startLng') ? 'LineString' : 'Point')
      setVisible(true)
      const val = { ...selectedData[0] }
      // @ts-ignore
      val.type = val.type + ''
      // @ts-ignore
      val.voltageLevel = val.voltageLevel + ''

      if (mode === 'preDesigning' && selectedData[0]?.sourceType === 'design') {
        // 与设计预设图层
        setShowDetail(false)
        setPosition([10, 155])
      } else if (mode === 'preDesigning' && selectedData[0]?.sourceType === 'history') {
        // 预设计历史图层
        setShowDetail(true)
        setPosition(currentMousePosition)
      } else {
        // 其他情况
        setShowDetail(false)
        setPosition([10, 155])
      }
      if (Object.keys(selectedData[0]).includes('startLng')) {
        const l = getLength()
        setLineLength(((l / 1000).toFixed(4) as unknown) as number)
      }
      setTimeout(() => {
        form.setFieldsValue(val)
      })
    } else if (drawing && selectedData?.length > 1) {
      form.setFieldsValue(getEqualData())
      if (Object.keys(selectedData[0]).includes('startLng')) {
        const l = getLength()
        setLineLength(((l / 1000).toFixed(4) as unknown) as number)
      }
      if (mode === 'preDesigning' && selectedData.some((item) => item?.sourceType === 'history')) {
        setShowDetail(true)
        setPosition(currentMousePosition)
      } else if (
        mode === 'preDesigning' &&
        selectedData.every((item) => item?.sourceType === 'design')
      ) {
        setPosition([10, 155])
        setShowDetail(false)
      } else {
        setPosition([10, 155])
        setShowDetail(false)
      }
    } else if (!drawing && selectedData.length === 1) {
      setType(Object.keys(selectedData[0]).includes('startLng') ? 'LineString' : 'Point')
      setVisible(true)
      setShowDetail(true)
      setPosition(currentMousePosition)
      if (Object.keys(selectedData[0]).includes('startLng')) {
        const l = getLength()
        setLineLength(((l / 1000).toFixed(4) as unknown) as number)
      }
    } else if (selectedData.length === 0) {
      setVisible(false)
    }
  }, [drawing, selectedData, form, mode])
  useEffect(() => {
    if (
      ['preDesign', 'preDesigning'].includes(mode) &&
      !showHistoryLayer &&
      selectedData?.[0]?.sourceType === 'history'
    ) {
      setVisible(false)
    } else if (showHistoryLayer && selectedData.length > 0) {
      setVisible(true)
    }
  }, [showHistoryLayer, mode])
  // useMount(()=>{
  //   window.addEventListener('keydown',(key)=>{
  //     if (key.key === 'Control'){
  //       setDraging(true)
  //     } else {
  //       setDraging(false)
  //     }
  //   })
  // })
  useUnmount(() => {
    window.removeEventListener('keydown', () => {})
  })
  return (
    <div>
      {showDetail && visible && (
        <div
          className={styles.detailBox}
          onMouseMove={(e) => dragDetails(e)}
          style={{
            width: 180,
            top: position[1] + 20,
            left: position[0] + 30,
          }}
        >
          <div className={styles.detailHeader}>
            <span>{type === 'LineString' ? '线路' : '电气设备'}</span>
            <CloseOutlined
              onClick={hideModel}
              style={{
                color: '#8C8C8C',
                fontSize: '12px',
                lineHeight: '30px',
              }}
            />
          </div>
          <div className={styles.detailContent}>
            <span className={styles.detailInfo}>名称: </span>
            <span className={styles.detailTitle}>{selectedData[0]?.name}</span>
            <span className={styles.detailInfo}>类型</span>
            <span className={styles.detailTitle}>{selectedData[0]?.typeStr}</span>
            <span className={styles.detailInfo}>电压等级:</span>
            <span className={styles.detailTitle}>{selectedData[0]?.voltageLevelStr} </span>
            <span
              className={styles.detailInfo}
              style={{
                display: type === 'LineString' ? 'inline-block' : 'none',
              }}
            >
              长度:
            </span>
            <span
              className={styles.detailTitle}
              style={{ display: type === 'LineString' ? 'inline-block' : 'none' }}
            >
              {lineLength}km{' '}
            </span>
            <span className={styles.detailInfo}>备注:</span>
            <span className={styles.detailTitle}> {selectedData[0]?.remark}</span>
          </div>
        </div>
      )}
      {!showDetail && visible && (
        <div
          className={styles.formBox}
          style={{
            width: '224px',
            top: position[1],
            left: position[0],
          }}
        >
          <div className={styles.header}>
            {!drawing ? (
              <div>{type === 'LineString' ? '线路' : '电气设备'}</div>
            ) : (
              <div>
                {type === 'LineString'
                  ? selectedData?.length === 0
                    ? `添加线路`
                    : '编辑线路'
                  : selectedData?.length === 0
                  ? `添加电气设备`
                  : '编辑电气设备'}
              </div>
            )}
            <CloseOutlined
              className={styles.closeIcon}
              onClick={hideModel}
              style={{ color: '#666666', fontSize: '14px' }}
            />
          </div>
          <div className={styles.form}>
            <Form
              form={form}
              onFinish={handleFinish}
              layout={showDetail ? 'horizontal' : 'vertical'}
            >
              <Form.Item name="name" label="名称">
                <Input placeholder="名称" type="text" maxLength={20} />
              </Form.Item>
              <Form.Item name="type" label={'类型'}>
                <Select>
                  {type === 'LineString' &&
                    lineType.map((item) => {
                      return (
                        <Option value={item[0]} key={item[0]}>
                          {item[1]}
                        </Option>
                      )
                    })}
                  {type === 'Point' &&
                    equipmentsType.map((item) => {
                      return (
                        <Option value={item[0]} key={item[0]}>
                          {item[1]}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
              <Form.Item name="voltageLevel" label={'电压等级'}>
                <Select style={{ width: '80px' }}>
                  {KVLevel.map((item) => {
                    return (
                      <Option value={item[0]} key={item[0]}>
                        {item[1]}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
              {type === 'LineString' && (
                <p className={styles.lengthBox}>
                  长度:
                  <span style={{ textIndent: '10px', display: 'inline-block' }}>
                    {lineLength}km
                  </span>
                </p>
              )}
              {selectedData?.length === 1 && (
                <Form.Item name="remark" label={'备注'}>
                  <Input.TextArea maxLength={200} rows={2} showCount />
                </Form.Item>
              )}
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Space>
                  <Button onClick={handleDelete}>删除</Button>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryGirdForm
