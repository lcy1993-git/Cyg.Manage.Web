import React from 'react';
import { Input, Select, Col, Row } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';
import { useRequest, useMount } from 'ahooks';
import { queryMaterialMachineLibraryPager } from '@/services/technology-economic';
import UrlSelect from '@/components/url-select';

const { Option } = Select;
interface ResponsData {
  items: {
    id: string;
    name: string
  }[]
}

const DictionaryForm: React.FC<null> = () => {

  const { data: MaterialMachineLibraryData, run } = useRequest<ResponsData>(queryMaterialMachineLibraryPager, { manual: true });
  
  const MaterialMachineLibraryList = MaterialMachineLibraryData?.items ?? [];

  useMount(() => {
    run({ pageIndex: 1, pageSize: 3000 })
  })

  const MaterialMachineLibraryListFn = () => {
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
              url="/CommonEnum/GetQuotaScopeEnums"
              requestType="get"
              requestSource="tecEco"
              titlekey="text"
              valuekey="value"
            />
          </CyFormItem>

          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>

          <CyFormItem label="行业类别" name="industryType">
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
              titlekey="text"
              valuekey="value"
            />
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
            <UrlSelect
                url="/CommonEnum/GetMajorTypeEnums"
                requestType="get"
                requestSource="tecEco"
                titlekey="text"
                valuekey="value"
              />
          </CyFormItem>

        </Col>
      </Row>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} defaultValue=""/>
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