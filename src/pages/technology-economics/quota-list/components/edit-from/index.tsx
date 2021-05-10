import React from 'react';
import { Input, Select } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const EditForm: React.FC = () => {
  return (
    <>
      <CyFormItem labelWidth={116} align="right" label="目录名称" name="deviceType" required>
        <Input placeholder="请输入表类型" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="所属目录" name="dsName">
        <Select placeholder="请输入控件字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="册/章节说明" name="responseName">
        <Input placeholder="请输入服务端字段" />
      </CyFormItem>

      <CyFormItem labelWidth={116} align="right" label="排序" name="postGISName">
        <Input placeholder="请输入PostGis字段" />
      </CyFormItem>
    </>
  );
};

export default EditForm;