import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { FormCollaspeButton, FormExpandButton } from '@/components/form-hidden-button'
import SelectCanEdit from '@/components/select-can-edit'
import UrlSelect from '@/components/url-select'
import {
  electricalEquipmentComponentType,
  forDesignType,
  forProjectType,
} from '@/services/resource-config/resource-enum'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Tooltip } from 'antd'
import React, { useState } from 'react'

interface ChartListFromLibParams {
  resourceLibId: string
  type?: 'add' | 'edit'
  onSetDefaultForm?: any
}

const ElectricalEquipmentForm: React.FC<ChartListFromLibParams> = (props) => {
  const { type = 'edit', resourceLibId, onSetDefaultForm } = props
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [updateName, setUpdateName] = useState<string>('水泥')
  const unitSlot = () => {
    return (
      <>
        <span>单位</span>
        <Tooltip title="长度单位请用m/km" placement="top">
          <QuestionCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    )
  }
  const changeNameHandle = (value: string) => {
    setUpdateName(value)
  }
  const changeTypeHandle = (value: string, type: string) => {
    if (type === 'select') {
      // 选中下拉列表则添加模板数据
      onSetDefaultForm?.(value)
    }
  }

  return (
    <>
      <CyFormItem
        label="组件名称"
        name="componentName"
        required
        rules={[{ required: true, message: '组件名称不能为空' }]}
      >
        <Input placeholder="请输入组件名称" />
      </CyFormItem>

      <CyFormItem
        initialValue="电气设备"
        label="设备分类"
        name="deviceCategory"
        required
        rules={[{ required: true, message: '设备分类不能为空' }]}
      >
        <Input disabled />
      </CyFormItem>

      {/* <CyFormItem
        label="组件分类"
        name="componentType"
        required
        rules={[{ required: true, message: '组件分类不能为空' }]}
      >
        <Input placeholder="请输入组件分类" />
      </CyFormItem> */}
      <CyFormItem
        label="组件分类"
        name="componentType"
        required
        rules={[{ required: true, message: '组件分类不能为空' }]}
      >
        <EnumSelect
          placeholder="请选择组件分类"
          enumList={electricalEquipmentComponentType}
          valueString
          onChange={changeNameHandle}
        />
      </CyFormItem>

      <CyFormItem
        label="组件型号"
        name="componentSpec"
        required
        rules={[{ required: true, message: '组件型号不能为空' }]}
      >
        <SelectCanEdit
          url="/ElectricalEquipment/GetElectricalEquipmentByComponentTypeList"
          requestSource="resource"
          requestType="get"
          titlekey="componentSpec"
          valuekey="id"
          postType="body"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入组件型号"
          update={updateName}
          onChange={changeTypeHandle}
        />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        required
        rules={[{ required: true, message: '单位不能为空' }]}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>
      <CyFormItem
        label="典设编码"
        name="typicalCode"
        required
        rules={[{ required: true, message: '典设编码不能为空' }]}
      >
        <Input placeholder="请输入典设编码" />
      </CyFormItem>
      {isHidden && (
        <div
          onClick={() => {
            setIsHidden(false)
          }}
        >
          <FormExpandButton />
        </div>
      )}
      <div style={{ display: isHidden ? 'none' : 'block' }}>
        <CyFormItem label="设计图" name="designChartIds">
          <UrlSelect
            requestType="post"
            mode="multiple"
            showSearch
            requestSource="resource"
            url="/Chart/GetDesignChartList"
            titlekey="chartName"
            valuekey="chartId"
            placeholder="请选择图纸"
            postType="query"
            extraParams={{ libId: resourceLibId }}
          />
        </CyFormItem>
        <CyFormItem label="加工图" name="processChartIds">
          <UrlSelect
            requestType="post"
            mode="multiple"
            showSearch
            requestSource="resource"
            url="/Chart/GetProcessChartList"
            titlekey="chartName"
            valuekey="chartId"
            placeholder="请选择图纸"
            postType="query"
            extraParams={{ libId: resourceLibId }}
          />
        </CyFormItem>

        <CyFormItem label="所属工程" name="forProject" initialValue="不限">
          <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
        </CyFormItem>

        <CyFormItem label="所属设计" name="forDesign" initialValue="不限">
          <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
        </CyFormItem>
      </div>
      {!isHidden && (
        <div
          onClick={() => {
            setIsHidden(true)
          }}
        >
          <FormCollaspeButton />
        </div>
      )}
    </>
  )
}

export default ElectricalEquipmentForm
