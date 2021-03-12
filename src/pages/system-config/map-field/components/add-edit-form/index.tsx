import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const MapFieldForm: React.FC = () => {
  return (
    <>
      <CyFormItem labelWidth={116} align="right" label="表类型" name="deviceType" required>
        <Input placeholder="请输入表类型" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="控件字段" name="dsName">
        <Input placeholder="请输入控件字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="服务端字段" name="responseName">
        <Input placeholder="请输入服务端字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="PostGis字段" name="postGISName">
        <Input placeholder="请输入PostGis字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="PostGis实体字段" name="pgModelName">
        <Input placeholder="请输入PostGis实体字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="字段描述" name="description">
        <Input placeholder="字段描述" />
      </CyFormItem>
    </>
  );
};

export default MapFieldForm;
