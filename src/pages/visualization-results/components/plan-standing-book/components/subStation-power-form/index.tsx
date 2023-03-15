import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import { BelongingLineType } from '@/pages/visualization-results/grid-manage/DrawToolbar'
import {
  CABLECIRCUITMODEL,
  KVLEVELOPTIONS,
  KVLEVELTYPES,
  LINEMODEL,
} from '@/pages/visualization-results/grid-manage/DrawToolbar/GridUtils'
import { useMyContext } from '@/pages/visualization-results/plan-manage/Context'
import { GetStationItems } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Button, Cascader, Input, Select } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import TransIntervalTable from '../trans-interval-table'

interface SubStationPowerParams {
  currentEditTab: string
  form: any
  transId: string
  dataOnchange: Dispatch<SetStateAction<any[]>>
  intervalData: any[]
}

const { Option } = Select

const SubStationPowerForm: React.FC<SubStationPowerParams> = (props) => {
  const { currentEditTab, form, transId, dataOnchange, intervalData } = props
  const { areaData } = useMyContext()
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  const [selectLineType, setselectLineType] = useState<string>(form.getFieldValue('lineType'))
  const [currentKv, setCurrentKv] = useState<number>(Number(form.getFieldValue('kvLevel')))
  // 所属厂站表单项select当前选中值
  const [belonging, setBelonging] = useState<string | undefined>(form.getFieldValue('belonging'))
  // 终点厂站表单项select当前选中值
  const [endBelonging, setEndBelonging] = useState<string | undefined>(
    form.getFieldValue('endBelonging')
  )
  const { data: stationItems } = useRequest(() => GetStationItems(1), {
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  const [transTableVisible, setTransTableVisible] = useState<boolean>(false)
  // 可以展示终点厂站的电压等级数组集合
  const showEndBelongingKvLevels = KVLEVELOPTIONS.filter(
    (level) => level.belonging.includes('Line') && level.kvLevel !== 3
  ).map((item) => item.kvLevel)
  const handleKvOptions = (clickTab: string) => {
    return [
      ...KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
        item.belonging.find((type: string) =>
          type.includes(
            clickTab === 'subStations'
              ? 'TransformerSubstation'
              : clickTab === 'power'
              ? 'PowerSupply'
              : 'Line'
          )
        )
      ),
    ]
  }

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
        <UrlSelect
          showSearch
          titlekey="label"
          defaultData={handleKvOptions(currentEditTab)}
          valuekey="kvLevel"
          placeholder="请选择电压等级"
          onChange={(value) => {
            setCurrentKv(Number(value))
            form.setFieldsValue({
              color: undefined,
            })
          }}
        />
      </CyFormItem>

      {currentEditTab === 'mainLine' && (
        <>
          <CyFormItem
            name="belonging"
            label="所属厂站"
            required
            rules={[{ required: true, message: '请选择所属厂站' }]}
          >
            <Select
              allowClear
              onChange={(value: string | undefined) => {
                setBelonging(value)
              }}
            >
              {stationItemsData
                .filter((item) => item.id !== endBelonging)
                .map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </CyFormItem>
          {showEndBelongingKvLevels.includes(currentKv) && (
            <CyFormItem
              name="endBelonging"
              label="终点厂站"
              required
              rules={[{ required: true, message: '请选择终点厂站' }]}
            >
              <Select
                allowClear
                onChange={(value: string | undefined) => {
                  setEndBelonging(value)
                }}
              >
                {stationItemsData
                  .filter((item) => item.id !== belonging)
                  .map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </CyFormItem>
          )}

          <CyFormItem name="totalCapacity" label="配变总容量">
            <Input placeholder="请输入配变总容量" />
          </CyFormItem>

          <CyFormItem name="totalLength" label="线路总长度">
            <Input placeholder="请输入线路总长度" />
          </CyFormItem>

          <CyFormItem
            name="lineType"
            label="线路类型"
            required
            rules={[{ required: true, message: '请选择线路类型' }]}
          >
            <Select
              allowClear
              dropdownStyle={{ zIndex: 3000 }}
              onChange={onChangeLineType}
              disabled
            >
              <Option value="Line">架空线路</Option>
              <Option value="CableCircuit">电缆线路</Option>
            </Select>
          </CyFormItem>

          <CyFormItem
            name="conductorModel"
            label="线路型号"
            required
            rules={[{ required: true, message: '请选择线路型号' }]}
          >
            <Select dropdownStyle={{ zIndex: 3000 }} disabled>
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
            required
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
          required
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
            label="电源类型1"
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
          <TransIntervalTable
            dataOnchange={dataOnchange}
            intervalData={intervalData}
            transId={transId}
            onChange={setTransTableVisible}
            visible={transTableVisible}
          />
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
          <CyFormItem label="区域" name="areas">
            <Cascader options={areaData} />
          </CyFormItem>
        </>
      )}
    </>
  )
}

export default SubStationPowerForm
