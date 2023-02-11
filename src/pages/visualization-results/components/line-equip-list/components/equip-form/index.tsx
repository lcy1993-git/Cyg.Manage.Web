import React, { useState } from 'react'
import { Input, Select } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { getAllBelongingLineItem } from '@/services/grid-manage/treeMenu'
import {
  CABLECIRCUITMODEL,
  handleKvOptions,
  LINEMODEL,
} from '@/pages/visualization-results/grid-manage/DrawToolbar/GridUtils'
import { useRequest } from 'ahooks'
import { BelongingLineType } from '@/pages/visualization-results/grid-manage/DrawToolbar'
import UrlSelect from '@/components/url-select'

interface EquipFormParams {
  currentEditTab: string
  selectLineType: 'Line' | 'CableCircuit'
}

const { Option } = Select

const EquipForm: React.FC<EquipFormParams> = (props) => {
  const { currentEditTab, selectLineType } = props
  const [belongingLineData, setbelongingLineData] = useState<BelongingLineType[]>([])

  const { data } = useRequest(getAllBelongingLineItem, {
    onSuccess: () => {
      data && setbelongingLineData(data)
    },
  })

  return (
    <>
      {currentEditTab !== 'line' && (
        <CyFormItem
          name="name"
          label="名称"
          required
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input disabled placeholder="请输入名称" />
        </CyFormItem>
      )}

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <UrlSelect
          disabled
          showSearch
          titlekey="label"
          defaultData={handleKvOptions(currentEditTab)}
          valuekey="kvLevel"
          placeholder="请选择电压等级"
        />
      </CyFormItem>

      {currentEditTab === 'tower' && (
        <>
          <CyFormItem label="杆塔规格" name="towerSpecification">
            <Input disabled />
          </CyFormItem>
          <CyFormItem label="杆塔类型" name="towerType">
            <Input disabled />
          </CyFormItem>
          <CyFormItem label="杆塔材质" name="towerMaterial">
            <Input disabled />
          </CyFormItem>
        </>
      )}

      <CyFormItem
        name="lineId"
        label="所属线路"
        required
        rules={[{ required: true, message: '请选择所属线路' }]}
      >
        <Select disabled dropdownStyle={{ zIndex: 3000 }}>
          {belongingLineData.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </CyFormItem>

      {currentEditTab === 'line' && (
        <>
          <CyFormItem
            name="isOverhead"
            label="线路类型"
            rules={[{ required: true, message: '请选择线路类型' }]}
          >
            <Select allowClear disabled>
              {[
                { label: '架空线路', value: 'Line' },
                { label: '电缆线路', value: 'CableCircuit' },
              ].map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </CyFormItem>
          <CyFormItem
            name="lineModel"
            label="线路型号"
            rules={[{ required: true, message: '请选择线路类型' }]}
          >
            <Select disabled dropdownStyle={{ zIndex: 3000 }}>
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
        </>
      )}

      {currentEditTab === 'cabinet' && (
        <>
          <CyFormItem label="型号" name="model">
            <Input disabled placeholder="请输入型号" />
          </CyFormItem>
        </>
      )}

      {(currentEditTab === 'boxTrans' ||
        currentEditTab === 'elecRoom' ||
        currentEditTab === 'columnTrans') && (
        <>
          <CyFormItem label="容量" name="capacity">
            <Input disabled placeholder="请输入容量" />
          </CyFormItem>
        </>
      )}

      {(currentEditTab === 'boxTrans' ||
        currentEditTab === 'elecRoom' ||
        currentEditTab === 'columnTrans' ||
        currentEditTab === 'cabinet') && (
        <CyFormItem label="性质" name="properties">
          <Input disabled placeholder="请输入性质" />
        </CyFormItem>
      )}

      {currentEditTab !== 'line' && (
        <>
          <CyFormItem label="经度" name="lng">
            <Input disabled placeholder="请输入经度" />
          </CyFormItem>
          <CyFormItem label="纬度" name="lat">
            <Input disabled placeholder="请输入纬度" />
          </CyFormItem>
        </>
      )}
    </>
  )
}

export default EquipForm
