import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';

export enum LoginEnum {
  '授权账号' = 1,
  '授权IP ',
}

const AddLoginStrategyForm: React.FC = () => {
  return (
    <>
      <CyFormItem
        labelWidth={115}
        // align="right"
        label="授权账号/授权IP"
        name="key"
        required
        rules={[{ required: true, message: '请输入授权账号或IP' }]}
      >
        <Input placeholder="请输入授权账号/IP" />
      </CyFormItem>

      <CyFormItem
        labelWidth={115}
        // align="right"
        label="类型"
        name="authorizeType"
        required
        rules={[{ required: true, message: '请选择授权类型' }]}
      >
        <EnumSelect placeholder="请选择" enumList={LoginEnum} />
      </CyFormItem>
      <CyFormItem labelWidth={115} label="备注" name="remark">
        <Input.TextArea placeholder="请输入备注" showCount />
      </CyFormItem>
    </>
  );
};

export default AddLoginStrategyForm;
