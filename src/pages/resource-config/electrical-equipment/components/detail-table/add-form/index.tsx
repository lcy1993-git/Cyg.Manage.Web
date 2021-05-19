import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}
const AddComponentDetail: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;

  const columns = [
    {
      title: '所属组件',
      dataIndex: 'belongComponentId',
      index: 'belongComponentId',
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
            placeholder="--所属组件--"
            libId={resourceLibId}
          />
        );
      },
    },
    {
      title: '组件',
      dataIndex: 'componentId',
      index: 'componentId',
      width: 400,
      render: () => (
        <CascaderUrlSelect requestSource="component" urlHead="Component" libId={resourceLibId} />
      ),
    },
    {
      title: '物料',
      dataIndex: 'materialId',
      index: 'materialId',
      width: 400,
      render: () => (
        <CascaderUrlSelect requestSource="material" urlHead="Material" libId={resourceLibId} />
      ),
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

export default AddComponentDetail;
