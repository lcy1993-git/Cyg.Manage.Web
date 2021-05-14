import React from 'react';
import { Input, DatePicker, Select } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import DatePickerForm from '../../../components/date-picker-form';

interface Props {
  type: 'add' | 'edit';
}

const DictionaryForm: React.FC<Props> = ({type}) => {

  return (
    <>
      {
        type === 'edit' &&
        <CyFormItem label="编号" name="id">
          <Input disabled/>
        </CyFormItem>
      }
      <CyFormItem label="名称" name="name" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="类型" name="category">
        <Select placeholder="请输入类型" value={2}>
          <Select.Option key={1} value={1}>111</Select.Option>
          <Select.Option key={2} value={2}>222</Select.Option>
        </Select>
      </CyFormItem>

      {/* <CyFormItem label="发行日期" name="releaseDate">
        <DatePickerForm placeholder="请输入发行日期"/>
      </CyFormItem> */}

      <CyFormItem label="描述" name="remark">
        <Input.TextArea placeholder="请输入描述" rows={3}/>
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
