import React, { useEffect } from 'react';
import { Input, Col, Row, Select } from 'antd';
import UrlSelect from '../url-select';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
interface IForm {
  type?: 'add' | 'edit';
  selectList?: any[];
}

const DictionaryForm: React.FC<IForm> = (props) => {
  const { type, selectList = [{ value: 1 }] } = props;
  useEffect(() => {}, []);
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="编号" name="name" required>
            <Input placeholder="请输入编号" />
          </CyFormItem>
          <CyFormItem label="版本" name="version">
            <Input />
          </CyFormItem>
          <CyFormItem label="模板类型" name="templateType">
            {type === 'edit' ? (
              <Select disabled />
            ) : (
              <UrlSelect
                url="/CommonEnum/GetMajorTypeEnums"
                requestType="get"
                requestSource="tecEco"
                titleKey="text"
                valueKey="value"
                selectList={selectList}
              />
            )}
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem label="发布时间" name="publishDate">
            <DateFormItem />
          </CyFormItem>
          <CyFormItem label="状态" name="enabled" required>
            <FormSwitch />
          </CyFormItem>
        </Col>
      </Row>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
