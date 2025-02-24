import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { FormCollaspeButton, FormExpandButton } from '@/components/form-hidden-button'
import SelectCanSearch from '@/components/select-can-search'
import SelectCanUpdate from '@/components/select-can-update'
import UrlSelect from '@/components/url-select'
import { deviceCategoryType, kvBothLevelType } from '@/services/resource-config/resource-enum'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Input, Select, Tooltip } from 'antd'
import React, { useState } from 'react'

interface ChartListFromLibParams {
  resourceLibId: string
  type?: 'add' | 'edit'
  onSetDefaultForm?: any
  form: any
  formData?: any
}

const ComponentForm: React.FC<ChartListFromLibParams> = (props) => {
  const { resourceLibId, onSetDefaultForm, form, formData } = props
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [updateName, setUpdateName] = useState<string>('')
  const [deviceCategory, setDeviceCategory] = useState<string>(form.getFieldValue('deviceCategory'))

  const isTransformer = deviceCategory === '变压器'
  useUpdateEffect(() => {
    if (formData && formData.deviceCategory) {
      setDeviceCategory(formData.deviceCategory)
    }
  }, [formData])

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
  const changeSpecHandle = (value: string, type: string) => {
    if (type === 'select') {
      // 选中下拉列表则添加模板数据
      onSetDefaultForm?.(value)
    }
  }
  const changeDeviceCategoryHandle = (value: string) => {
    setDeviceCategory(value)
  }

  return (
    <>
      <CyFormItem
        label="组件名称"
        name="componentName"
        required
        rules={[{ required: true, message: '组件名称不能为空' }]}
        labelWidth={98}
      >
        <SelectCanSearch
          url="/Component/GetComponentByNameList"
          extraParams={{ libId: resourceLibId }}
          requestType="post"
          postType="query"
          requestSource="resource"
          titlekey="value"
          valuekey="value"
          placeholder="请输入名称"
          onChange={changeNameHandle}
        />
      </CyFormItem>
      <CyFormItem
        label="组件型号"
        name="componentSpec"
        required
        rules={[{ required: true, message: '组件型号不能为空' }]}
        labelWidth={98}
      >
        <SelectCanUpdate
          url="/Component/GetListBySpec"
          requestSource="resource"
          requestType="post"
          titlekey="componentSpec"
          valuekey="id"
          postType="body"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入组件型号"
          onChange={changeSpecHandle}
          update={updateName}
        />
      </CyFormItem>

      <CyFormItem
        label="组件分类"
        name="componentType"
        required
        rules={[{ required: true, message: '组件分类不能为空' }]}
        labelWidth={98}
      >
        <SelectCanUpdate
          url="/Component/GetComponentTypeListByType"
          requestSource="resource"
          requestType="post"
          titlekey="key"
          valuekey="value"
          postType="query"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入组件分类"
        />
      </CyFormItem>
      <CyFormItem
        label="设备分类"
        name="deviceCategory"
        // initialValue="杆上组件"
        required
        rules={[{ required: true, message: '设备分类不能为空' }]}
        labelWidth={98}
      >
        <EnumSelect
          placeholder="请选择设备分类"
          enumList={deviceCategoryType}
          valueString
          onChange={changeDeviceCategoryHandle}
        />
      </CyFormItem>
      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        required
        rules={[{ required: true, message: '单位不能为空' }]}
        labelWidth={98}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        initialValue="不限"
        rules={[{ required: true, message: '电压等级不能为空' }]}
        labelWidth={98}
      >
        <EnumSelect placeholder="请选择电压等级" enumList={kvBothLevelType} valueString />
      </CyFormItem>
      {isTransformer && (
        <CyFormItem
          label="变压器容量"
          name="capacity"
          required
          rules={[{ required: true, message: '变压器容量不能为空' }]}
          labelWidth={98}
        >
          <Input placeholder="请输入变压器容量" />
        </CyFormItem>
      )}
      {isTransformer && (
        <CyFormItem
          label="主杆杆高(米)"
          name="mainTowerHeight"
          labelWidth={98}
          initialValue={8}
          required
          rules={[{ required: true, message: '主杆杆高不能为空' }]}
        >
          <Select
            options={[
              { label: '8', value: 8 },
              { label: '10', value: 10 },
              { label: '12', value: 12 },
              { label: '15', value: 15 },
            ]}
            placeholder="请选择主杆杆高"
          />
        </CyFormItem>
      )}
      {isHidden && (
        <div
          style={{ marginLeft: '98px' }}
          onClick={() => {
            setIsHidden(false)
          }}
        >
          <FormExpandButton label={98} />
        </div>
      )}
      <div style={{ display: isHidden ? 'none' : 'block' }}>
        <CyFormItem label="加工图" name="processChartIds" labelWidth={98}>
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
        <CyFormItem label="典设编码" name="typicalCode" labelWidth={98}>
          <Input placeholder="请输入典设编码" />
        </CyFormItem>
        {/* <CyFormItem label="所属工程" name="forProject" initialValue="不限" labelWidth={98}>
          <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
        </CyFormItem>

        <CyFormItem label="所属设计" name="forDesign" initialValue="不限" labelWidth={98}>
          <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
        </CyFormItem> */}
      </div>
      {!isHidden && (
        <div
          style={{ marginLeft: '98px' }}
          onClick={() => {
            setIsHidden(true)
          }}
        >
          <FormCollaspeButton label={98} />
        </div>
      )}
    </>
  )
}

export default ComponentForm
