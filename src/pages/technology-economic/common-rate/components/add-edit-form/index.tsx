import React from 'react';
import { Input, Col, Row, Select } from 'antd';
import UrlSelect from '@/components/url-select';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import { getEnums} from '../../../utils';
getEnums('RateTableType')
console.log(1111111111111111);

const DictionaryForm: React.FC<any> = () => {
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="序号" name="number" required>
            <Input placeholder="请输入名称" />
          </CyFormItem>
          <CyFormItem label="所属文件" name="sourceFile" required>
          <Input placeholder="请输入所属文件" />
          </CyFormItem>
          <CyFormItem label="是否拆除" name="isDemolitionMajor" required>
            <FormSwitch />
        </CyFormItem>
          {/* <CyFormItem label="是否拆除" name="isDemolitionMajor">
            <Select>
              <Select.Option key={1} value={1}>是</Select.Option>
              <Select.Option key={0} value={0}>否</Select.Option>
            </Select>
          </CyFormItem> */}

          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem label="费率年度" name="year">
            <DateFormItem picker="year" />
          </CyFormItem>
          {/* <CyFormItem label="费率类型" name="rateTableType" required>
            <UrlSelect
              defaultData={getEnums('RateTableType')}
            />
          </CyFormItem> */}
          <CyFormItem label="行业类别" name="industryType">
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
          </CyFormItem>
          <CyFormItem label="适用专业" name="majorType">
            <UrlSelect
              url="/CommonEnum/GetMajorTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
          </CyFormItem>
          <CyFormItem label="发布时间" name="publishDate">
            <DateFormItem />
          </CyFormItem>

        </Col>
      </Row>
      <CyFormItem label="状态" name="enabled" required>
            <FormSwitch />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
