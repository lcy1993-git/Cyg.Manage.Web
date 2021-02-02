import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

const ElectricCompanyForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="区域" name="province" required>
        <UrlSelect
          showSearch
          url="/Area/GetList?pId=-1"
          titleKey="text"
          valueKey="value"
          placeholder="请选择"
        />
      </CyFormItem>

      <CyFormItem label="所属公司" name="companyName" required>
        <Input placeholder="请输入所属公司" />
      </CyFormItem>

      <CyFormItem label="所属县公司" name="countyCompany" required>
        <Input placeholder="请输入所属县公司" />
      </CyFormItem>

      <CyFormItem label="供电所/班组" name="powerSupply" required>
        <Input placeholder="请输入供电所/班组" />
      </CyFormItem>
    </>
  );
};

export default ElectricCompanyForm;
