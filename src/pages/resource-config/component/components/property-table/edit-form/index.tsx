import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const EditComponentProperty: React.FC = () => {
  return (
    <>
      <CyFormItem label="组件" name="componentId">
        <Input placeholder="--请输入属性名称--" />;
      </CyFormItem>

      <CyFormItem label="物料" name="materialId">
        <Input placeholder="--请输入属性名称--" />;
      </CyFormItem>
    </>
  );
};

export default EditComponentProperty;
