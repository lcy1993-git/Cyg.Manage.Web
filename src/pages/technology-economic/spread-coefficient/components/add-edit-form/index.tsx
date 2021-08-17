import React, { useEffect, useState } from 'react';
import { Input, Col, Row, Select } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
interface IForm {
  type?: 'add' | 'edit';
  selectList?: number[];
}
const DictionaryForm: React.FC<IForm> = (props) => {
  return (
    <>
      <CyFormItem label="模板名称" name="name" required>
        <Input placeholder="请输入模板名称" />
      </CyFormItem>
      <CyFormItem label="发布时间" name="publishDate">
        <DateFormItem />
      </CyFormItem>
      <CyFormItem label="发布单位" name="publishedBy" required>
        <Input placeholder="请输入编号发布单位" />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
      <CyFormItem label="状态" name="enabled" required>
        <FormSwitch />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
