import React, { useEffect, useState } from 'react';
import { Input, Col, Row, Select, Button, message } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';
interface IForm {
  type?: 'add' | 'edit';
  selectList?: number[];
}
const AdjustmentFileForm: React.FC<IForm> = (props) => {
  return (
    <>
      <CyFormItem label="文件名称" name="name" required>
        <Input placeholder="请输入文件名称" />
      </CyFormItem>
      <CyFormItem label="发布时间" name="publishDate">
        <DateFormItem />
      </CyFormItem>
      <CyFormItem label="发布单位" name="no" required>
        <Input placeholder="请输入编号发布单位" />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
      <CyFormItem label="上传文件" name="files" required>
        <FileUpload accept=".pdf" maxCount={1} trigger={false} />
      </CyFormItem>
      <CyFormItem label="状态" name="enabled">
        <FormSwitch />
      </CyFormItem>
    </>
  );
};

export default AdjustmentFileForm;
