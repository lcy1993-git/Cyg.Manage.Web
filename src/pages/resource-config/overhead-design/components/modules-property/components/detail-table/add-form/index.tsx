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
            valuekey="value"
            titlekey="key"
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

export default AddModuleDetailTable;
