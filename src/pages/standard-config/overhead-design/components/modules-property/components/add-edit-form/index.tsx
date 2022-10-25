import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { FormCollaspeButton, FormExpandButton } from '@/components/form-hidden-button'
import SelectCanSearch from '@/components/select-can-search'
import UrlSelect from '@/components/url-select'
import {
  arrangement,
  forDesignType,
  forProjectType,
  loopNumber,
  meteorologic,
  segment,
} from '@/services/resource-config/resource-enum'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Select, Tooltip } from 'antd'
import React, { useState } from 'react'

const { Option } = Select
interface PoleTypeParams {
  type?: 'edit' | 'add'
  resourceLibId: string
  onSetDefaultForm?: any
}

const ModulesPropertyForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId, onSetDefaultForm } = props
  const [isHidden, setIsHidden] = useState<boolean>(true)

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
  const changeNameHandle = (value: string, type: string) => {
    if (type === 'select') {
      // 根据选择的id填充表单数据
      onSetDefaultForm?.(value)
    }
  }

  return (
    <>
      <CyFormItem
        label="模块名称"
        name="moduleName"
        required
        rules={[{ required: true, message: '模块名称不能为空' }]}
        labelWidth={108}
      >
        <SelectCanSearch
          url="/Modules/GetPageList"
          extraParams={{ resourceLibId: resourceLibId }}
          requestType="post"
          postType="body"
          requestSource="resource"
          titlekey="moduleName"
          valuekey="id"
          placeholder="请输入模块名称"
          onChange={changeNameHandle}
          searchKey="keyWord"
          dataStructure="items"
        />
      </CyFormItem>

      <CyFormItem
        label="杆型简号"
        name="poleTypeCode"
        required
        rules={[{ required: true, message: '杆型简号不能为空' }]}
        labelWidth={108}
      >
        <UrlSelect
          requestType="get"
          showSearch
          requestSource="resource"
          url="/Modules/GetPoleTypeList"
          titlekey="value"
          valuekey="value"
          placeholder="请选择杆型简号"
          postType="query"
          extraParams={{ libId: resourceLibId }}
        />
      </CyFormItem>

      <CyFormItem
        label="典设编码"
        name="typicalCode"
        required
        labelWidth={108}
        rules={[{ required: true, message: '典设编码不能为空' }]}
      >
        <Input placeholder="请输入典设编码" />
      </CyFormItem>
      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        required
        labelWidth={108}
        rules={[{ required: true, message: '单位不能为空' }]}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>
      <CyFormItem
        label="高度（m）"
        name="height"
        required
        rules={[{ required: true, message: '高度不能为空' }]}
        labelWidth={108}
      >
        <Input type="number" placeholder="请输入高度" />
      </CyFormItem>

      <CyFormItem
        label="埋深（m）"
        name="depth"
        required
        rules={[{ required: true, message: '埋深不能为空' }]}
        labelWidth={108}
      >
        <Input placeholder="请输入埋深" type="number" />
      </CyFormItem>
      <CyFormItem
        label="分段方式"
        name="segmentMode"
        required
        initialValue="不分段"
        labelWidth={108}
        rules={[{ required: true, message: '分段方式不能为空' }]}
      >
        <EnumSelect placeholder="请选择分段方式" enumList={segment} valueString />
      </CyFormItem>

      <CyFormItem
        label="导线排列方式"
        name="arrangement"
        required
        // initialValue="不分段"
        labelWidth={108}
        rules={[{ required: true, message: '导线排列方式不能为空' }]}
      >
        <EnumSelect placeholder="请选择导线排列方式" enumList={arrangement} valueString />
      </CyFormItem>

      <CyFormItem
        label="气象区"
        name="meteorologic"
        required
        initialValue="B类"
        labelWidth={108}
        rules={[{ required: true, message: '气象区不能为空' }]}
      >
        <EnumSelect placeholder="请选择气象区" enumList={meteorologic} valueString />
      </CyFormItem>

      <CyFormItem
        label="回路数"
        name="loopNumber"
        required
        initialValue="单回路"
        labelWidth={108}
        rules={[{ required: true, message: '回路数不能为空' }]}
      >
        <EnumSelect placeholder="请选择回路数" enumList={loopNumber} valueString />
      </CyFormItem>

      <CyFormItem
        label="线数"
        name="lineNumber"
        required
        initialValue={1}
        labelWidth={108}
        rules={[{ required: true, message: '线数不能为空' }]}
      >
        <Select>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
        </Select>
      </CyFormItem>
      {isHidden && (
        <div
          style={{ marginLeft: '108px' }}
          onClick={() => {
            setIsHidden(false)
          }}
        >
          <FormExpandButton label={108} />
        </div>
      )}
      <div style={{ display: isHidden ? 'none' : 'block' }}>
        <CyFormItem label="设计图" name="designChartIds" labelWidth={108}>
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
        <CyFormItem label="杆型一览图" name="towerModelChartIds" labelWidth={108}>
          <UrlSelect
            requestType="post"
            mode="multiple"
            showSearch
            requestSource="resource"
            url="/Chart/GetTowerModelChartList"
            titlekey="chartName"
            valuekey="chartId"
            placeholder="请选择图纸"
            postType="query"
            extraParams={{ libId: resourceLibId }}
          />
        </CyFormItem>
        <CyFormItem label="呼称高（m）" name="nominalHeight" labelWidth={108}>
          <Input placeholder="请输入呼称高" type="number" />
        </CyFormItem>

        <CyFormItem label="杆梢径（mm）" name="rodDiameter" labelWidth={108}>
          <Input placeholder="请输入杆梢径" type="number" />
        </CyFormItem>

        <CyFormItem label="所属工程" name="forProject" initialValue="不限" labelWidth={108}>
          <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
        </CyFormItem>

        <CyFormItem label="所属设计" name="forDesign" initialValue="不限" labelWidth={108}>
          <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
        </CyFormItem>
      </div>
      {!isHidden && (
        <div
          style={{ marginLeft: '108px' }}
          onClick={() => {
            setIsHidden(true)
          }}
        >
          <FormCollaspeButton label={108} />
        </div>
      )}
    </>
  )
}

export default ModulesPropertyForm
