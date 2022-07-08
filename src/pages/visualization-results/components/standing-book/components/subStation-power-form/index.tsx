import React, { useState } from 'react'
import { Button, Input, Select } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { equipKvLevel, GetStationItems } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { BelongingLineType } from '@/pages/visualization-results/grid-manage/DrawToolbar'
import {
  CABLECIRCUITMODEL,
  LINEMODEL,
} from '@/pages/visualization-results/grid-manage/DrawToolbar/GridUtils'
import TransIntervalTable from '../trans-interval-table'

interface SubStationPowerParams {
  currentEditTab: string
  form: any
  transId: string
}

const { Option } = Select

const SubStationPowerForm: React.FC<SubStationPowerParams> = (props) => {
  const { currentEditTab, form, transId } = props
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  const [selectLineType, setselectLineType] = useState('')
  const [currentKv, setCurrentKv] = useState<number>(Number(form.getFieldValue('kvLevel')))
  const { data: stationItems } = useRequest(GetStationItems, {
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  const [transTableVisible, setTransTableVisible] = useState<boolean>(false)

  const onChangeLineType = (value: string) => {
    setselectLineType(value)
    form.setFieldsValue({
      lineType: value,
      conductorModel: '',
      color: '',
    })
  }

  return (
    <>
      <CyFormItem
        name="name"
        label="名称"
        required
        rules={[{ required: true, message: '请输入名称' }]}
      >
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <EnumSelect
          placeholder="请选择电压等级"
          enumList={equipKvLevel}
          onChange={(value) => setCurrentKv(Number(value))}
        />
      </CyFormItem>

      {currentEditTab === 'mainLine' && (
        <>
          <CyFormItem
            name="belonging"
            label="所属厂站"
            rules={[{ required: true, message: '请选择所属厂站' }]}
          >
            <Select allowClear>
              {stationItemsData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </CyFormItem>

          <CyFormItem name="totalCapacity" label="配变总容量">
            <Input placeholder="请输入配变总容量" />
          </CyFormItem>

          <CyFormItem name="totalLength" label="线路总长度">
            <Input placeholder="请输入线路总长度" />
          </CyFormItem>

          <CyFormItem
            name="lineType"
            label="线路类型"
            rules={[{ required: true, message: '请选择线路类型' }]}
          >
            <Select allowClear dropdownStyle={{ zIndex: 3000 }} onChange={onChangeLineType}>
              <Option value="Line">架空线路</Option>
              <Option value="CableCircuit">电缆线路</Option>
            </Select>
          </CyFormItem>

          <CyFormItem
            name="conductorModel"
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
          </CyFormItem>
          <CyFormItem
            name="lineProperties"
            label="线路性质"
            rules={[{ required: true, message: '请选择线路性质' }]}
          >
            <Select>
              <Option value="公用">公用</Option>
              <Option value="专用">专用</Option>
            </Select>
          </CyFormItem>
        </>
      )}

      {currentKv === 3 && (
        <CyFormItem
          name="color"
          label="线路颜色"
          rules={[{ required: true, message: '请选择线路颜色' }]}
        >
          <Select allowClear>
            <Option value="青">青</Option>
            <Option value="蓝">蓝</Option>
            <Option value="黄">黄</Option>
            <Option value="红">红</Option>
            <Option value="洋红">洋红</Option>
          </Select>
        </CyFormItem>
      )}

      {currentEditTab === 'power' && (
        <>
          <CyFormItem
            label="电源类型"
            required
            name="powerType"
            rules={[{ required: true, message: '未选择电源类型' }]}
          >
            <Input placeholder="请选择电源类型" />
          </CyFormItem>
          <CyFormItem label="装机容量" name="installedCapacity">
            <Input placeholder="请输入装机容量" />
          </CyFormItem>
          <CyFormItem label="调度方式" name="schedulingMode">
            <Input placeholder="请输入调度方式" />
          </CyFormItem>
        </>
      )}
      {currentEditTab === 'subStations' && (
        <>
          <CyFormItem label="设计规模" name="designScaleMainTransformer">
            <Input placeholder="请输入设计规模" />
          </CyFormItem>
          <CyFormItem label="已建规模" name="builtScaleMainTransformer">
            <Input placeholder="请输入设计规模" />
          </CyFormItem>
          <CyFormItem label="主接线方式" name="mainWiringMode">
            <Input placeholder="请输入主接线方式" />
          </CyFormItem>
          <CyFormItem label="出线间隔" name="transformerInterval">
            <Button
              onClick={() => {
                setTransTableVisible(true)
              }}
            >
              出线间隔
            </Button>
          </CyFormItem>
        </>
      )}

      {currentEditTab !== 'mainLine' && (
        <>
          <CyFormItem label="经度" name="lng">
            <Input placeholder="请输入经度" />
          </CyFormItem>
          <CyFormItem label="纬度" name="lat">
            <Input placeholder="请输入纬度" />
          </CyFormItem>
        </>
      )}
      <TransIntervalTable
        transId={transId}
        onChange={setTransTableVisible}
        visible={transTableVisible}
      />
    </>
  )
}

export default SubStationPowerForm
