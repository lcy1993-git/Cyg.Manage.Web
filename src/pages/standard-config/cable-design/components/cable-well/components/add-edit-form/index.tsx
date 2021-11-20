import React from 'react'
import { Input, Select, Tooltip } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import { QuestionCircleOutlined } from '@ant-design/icons'
import EnumSelect from '@/components/enum-select'
import {
  forDesignType,
  forProjectType,
  feature,
  coverMode,
  grooveStructure,
} from '@/services/resource-config/resource-enum'

interface PoleTypeParams {
  type?: 'edit' | 'add'
  resourceLibId: string
}

const { Option } = Select

const CableWellForm: React.FC<PoleTypeParams> = (props) => {
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
      {type == 'add' && (
        <CyFormItem
          label="模块编码"
          name="cableWellId"
          labelWidth={98}
          align="right"
          required
          rules={[{ required: true, message: '编号不能为空' }]}
        >
          <Input placeholder="请输入编号" />
        </CyFormItem>
      )}

      <CyFormItem
        label="类型"
        name="type"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem
        label="模块名称"
        name="cableWellName"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '模块名称不能为空' }]}
      >
        <Input placeholder="请输入模块名称" />
      </CyFormItem>

      <CyFormItem
        label="模块简称"
        name="shortName"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '模块简称不能为空' }]}
      >
        <Input placeholder="请输入模块简称" />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '单位不能为空' }]}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="设计图" name="designChartIds" labelWidth={98} align="right">
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
          libId={resourceLibId}
        />
      </CyFormItem>
      <CyFormItem label="加工图" name="processChartIds" labelWidth={98} align="right">
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
          libId={resourceLibId}
        />
      </CyFormItem>

      <CyFormItem
        label="所属工程"
        name="forProject"
        required
        align="right"
        labelWidth={98}
        initialValue="不限"
        rules={[{ required: true, message: '所属工程不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
      </CyFormItem>

      <CyFormItem
        label="所属设计"
        name="forDesign"
        required
        align="right"
        labelWidth={98}
        initialValue="不限"
        rules={[{ required: true, message: '所属设计不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
      </CyFormItem>

      <CyFormItem
        label="宽度(mm)"
        name="width"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '宽度不能为空' }]}
      >
        <Input placeholder="请输入宽度" type="number" />
      </CyFormItem>

      <CyFormItem
        label="井深(mm)"
        name="depth"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '井深不能为空' }]}
      >
        <Input placeholder="请输入井深" type="number" />
      </CyFormItem>

      <CyFormItem label="是否封闭" name="isConfined" labelWidth={98} align="right" initialValue={0}>
        <Select>
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      </CyFormItem>

      <CyFormItem
        labelWidth={98}
        align="right"
        label="是否转接孔管"
        name="isSwitchingPipe"
        initialValue={0}
      >
        <Select>
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      </CyFormItem>

      <CyFormItem
        label="特征"
        name="feature"
        labelWidth={98}
        align="right"
        initialValue="工作井"
        required
        rules={[{ required: true, message: '特征不能为空' }]}
      >
        <EnumSelect placeholder="请选择特征" enumList={feature} valueString />
      </CyFormItem>

      <CyFormItem
        label="路面环境"
        name="pavement"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '路面环境不能为空' }]}
      >
        <Input placeholder="请输入路面环境" />
      </CyFormItem>

      <CyFormItem
        label="尺寸"
        name="size"
        labelWidth={98}
        align="right"
        required
        rules={[{ required: true, message: '尺寸不能为空' }]}
      >
        <Input placeholder="请输入尺寸" />
      </CyFormItem>

      <CyFormItem
        label="盖板模式"
        name="coverMode"
        labelWidth={98}
        align="right"
        initialValue="人孔"
        required
        rules={[{ required: true, message: '盖板模式不能为空' }]}
      >
        <EnumSelect placeholder="请选择盖板模式" enumList={coverMode} valueString />
      </CyFormItem>

      <CyFormItem
        label="沟体结构"
        name="grooveStructure"
        labelWidth={98}
        align="right"
        initialValue="钢筋混凝土"
        required
        rules={[{ required: true, message: '沟体结构不能为空' }]}
      >
        <EnumSelect placeholder="请选择沟体结构" enumList={grooveStructure} valueString />
      </CyFormItem>
    </>
  )
}

export default CableWellForm
