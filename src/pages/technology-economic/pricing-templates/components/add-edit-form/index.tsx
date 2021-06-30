import React, { useEffect } from 'react';
import { Input, Col, Row, Select } from 'antd';
import DisableSelect from '../disable-select';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import { getEnums } from '@/pages/technology-economic/utils';
const { Option } = Select;
const engineeringTemplateTypeList = getEnums('EngineeringTemplateType');
interface IForm {
  type?: 'add' | 'edit';
  selectList?: number[];
}
const DictionaryForm: React.FC<IForm> = (props) => {
  const { type, selectList } = props;
  console.log(selectList);

  useEffect(() => {}, []);
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="编号" name="no" required>
            <Input placeholder="请输入编号" />
          </CyFormItem>
          <CyFormItem label="版本" name="version">
            <Input />
          </CyFormItem>
          <CyFormItem label="模板类型" name="engineeringTemplateType">
            {type === 'edit' ? (
              <Select disabled>
                {engineeringTemplateTypeList.map((item: any, index: number) => {
                  return (
                    <Option value={item.value} key={index}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <DisableSelect
                requestType="get"
                requestSource="tecEco"
                defaultData={getEnums('EngineeringTemplateType')}
                titleKey="text"
                valueKey="value"
                selectList={selectList!}
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
