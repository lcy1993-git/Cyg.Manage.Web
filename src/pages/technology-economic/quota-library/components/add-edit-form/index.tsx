import React, { useState } from 'react';
import { Input, Select, Col, Row } from 'antd';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import FileUpload from '@/components/file-upload';
import { useRequest, useMount } from 'ahooks';
import {
  getQuotaScopeEnums,
  queryMaterialMachineLibraryPager,
  queryQuotaLibraryPager,
} from '@/services/technology-economic';
import UrlSelect from '@/components/url-select';
import {
  getMaterialLibraryAllList,
  getMaterialLibraryList,
} from '@/services/technology-economic/supplies-library';

const { Option } = Select;
interface ResponsData {
  items: {
    enabled: boolean;
    id: string;
    name: string;
  }[];
}

const DictionaryForm: React.FC<null> = () => {
  const { data: MaterialMachineLibraryData, run } = useRequest<ResponsData>(
    queryMaterialMachineLibraryPager,
    { manual: true },
  );

  const MaterialMachineLibraryList = MaterialMachineLibraryData?.items ?? [];
  const [materialList, setMaterialList] = useState<{ name: string; id: string }[]>([]);
  const [library, setLibrary] = useState<{ quotaScope: number; id: string }[]>([]);
  const [enums, setEnums] = useState<{ text: string; value: number }[]>([]);
  useMount(() => {
    getMaterialData();
    run({ pageIndex: 1, pageSize: 3000 });
  });
  const getMaterialData = async () => {
    const res = await getMaterialLibraryList({
      pageIndex: 1,
      pageSize: 10000,
    });
    setMaterialList(res.items);
    const data = await queryQuotaLibraryPager({ pageIndex: 1, pageSize: 3000 });
    console.log(data)
    setLibrary(data.items as []);
    const enumArr = await getQuotaScopeEnums();
    console.log(enumArr)
    setEnums(enumArr);
  };
  const MaterialMachineLibraryListFn = () => {
    return MaterialMachineLibraryList.map((item) => {
      return (
        <Option key={item.id} value={item.id} >
          {item.name}
        </Option>
      );
    });
  };

  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem
            label="名称"
            name="name"
            required
            rules={[{ required: true, message: '名称为必填' }]}
          >
            <Input placeholder="请输入名称" />
          </CyFormItem>

          <CyFormItem
            label="定额类别"
            name="quotaScope"
            required
            rules={[{ required: true, message: '定额类别为必填' }]}
          >
            <Select>
              {enums.map((item) => {
                return (
                  <Option key={item.value} value={item.value} disabled={library.filter(val=>val.quotaScope === item.value).length !== 0}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
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

          {/*<CyFormItem*/}
          {/*  label="状态"*/}
          {/*  name="Enabled"*/}
          {/*  required*/}
          {/*  rules={[{ required: true, message: '状态为必填' }]}*/}
          {/*>*/}
          {/*  <FormSwitch />*/}
          {/*</CyFormItem>*/}
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem
            label="使用材机库"
            name="materialMachineLibraryId"
            required
            rules={[{ required: true, message: '使用材机库为必填' }]}
          >
            <Select>{MaterialMachineLibraryListFn()}</Select>
          </CyFormItem>

          <CyFormItem
            label="发布时间"
            name="publishDate"
            required
            rules={[{ required: true, message: '发布时间为必填' }]}
          >
            <DateFormItem allowClear={false} />
          </CyFormItem>

          <CyFormItem
            label="价格年度"
            name="year"
            required
            rules={[{ required: true, message: '价格年度为必填' }]}
          >
            <DateFormItem picker="year" allowClear={false} />
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
          <CyFormItem
            label="关联物料库"
            name="SourceMaterialLibraryId"
            required
            rules={[{ required: true, message: '关联物料库为必填' }]}
          >
            <Select>
              {materialList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </CyFormItem>
        </Col>
      </Row>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} defaultValue="" />
      </CyFormItem>
      <CyFormItem
        label="上传文件"
        name="file"
        required
        rules={[{ required: true, message: '请上传文件' }]}
      >
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
