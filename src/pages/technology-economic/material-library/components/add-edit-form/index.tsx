import React from 'react';
import { Input, Select, Col, Row } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';

const { Option } = Select;

interface Props {
  type: 'add' | 'edit';
}

const DictionaryForm: React.FC<Props> = ({type}) => {

  return (
    <>
    <Row>
    <Col span={11}>
      <CyFormItem label="名称" name="name" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="使用材机库" name="rencaijiku" required>
        <Select>
          <Option value={111}>111</Option>
        </Select>
      </CyFormItem>

      <CyFormItem label="定额类别" name="hangyeleibie" required>
        <Select>
          <Option value={111}>111</Option>
        </Select>
      </CyFormItem>

      <CyFormItem label="发布时间" name="fabushijian">
        <DateFormItem />
      </CyFormItem>

      <CyFormItem label="发布机构" name="fabujigou">
        <Input/>
      </CyFormItem>
    </Col>
    <Col span={2}>
    </Col>
    <Col span={11}>

      <CyFormItem label="价格年度" name="jiageniandu">
        <DateFormItem picker="year"/>
      </CyFormItem>

      <CyFormItem label="行业类别" name="hangyeleibie">
        <Select>
          <Option value={111}>111</Option>
        </Select>
      </CyFormItem>

      <CyFormItem label="适用专业" name="shiyongzhuanye">
        <Input/>
      </CyFormItem>

      <CyFormItem label="备注" name="id8">
        <Input/>
      </CyFormItem>

      <CyFormItem label="状态" name="id9" required>
        <Input/>
      </CyFormItem>
    </Col>
    </Row>
      <CyFormItem label="上传文件" name="file" required>
        <FileUpload
          accept=".xls,.xlsx"
          trigger={true}
          maxCount={1}
          uploadFileBtn
          // uploadFileFn={()=>Promise.resolve(1)}
        />
      </CyFormItem>

    </>
  );
};

export default DictionaryForm;