import React from 'react';
import { Input, Col, Row } from 'antd';
import UrlSelect from '@/components/url-select';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import { getEnums} from '../../../utils';

const DictionaryForm: React.FC<never> = () => {
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="序号" name="number" required>
            <Input placeholder="请输入名称" />
          </CyFormItem>
          <CyFormItem label="费率类型" name="rateTableType" required>
            <UrlSelect
              defaultData={getEnums('RateTableType')}
            />
          </CyFormItem>
          <CyFormItem label="适用专业" name="majorType">
            <UrlSelect
              url="/CommonEnum/GetMajorTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
          </CyFormItem>
          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem label="费率年度" name="year">
            <DateFormItem picker="year" />
          </CyFormItem>
          <CyFormItem label="行业类别" name="industryType">
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
          </CyFormItem>
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
