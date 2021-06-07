import React, { useState } from 'react';
import { Input, Select, Col, Row, Switch } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';
import { useRequest, useMount } from 'ahooks';
import { queryMaterialMachineLibraryPager, getIndustryTypeEnums, getMajorTypeEnums, getQuotaScopeEnums } from '@/services/technology-economic';
import UrlSelect from '@/components/url-select';
import moment from 'moment';

const { Option } = Select;

interface Props {
  type: 'add' | 'edit';
}

interface ResponsData {
  items: {
    id: string;
    name: string
  }[]
}

const DictionaryForm: React.FC<Props> = ({ type }) => {

  const { data: MaterialMachineLibraryData, run } = useRequest<ResponsData>(queryMaterialMachineLibraryPager, { manual: true });
  const { data } = useRequest<ResponsData>(getIndustryTypeEnums, { manual: false });
  const { data1 } = useRequest<ResponsData>(getMajorTypeEnums, { manual: false });
  const { data2 } = useRequest<ResponsData>(getQuotaScopeEnums, { manual: false });

  console.log(data);
  
  const MaterialMachineLibraryList = MaterialMachineLibraryData?.items ?? [];

  useMount(() => {
    run({ pageIndex: 1, pageSize: 3000 })
  })

  const MaterialMachineLibraryListFn = () => {
    console.log(MaterialMachineLibraryList);

    return MaterialMachineLibraryList.map((item) => {
      return (
        <Option key={item.id} value={item.id}>{item.name}</Option>
      );
    })
  }

  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="名称" name="name" required>
            <Input placeholder="请输入名称" />
          </CyFormItem>

          <CyFormItem label="定额类别" name="quotaScope" required>
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
            >

            </UrlSelect>
          </CyFormItem>

          <CyFormItem label="定额类别" name="quotaScope" required>
            <Select>
              <Option value={1}>111</Option>
              <Option value={2}>111</Option>
            </Select>
          </CyFormItem>

          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>

          <CyFormItem label="行业类别" name="industryType">
            <Select>
              <Option value={1}>111</Option>
              <Option value={2}>222</Option>
              <Option value={3}>333</Option>
            </Select>
          </CyFormItem>

          <CyFormItem label="状态" name="Enabled" required>
            <FormSwitch />
          </CyFormItem>

        </Col>
        <Col span={2}>
        </Col>
        <Col span={11}>

          <CyFormItem label="使用材机库" name="materialMachineLibraryId" required>
            <Select>
              {MaterialMachineLibraryListFn()}
            </Select>
          </CyFormItem>

          <CyFormItem label="发布时间" name="publishDate">
            <DateFormItem />
          </CyFormItem>

          <CyFormItem label="价格年度" name="year">
            <DateFormItem picker="year" />
          </CyFormItem>

          <CyFormItem label="适用专业" name="majorType">
            <Select>
              <Option value={1}>111</Option>
              <Option value={2}>222</Option>
            </Select>
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