import { MaterialDataType } from '@/services/visualization-results/list-menu';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC } from 'react';

export interface MaterialTableProps {
  data?: MaterialDataType[];
  loading: boolean;
}
export const columns: ColumnsType<MaterialDataType> = [
  {
    title: '编号',
    width: 100,
    dataIndex: 'index',
    key: 'index',
    fixed: 'left',
    render: (text, record, idx) => (record.children ? idx + 1 : null),
  },
  {
    title: '物料类型',
    width: 200,
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
  },
  {
    title: '物料名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '物料型号',
    width: 500,
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'materialId',
    key: 'materialId',
  },

  {
    title: '物料单位',
    width: 80,
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '数量',
    width: 80,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
    render(v: number){
      return String(v)
    }
  },

  {
    title: '单价(元)',
    width: 80,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render(v: number){
      return String(v)
    }
  },
  {
    title: '单重(kg)',
    width: 80,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
    render(v: number){
      return String(v)
    }
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '物料 描述',
    width: 200,
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '供给方',
    width: 200,
    dataIndex: 'supplySide',
    key: 'supplySide',
  },
  {
    title: '备注',
    width: 200,
    dataIndex: 'remark',
    key: 'remark',
  },
];
export const MaterialTable: FC<MaterialTableProps> = (props) => {
  const { data, loading } = props;
  return (
    <Table
      columns={columns}
      bordered
      size="middle"
      loading={loading}
      rowKey="key"
      pagination={false}
      dataSource={data}
      scroll={{ x: 1400, y: 1000 }}
    />
  );
};
