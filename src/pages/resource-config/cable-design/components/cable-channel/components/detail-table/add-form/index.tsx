import React, { useState } from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form, Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}
const AddCableChannelDetailTable: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;

  const columns = [
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>电缆通道编码</span>
        </>
      ),
      dataIndex: 'cableChannelId',
      index: 'cableChannelId',
      rules: [{ required: true, message: '电缆通道编码不能为空' }],

      width: 180,
      render: () => {
        return <Input placeholder="请输入电缆井编码" />;
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
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>数量</span>
        </>
      ),
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      width: 160,
      render: () => {
        return <Input type="number" min={1} placeholder="请输入数量（正整数）" />;
      },
      rules: [
        { required: true, message: '数量不能为空' },
        { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
      ],
    },
  ];

  return (
    <Scrollbars autoHeight>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Scrollbars>
  );
};

export default AddCableChannelDetailTable;
