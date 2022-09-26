import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { FormCollaspeButton, FormExpandButton } from '@/components/form-hidden-button'
import SelectCanSearch from '@/components/select-can-search'
import SelectCanUpdate from '@/components/select-can-update'
import UrlSelect from '@/components/url-select'
import {
  forDesignType,
  forProjectType,
  layingModeType,
} from '@/services/resource-config/resource-enum'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Tooltip } from 'antd'
import React, { useState } from 'react'

interface PoleTypeParams {
  type?: 'edit' | 'add'
  resourceLibId: string
  onSetDefaultForm?: any
}

const CableChannelForm: React.FC<PoleTypeParams> = (props) => {
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
        name="channelName"
        required
        rules={[{ required: true, message: '模块名称不能为空' }]}
        labelWidth={130}
        align="right"
      >
        <SelectCanSearch
          url="/CableChannel"
          extraParams={{ libId: resourceLibId }}
          requestType="post"
          postType="body"
          requestSource="resource"
          titlekey="channelName"
          valuekey="id"
          placeholder="请输入模块名称"
          onChange={changeNameHandle}
          searchKey="keyWord"
          dataStructure="items"
        />
      </CyFormItem>

      <CyFormItem
        label="模块简称"
        name="shortName"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '模块简称不能为空' }]}
      >
        <Input placeholder="请输入模块简称" />
      </CyFormItem>

      <CyFormItem
        label="简号"
        name="channelCode"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '简号不能为空' }]}
      >
        <Input placeholder="请输入简号" />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '单位不能为空' }]}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>
      <CyFormItem
        label="通道预留宽度(mm)"
        name="reservedWidth"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '通道预留宽度不能为空' }]}
      >
        <Input placeholder="请输入通道预留宽度" type="number" />
      </CyFormItem>

      <CyFormItem
        label="挖深(mm)"
        name="digDepth"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '挖深不能为空' }]}
      >
        <Input placeholder="请输入挖深" type="number" />
      </CyFormItem>

      <CyFormItem
        label="敷设方式"
        name="layingMode"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '敷设方式不能为空' }]}
      >
        <EnumSelect placeholder="请选择敷设方式" enumList={layingModeType} valueString />
      </CyFormItem>

      <CyFormItem
        label="可容纳电缆数量"
        name="cableNumber"
        labelWidth={130}
        align="right"
        required
        rules={[
          { required: true, message: '可容纳电缆数量不能为空' },
          { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
        ]}
      >
        <Input placeholder="请输入电缆数量" type="number" />
      </CyFormItem>

      <CyFormItem
        label="支架层数"
        name="bracketNumber"
        labelWidth={130}
        align="right"
        required
        rules={[
          { required: true, message: '支架层数不能为空' },
          { pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入自然数' },
        ]}
      >
        <Input placeholder="请输入支架层数" type="number" />
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
        <CyFormItem label="排列方式" name="arrangement" labelWidth={130} align="right">
          <SelectCanUpdate
            requestType="get"
            requestSource="resource"
            url="/CableChannel/GetArrangementList"
            titlekey="value"
            valuekey="value"
            placeholder="请选择排列方式"
            postType="query"
            extraParams={{ libId: resourceLibId }}
          />
        </CyFormItem>
        <CyFormItem label="设计图" name="designChartIds" labelWidth={130} align="right">
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
        <CyFormItem label="加工图" name="processChartIds" labelWidth={130} align="right">
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

        <CyFormItem
          label="所属工程"
          name="forProject"
          align="right"
          labelWidth={130}
          initialValue="不限"
        >
          <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
        </CyFormItem>

        <CyFormItem
          label="所属设计"
          name="forDesign"
          align="right"
          labelWidth={130}
          initialValue="不限"
        >
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

export default CableChannelForm
