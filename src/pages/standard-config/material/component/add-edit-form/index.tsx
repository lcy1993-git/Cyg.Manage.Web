import React from 'react'
import { Input, Tooltip } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import EnumSelect from '@/components/enum-select'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  materialType,
  supplySideType,
  kvBothLevelType,
  forProjectType,
  forDesignType,
} from '@/services/resource-config/resource-enum'
interface ChartListFromLibParams {
  resourceLibId: string
}

const MaterialForm: React.FC<ChartListFromLibParams> = (props) => {
  const { resourceLibId } = props

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
        label="物料编码"
        name="materialId"
        required
        rules={[{ required: true, message: '物料编码不能为空' }]}
      >
        <Input placeholder="请输入物料编码"></Input>
      </CyFormItem>

      <CyFormItem label="物资编号" name="code">
        <Input placeholder="请输入物资编号" />
      </CyFormItem>

      <CyFormItem
        label="物料类型"
        name="category"
        required
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <EnumSelect placeholder="请选择物料类型" enumList={materialType} valueString />
      </CyFormItem>

      <CyFormItem
        label="物料名称"
        name="materialName"
        required
        rules={[{ required: true, message: '物料名称不能为空' }]}
      >
        <Input placeholder="请输入物料名称"></Input>
      </CyFormItem>

      <CyFormItem
        label="规格型号"
        name="spec"
        required
        rules={[{ required: true, message: '规格型号不能为空' }]}
      >
        <Input placeholder="请输入规格型号" />
      </CyFormItem>

      <CyFormItem
        label="类别"
        name="materialType"
        required
        rules={[{ required: true, message: '类别不能为空' }]}
      >
        <Input placeholder="请输入类别" />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        rules={[{ required: true, message: '单位不能为空' }]}
        required
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="单重(kg)" name="pieceWeight">
        <Input placeholder="请输入单重" type="number" />
      </CyFormItem>

      <CyFormItem label="供给方" name="supplySide">
        <EnumSelect placeholder="请选择供给方" enumList={supplySideType} valueString allowClear />
      </CyFormItem>

      <CyFormItem label="运输类型" name="transportationType">
        <Input placeholder="请输入运输类型" />
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
          libId={resourceLibId}
        />
      </CyFormItem>
    </>
  )
}

export default MaterialForm
