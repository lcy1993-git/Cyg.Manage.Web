import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import SelectCanEdit from '@/components/select-can-edit'
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
  return (
    <>
      <CyFormItem
        label="杆型简号"
        name="poleTypeCode"
        required
        rules={[{ required: true, message: '杆型简号不能为空' }]}
      >
        <Input placeholder="请输入杆型简号" />
      </CyFormItem>

      <CyFormItem
        label="杆型名称"
        name="poleTypeName"
        required
        rules={[{ required: true, message: '杆型名称不能为空' }]}
      >
        <Input placeholder="请输入杆型名称" />
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
        label="杆型类型"
        name="type"
        required
        rules={[{ required: true, message: '杆型类型不能为空' }]}
      >
        <SelectCanEdit placeholder="请输入杆型类型" />
      </CyFormItem>

      <CyFormItem
        label="转角"
        name="corner"
        required
        rules={[{ required: true, message: '转角不能为空' }]}
      >
        <SelectCanEdit placeholder="请输入转角类型" />
      </CyFormItem>

      <CyFormItem
        label="杆型材质"
        name="material"
        required
        initialValue="水泥单杆"
        rules={[{ required: true, message: '杆型材质不能为空' }]}
      >
        <EnumSelect placeholder="请选择杆型材质" enumList={poleMaterial} valueString />
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
      <CyFormItem label="是否防风" name="isfangfeng" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </CyFormItem>
      <CyFormItem label="是否分支" name="isfenzhi" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </CyFormItem>
    </>
  )
}

export default PoleTypeForm
