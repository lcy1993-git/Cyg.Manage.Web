import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { FormCollaspeButton, FormExpandButton } from '@/components/form-hidden-button'
import SelectCanSearch from '@/components/select-can-search'
import SelectCanUpdate from '@/components/select-can-update'
import UrlSelect from '@/components/url-select'
import {
  kvBothLevelType,
  materialType,
  supplySideType,
} from '@/services/resource-config/resource-enum'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Input, Radio, Tooltip } from 'antd'
import React, { useState } from 'react'
interface ChartListFromLibParams {
  resourceLibId: string
  onSetDefaultForm?: any
  form: any
  formData?: any
}

const MaterialForm: React.FC<ChartListFromLibParams> = (props) => {
  const { resourceLibId, onSetDefaultForm, form, formData } = props
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [type, setType] = useState<string>(form.getFieldValue('materialType'))
  const [updateName, setUpdateName] = useState<string>('')

  const changeTypeHandle = (value: string) => {
    setType(value)
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
  const isOverHead = type === '导线'
  const isCable = type === '电力电缆'
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
  useUpdateEffect(() => {
    if (formData && formData.materialType) {
      setType(formData.materialType)
    }
  }, [formData])

  return (
    <>
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
        <SelectCanSearch
          url="/Material/GetMaterialByNameList"
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
        label="规格型号"
        name="spec"
        required
        rules={[{ required: true, message: '规格型号不能为空' }]}
      >
        {
          <SelectCanUpdate
            url="/Material/GetListBySpec"
            requestSource="resource"
            requestType="post"
            titlekey="spec"
            valuekey="id"
            postType="body"
            extraParams={{ libId: resourceLibId }}
            placeholder="请输入规格型号"
            onChange={changeSpecHandle}
            update={updateName}
          />
        }
      </CyFormItem>

      <CyFormItem
        label="类别"
        name="materialType"
        required
        rules={[{ required: true, message: '类别不能为空' }]}
      >
        <SelectCanUpdate
          url="/Material/GetMaterialTypeList"
          requestSource="resource"
          requestType="post"
          titlekey="value"
          valuekey="value"
          postType="query"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入类别"
          onChange={changeTypeHandle}
        />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        rules={[{ required: true, message: '单位不能为空' }]}
        required
      >
        <Input placeholder="请输入单位" />
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
      {/* 芯线数 */}
      {(isOverHead || isCable) && (
        <CyFormItem
          label="芯线数"
          name="xinxianshu"
          required
          rules={[{ required: true, message: '芯线数不能为空' }]}
        >
          <Input placeholder="请输入芯线数" />
        </CyFormItem>
      )}

      {isHidden && (
        <div
          style={{ marginLeft: '90px' }}
          onClick={() => {
            setIsHidden(false)
          }}
        >
          <FormExpandButton label={90} />
        </div>
      )}

      {
        <div style={{ display: isHidden ? 'none' : 'block' }}>
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
          {/* 截面积 */}
          {/* 是否用于下户 */}
          {(isOverHead || isCable) && (
            <>
              <CyFormItem label="截面积" name="jiemianji">
                <Input placeholder="请输入截面积" />
              </CyFormItem>
              <CyFormItem label="是否用于下户" name="isTension" initialValue={false}>
                <Radio.Group disabled={isCable}>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </CyFormItem>
            </>
          )}
          {isCable && (
            <>
              <CyFormItem label="内侧终端头" name="neice">
                <UrlSelect
                  allowClear
                  showSearch
                  requestSource="resource"
                  url="/Material/GetListByName"
                  titlekey="spec"
                  valuekey="materialId"
                  placeholder="请选择"
                  requestType="post"
                  extraParams={{ libId: resourceLibId, type: '电缆附件' }}
                />
              </CyFormItem>
              <CyFormItem label="外侧终端头" name="waice">
                <UrlSelect
                  allowClear
                  showSearch
                  requestSource="resource"
                  url="/Material/GetListByName"
                  titlekey="spec"
                  valuekey="materialId"
                  placeholder="请选择"
                  requestType="post"
                  extraParams={{ libId: resourceLibId, type: '电缆附件' }}
                />
              </CyFormItem>
              <CyFormItem label="中间头" name="zhongjiantou">
                <UrlSelect
                  allowClear
                  showSearch
                  requestSource="resource"
                  url="/Material/GetListByName"
                  titlekey="spec"
                  valuekey="materialId"
                  placeholder="请选择"
                  requestType="post"
                  extraParams={{ libId: resourceLibId, type: '电缆附件' }}
                />
              </CyFormItem>
            </>
          )}
          <CyFormItem label="物资编号" name="code">
            <Input placeholder="请输入物资编号" />
          </CyFormItem>
          <CyFormItem label="单重(kg)" name="pieceWeight">
            <Input placeholder="请输入单重" type="number" />
          </CyFormItem>

          <CyFormItem label="供给方" name="supplySide">
            <EnumSelect
              placeholder="请选择供给方"
              enumList={supplySideType}
              valueString
              allowClear
            />
          </CyFormItem>

          <CyFormItem label="运输类型" name="transportationType">
            <Input placeholder="请输入运输类型" />
          </CyFormItem>
          {/* <CyFormItem label="所属工程" name="forProject" initialValue="不限">
            <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
          </CyFormItem>

          <CyFormItem label="所属设计" name="forDesign" initialValue="不限">
            <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
          </CyFormItem> */}
        </div>
      }
      {!isHidden && (
        <div
          style={{ marginLeft: '90px' }}
          onClick={() => {
            setIsHidden(true)
          }}
        >
          <FormCollaspeButton label={90} />
        </div>
      )}
    </>
  )
}

export default MaterialForm
