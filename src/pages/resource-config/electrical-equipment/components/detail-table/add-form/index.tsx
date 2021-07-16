import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { Input } from 'antd';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';

interface AddDetailParams {
  resourceLibId: string;
  addForm: any;
}
const AddComponentDetail: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props;

  const columns = [
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
            placeholder="--所属组件--"
            libId={resourceLibId}
          />
        );
      },
      rules: [{ required: true, message: '所属组件不能为空' }],
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

export default AddComponentDetail;
