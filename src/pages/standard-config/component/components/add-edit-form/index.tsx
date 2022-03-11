import React from 'react'
import { Input, Tooltip } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import { QuestionCircleOutlined } from '@ant-design/icons'
import EnumSelect from '@/components/enum-select'
import {
  deviceCategoryType,
  kvBothLevelType,
  forDesignType,
  forProjectType,
} from '@/services/resource-config/resource-enum'

interface ChartListFromLibParams {
  resourceLibId: string
  type?: 'add' | 'edit'
}

const ComponentForm: React.FC<ChartListFromLibParams> = (props) => {
  const { type = 'edit', resourceLibId } = props

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

  return (
    <>
      <CyFormItem
        label="组件编码"
        name="componentId"
        required
        rules={[{ required: true, message: '组件编码不能为空' }]}
      >
        <Input placeholder="请输入组件编码"></Input>
      </CyFormItem>

      <CyFormItem
        label="组件名称"
        name="componentName"
        required
        rules={[{ required: true, message: '组件名称不能为空' }]}
      >
        <Input placeholder="请输入组件名称" />
      </CyFormItem>

      <CyFormItem
        label="组件型号"
        name="componentSpec"
        required
        rules={[{ required: true, message: '组件型号不能为空' }]}
      >
        <Input placeholder="请输入组件型号" />
      </CyFormItem>

      <CyFormItem label="典设编码" name="typicalCode">
        <Input placeholder="请输入典设编码" />
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
        label="设备分类"
        name="deviceCategory"
        initialValue="杆上组件"
        required
        rules={[{ required: true, message: '设备分类不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属设计" enumList={deviceCategoryType} valueString />
      </CyFormItem>

      <CyFormItem
        label="组件分类"
        name="componentType"
        required
        rules={[{ required: true, message: '组件分类不能为空' }]}
      >
        <Input placeholder="请输入组件分类" />
      </CyFormItem>

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        initialValue="不限"
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <EnumSelect placeholder="请选择电压等级" enumList={kvBothLevelType} valueString />
      </CyFormItem>

      <CyFormItem
        label="所属工程"
        name="forProject"
        required
        initialValue="不限"
        rules={[{ required: true, message: '所属工程不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
      </CyFormItem>

      <CyFormItem
        label="所属设计"
        name="forDesign"
        required
        initialValue="不限"
        rules={[{ required: true, message: '所属设计不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
      </CyFormItem>

      <CyFormItem label="加工图" name="chartIds">
        <UrlSelect
          requestType="post"
          mode="multiple"
          showSearch
          requestSource="resource"
          url="/Chart/GetList"
          titlekey="chartName"
          valuekey="chartId"
          placeholder="请选择图纸"
          postType="query"
          extraParams={{ libId: resourceLibId }}
        />
      </CyFormItem>
    </>
  )
}

export default ComponentForm
