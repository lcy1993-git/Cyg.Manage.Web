import React from 'react';
import { Input, Select, Col, Row } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';

const { Option } = Select;

interface Props {
  type: 'add' | 'edit';
}

const DictionaryForm: React.FC<Props> = () => {

  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="名称" name="name" required>
            <Input placeholder="请输入名称" />
          </CyFormItem>

          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>

          <CyFormItem label="适用行业" name="industryType">
            <Select>
              <Option value={1}>111</Option>
              <Option value={2}>222</Option>
            </Select>
          </CyFormItem>
        </Col>
        <Col span={2}>
        </Col>
        <Col span={11}>

          <CyFormItem label="发布时间" name="publishDate">
            <DateFormItem />
          </CyFormItem>

          <CyFormItem label="价格年度" name="year">
            <DateFormItem picker="year" />
          </CyFormItem>

          <CyFormItem label="状态" name="enabled" required>
            <FormSwitch />
          </CyFormItem>

        </Col>
      </Row>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>

      <CyFormItem label="上传文件" name="file" required>
        <FileUpload
          accept=".xls,.xlsx"
          maxCount={1}
          trigger={false}
        />
      </CyFormItem>

    </>
  );
};

export default DictionaryForm;