import React from 'react';
import EditFormTable from '@/components/edit-form-table';
import { Form, Input } from 'antd';

interface AddPropertyParams {
  addForm: any;
}
const AddComponentProperty: React.FC<AddPropertyParams> = (props) => {
  const { addForm } = props;

  const columns = [
    {
      title: '属性名称',
      dataIndex: 'propertyName',
      index: 'propertyName',
      width: 320,
      render: () => {
        return <Input placeholder="--请输入属性名称--" />;
      },
    },
    {
      title: '属性值',
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      width: 320,
      render: () => {
        return <Input placeholder="--请输入属性值--" />;
      },
    },
  ];

  return (
    <Form form={addForm}>
      <EditFormTable formName="items" columns={columns}></EditFormTable>
    </Form>
  );
};

export default AddComponentProperty;
