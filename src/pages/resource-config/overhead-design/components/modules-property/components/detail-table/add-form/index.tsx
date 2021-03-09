import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form } from 'antd';
import UrlSelect from '@/components/url-select';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}
const AddModuleDetailTable: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;

  const columns = [
    {
      title: '所属部件',
      dataIndex: 'part',
      index: 'part',
      rules: [{ required: true, message: '该值必填' }],
      width: 180,
      render: () => {
        return (
          <UrlSelect
            requestSource="resource"
            url="/ModulesDetails/GetParts"
            valueKey="value"
            titleKey="key"
            allowClear
            placeholder="--所属部件--"
          />
        );
      },
    },
    {
      title: '组件',
      dataIndex: 'componentId',
      index: 'componentId',
      width: 180,
      render: () => {
        return (
          <UrlSelect
            requestSource="resource"
            url="/Component/GetList"
            valueKey="componentId"
            titleKey="componentName"
            allowClear
            requestType="post"
            postType="query"
            placeholder="--组件--"
            libId={resourceLibId}
          />
        );
      },
    },
    {
      title: '物料',
      dataIndex: 'materialId',
      index: 'materialId',
      width: 240,
      render: () => {
        return (
          <UrlSelect
            requestSource="resource"
            url="/Material/GetList"
            valueKey="materialId"
            titleKey="materialName"
            allowClear
            requestType="post"
            postType="query"
            placeholder="--物料--"
            libId={resourceLibId}
          />
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      width: 160,
      render: () => {
        return <InputNumber defaultValue={0} min={0} />;
      },
    },
  ];

  return (
    <Form form={addForm}>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Form>
  );
};

export default AddModuleDetailTable;
