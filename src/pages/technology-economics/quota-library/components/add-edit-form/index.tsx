import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import FormSwitch from '@/components/form-switch';

interface DictionaryFormItem {
  parentName?: string;
}

const DictionaryForm: React.FC<DictionaryFormItem> = (props) => {
  const { parentName } = props;

  return (
    <>
      <CyFormItem label="编号" name="name">
        <span>{parentName}</span>
      </CyFormItem>

      <CyFormItem label="名称" name="key" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="类型" name="value">
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem label="发行日期" name="extensionColumn">
        <Input placeholder="请输入发行日期" />
      </CyFormItem>

      <CyFormItem label="描述" name="sort">
        <Input placeholder="请输入描述" />
      </CyFormItem>

      {/* <CyFormItem label="是否禁用" name="isDisable">
        <FormSwitch />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem> */}
    </>
  );
};

export default DictionaryForm;
