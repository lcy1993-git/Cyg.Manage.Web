import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { InputNumber, Form } from 'antd';
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
      title: '所属组件',
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
    <Scrollbars autoHeight>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Scrollbars>
  );
};

export default AddComponentDetail;
