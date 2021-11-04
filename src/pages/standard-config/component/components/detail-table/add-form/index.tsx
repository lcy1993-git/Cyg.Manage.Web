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
      title: '类型',
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
          <span>所属组件</span>
        </>
      ),
      dataIndex: 'belongComponentId',
      index: 'belongComponentId',
      width: 180,
      render: () => {
        return (
          <UrlSelect
            requestSource="resource"
            url="/Component/GetList"
            valuekey="componentId"
            titlekey="componentName"
            allowClear
            requestType="post"
            postType="query"
            placeholder={type === '0' ? '--所属组件--' : '123'}
            libId={resourceLibId}
          />
        );
      },
      rules: [{ required: true, message: '所属组件不能为空' }],
    },
    {
      title: '组件(或物料选其一)',
      dataIndex: 'componentId',
      index: 'componentId',
      width: 400,
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
  ];

  return (
    <Scrollbars autoHeight>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Scrollbars>
  );
};

export default AddComponentDetail;
