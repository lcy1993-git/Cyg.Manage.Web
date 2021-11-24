import { CloseOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
import { Button, Form, Input, message, Popconfirm, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import {
  getHistoriesEnums,
  SaveHistoryData,
} from '@/pages/visualization-results/history-grid/service'
import {
  ElectricLineData,
  ElectricPointData,
} from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import getLineLength from '@/pages/visualization-results/history-grid/components/history-map-base/utils/getLength'
import { useHistoryGridContext } from '@/pages/visualization-results/history-grid/store'

const { Option } = Select

export interface ElectricalEquipmentForm {
  name: string
  id: string
  lat: number
  lng: number
  type: string
  remark: string
  length?: number
  level?: number | string
}

interface Props {
  updateHistoryVersion: () => void
}

const HistoryGirdForm: React.FC<Props> = (props) => {
  const { updateHistoryVersion } = props
  const {
    UIStatus,
    selectedData = [], //被选中的元素
    historyDataSource, // 绘制元素的数据源
  } = useHistoryGridContext()
  const [position, setPosition] = useState<number[]>([10, 155]) // 鼠标位置
  const [visible, setVisible] = useState<boolean>(false) // 是否可见
  const [showDetail, setShowDetail] = useState<boolean>(false) // 是否显示详情
  const [type, setType] = useState<'LineString' | 'Point'>('LineString') // 是否显示长度
  const [lineLength, setLineLength] = useState<number>(0)
  const {
    drawing, //是否绘制模式
    currentMousePosition, // 当前操作鼠标位置
  } = UIStatus
  const [form] = Form.useForm()
  const [KVLevel, setKVLevel] = useState<[]>([])
  const [lineType, setLineType] = useState<[]>([])
  const [equipmentsType, setEquipmentsType] = useState<[]>([])
  const handleDelete = async () => {
    const data = {
      lines: [],
      equipments: [],
    }
    if (type === 'Point') {
      // @ts-ignore
      data.toBeDeletedEquipmentIds = selectedData.map((item) => item.id)
    }
    if (type === 'LineString') {
      // @ts-ignore
      data.toBeDeletedLineIds = selectedData.map((item) => item.id)
    }
    await SaveHistoryData(data)
    message.success('删除成功')
    updateHistoryVersion()
  }
  const handleFinish = async (values: ElectricPointData | ElectricLineData) => {
    const data = {}
    if (selectedData?.length === 1) {
      values.type = Number(values.type)
      values.voltageLevel = Number(values.voltageLevel)
      if (type === 'LineString') {
        // @ts-ignore
        data['lines'] =
          historyDataSource?.lines.filter((item: ElectricLineData) => {
            if (item.id === selectedData[0]?.id) {
              item = Object.assign(item, values)
              return item
            }
          }) ?? []
      } else {
        // @ts-ignore
        data['equipments'] =
          historyDataSource?.equipments.filter((item: ElectricPointData) => {
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
          historyDataSource?.lines.filter((item: ElectricLineData) => {
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
          historyDataSource?.equipments.filter((item: ElectricPointData) => {
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
    await SaveHistoryData(data)
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
  useEffect(() => {
    if (drawing && selectedData?.length === 1) {
      setType(Object.keys(selectedData[0]).includes('startLng') ? 'LineString' : 'Point')
      setVisible(true)
      const val = { ...selectedData[0] }
      // @ts-ignore
      val.type = val.type + ''
      // @ts-ignore
      val.voltageLevel = val.voltageLevel + ''
      form.setFieldsValue(val)
      setShowDetail(false)
      setPosition([10, 155])
      if (Object.keys(selectedData[0]).includes('startLng')) {
        const l = getLineLength(
          // @ts-ignore
          [Number(selectedData[0]?.startLat), Number(selectedData[0]?.startLng)],
          // @ts-ignore
          [Number(selectedData[0]?.endLat), Number(selectedData[0]?.endLng)]
        )
        setLineLength(((l / 1000).toFixed(4) as unknown) as number)
      }
    } else if (drawing && selectedData?.length > 1) {
      form.setFieldsValue({
        name: '',
        type: '',
        remark: '',
        level: '',
      })
      setPosition([10, 155])
    } else if (!drawing && selectedData.length === 1) {
      setType(Object.keys(selectedData[0]).includes('startLng') ? 'LineString' : 'Point')
      setVisible(true)
      setShowDetail(true)
      setPosition(currentMousePosition)
      if (Object.keys(selectedData[0]).includes('startLng')) {
        const l = getLineLength(
          // @ts-ignore
          [Number(selectedData[0]?.startLat!), Number(selectedData[0]?.startLng)],
          // @ts-ignore
          [Number(selectedData[0]?.endLat), Number(selectedData[0]?.endLng)]
        )
        setLineLength(((l / 1000).toFixed(4) as unknown) as number)
      }
    } else if (selectedData.length === 0) {
      setVisible(false)
    }
  }, [drawing, selectedData, form])
  return (
    <div>
      {showDetail && visible && (
        <div
          className={styles.detailBox}
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
                display:
                  type === 'LineString' && selectedData.length === 1 ? 'inline-block' : 'none',
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
                <Input placeholder="名称" type="text" />
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
              {type === 'LineString' && selectedData.length === 1 && (
                <p className={styles.lengthBox}>
                  长度:
                  <span style={{ textIndent: '10px', display: 'inline-block' }}>
                    {lineLength}km
                  </span>
                </p>
              )}
              {selectedData?.length === 1 && (
                <Form.Item name="remark" label={'备注'}>
                  <Input.TextArea maxLength={200} rows={2} />
                </Form.Item>
              )}
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Space>
                  <Popconfirm
                    placement="topLeft"
                    title={'确认删除当前对象？'}
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button>删除</Button>
                  </Popconfirm>
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
