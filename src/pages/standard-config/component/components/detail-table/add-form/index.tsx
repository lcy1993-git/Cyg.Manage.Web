import React, { useState } from 'react';
import EditFormTable from '@/components/edit-form-table';
import { Form, Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';
import EnumSelect from '@/components/enum-select';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}

enum componentType {
  '物料',
  '组件',
}

const AddComponentDetail: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;
  const [type, setType] = useState<string>();

  console.log(type, '323');

  const columns = [
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>类型</span>
        </>
      ),
      dataIndex: 'type',
      index: 'type',
      width: 240,

      render: () => (
        <EnumSelect
          placeholder="请选择类型"
          enumList={componentType}
          onChange={(value: any) => setType(value)}
        />
      ),
    },

    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件名称</span>
        </>
      ),
      dataIndex: 'componentId',
      index: 'componentId',
      width: 240,
      render: () => {
        return (
          <CascaderUrlSelect
            urlHead={type === '0' ? 'Material' : 'Component'}
            libId={resourceLibId}
          />
        );
      },
    },
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件规格</span>
        </>
      ),
      dataIndex: 'componentId',
      index: 'componentId',
      width: 240,
      render: () => {
        return (
          <CascaderUrlSelect
            urlHead={type === '0' ? 'Material' : 'Component'}
            libId={resourceLibId}
          />
        );
      },
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
    {
      title: '单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 140,
    },
  ];

  return (
    <Scrollbars autoHeight>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Scrollbars>
  );
};

export default AddComponentDetail;
