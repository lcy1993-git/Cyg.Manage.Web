import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import SelectCanUpdate from '@/components/select-can-update'
import {
  loopNumber,
  poleKvLevel,
  poleMaterial,
  poleType,
} from '@/services/resource-config/resource-enum'
import { Input, Radio } from 'antd'
import React from 'react'
interface PoleTypeParams {
  type?: 'edit' | 'add'
  resourceLibId: string
}

const PoleTypeForm: React.FC<PoleTypeParams> = (props) => {
  const { resourceLibId } = props
  return (
    <>
      <CyFormItem
        label="分类简号"
        name="poleTypeCode"
        required
        rules={[{ required: true, message: '分类简号不能为空' }]}
      >
        <Input placeholder="请输入分类简号" />
      </CyFormItem>

      <CyFormItem
        label="分类名称"
        name="poleTypeName"
        required
        rules={[{ required: true, message: '分类名称不能为空' }]}
      >
        <Input placeholder="请输入分类名称" />
      </CyFormItem>

      <CyFormItem
        label="类型"
        name="category"
        required
        initialValue="架空"
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <EnumSelect placeholder="请选择类型" enumList={poleType} valueString />
      </CyFormItem>

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        initialValue="10kV"
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <EnumSelect placeholder="请选择电压等级" enumList={poleKvLevel} valueString />
      </CyFormItem>

      <CyFormItem
        label="分类类型"
        name="type"
        required
        rules={[{ required: true, message: '分类类型不能为空' }]}
      >
        <SelectCanUpdate
          url="/PoleType/GetTypeList"
          requestSource="resource"
          requestType="get"
          titlekey="value"
          valuekey="value"
          postType="query"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入分类类型"
        />
      </CyFormItem>

      <CyFormItem
        label="转角"
        name="corner"
        required
        rules={[{ required: true, message: '转角不能为空' }]}
      >
        <SelectCanUpdate
          url="/PoleType/GetCornerList"
          requestSource="resource"
          requestType="get"
          titlekey="value"
          valuekey="value"
          postType="query"
          extraParams={{ libId: resourceLibId }}
          placeholder="请输入转角类型"
        />
      </CyFormItem>

      <CyFormItem
        label="分类材质"
        name="material"
        required
        initialValue="水泥单杆"
        rules={[{ required: true, message: '分类材质不能为空' }]}
      >
        <EnumSelect placeholder="请选择分类材质" enumList={poleMaterial} valueString />
      </CyFormItem>

      <CyFormItem
        label="回路数"
        name="loopNumber"
        required
        initialValue="单回路"
        rules={[{ required: true, message: '回路数不能为空' }]}
      >
        <EnumSelect placeholder="请选择回路数" enumList={loopNumber} valueString />
      </CyFormItem>

      <CyFormItem label="是否耐张" name="isTension" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </CyFormItem>
      <CyFormItem label="是否防风" name="isWind" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </CyFormItem>
      <CyFormItem label="是否分支" name="isBranch" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </CyFormItem>
    </>
  )
}

export default PoleTypeForm
