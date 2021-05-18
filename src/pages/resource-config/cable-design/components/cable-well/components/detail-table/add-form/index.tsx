import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form, Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
interface AddDetailParams {
  resourceLibId: string;
}
const AddCableWellDetailTable: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId } = props;

  const columns = [
    {
      title: '电缆井编码',
      dataIndex: 'cableWellId',
      index: 'cableWellId',
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
      render: () => {
        return (
          <CascaderUrlSelect requestSource="component" urlHead="Component" libId={resourceLibId} />
        );
      },
    },
    {
      title: '物料',
      dataIndex: 'materialId',
      index: 'materialId',
      width: 400,
      render: () => {
        return (
          <CascaderUrlSelect requestSource="material" urlHead="Material" libId={resourceLibId} />
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

  return <EditFormTable formName="items" columns={columns} />;
};

export default AddCableWellDetailTable;
