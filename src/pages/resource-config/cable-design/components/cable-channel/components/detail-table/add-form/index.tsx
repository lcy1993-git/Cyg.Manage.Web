import React, { useState } from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form, Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}
const AddCableChannelDetailTable: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;

  const columns = [
    {
      title: '电缆井编码',
      dataIndex: 'cableChannelId',
      index: 'cableChannelId',
      rules: [{ required: true, message: '该值必填' }],

      width: 180,
      render: () => {
        return <Input />;
      },
    },
    {
      title: '组件',
      dataIndex: 'componentId',
      index: 'componentId',
      width: 400,
      render: () => <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />,
    },
    {
      title: '物料',
      dataIndex: 'materialId',
      index: 'materialId',
      width: 400,
      render: () => <CascaderUrlSelect urlHead="Material" libId={resourceLibId} />,
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

export default AddCableChannelDetailTable;
