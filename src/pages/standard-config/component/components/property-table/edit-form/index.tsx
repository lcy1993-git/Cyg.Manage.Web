import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const EditComponentProperty: React.FC = () => {
  return (
    <>
      <CyFormItem
        label="属性名称"
        name="propertyName"
        required
        rules={[{ required: true, message: '属性名称不能为空' }]}
      >
        <Input placeholder="--请输入属性名称--" />
      </CyFormItem>

      <CyFormItem label="属性值" name="propertyValue">
        <Input placeholder="--请输入属性名称--" />
      </CyFormItem>
    </>
  );
};

export default EditComponentProperty;
