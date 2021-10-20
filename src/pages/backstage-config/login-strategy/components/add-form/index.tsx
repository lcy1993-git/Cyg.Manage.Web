import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';

enum LoginEnum {
  '名称' = 1,
  'IP',
}

const AddLoginStrategyForm: React.FC = () => {
  return (
    <>
      <CyFormItem labelWidth={92} align="right" label="名称" name="companyName" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem labelWidth={92} align="right" label="类型" name="type" required>
        <EnumSelect placeholder="请选择" enumList={LoginEnum} />
      </CyFormItem>
      <CyFormItem labelWidth={92} align="right" label="备注" name="countyCompany">
        <Input.TextArea placeholder="请输入备注" showCount />
      </CyFormItem>
    </>
  );
};

export default AddLoginStrategyForm;
