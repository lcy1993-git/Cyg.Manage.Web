import React from 'react';
import { Table } from 'antd';
const columns = [
  {
    title: '人工系数调差(%)',
    children: [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
    ],
  },
];
const TableComponent = () => {
  return <Table />;
};
export default TableComponent;
