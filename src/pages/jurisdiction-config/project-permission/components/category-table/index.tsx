import React, { useState, useEffect, useMemo } from 'react';
import { Button, Checkbox, Table } from 'antd';
import CommonTitle from '@/components/common-title';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import PermissionTypeModal from '../type-select-modal';

export interface permissionItem {
  category: string | undefined;
  objectId: string | undefined;
  projectTypes: number[] | undefined;
}

const CategoryTable: React.FC = () => {
  const [typeSelectModalVisible, setTypeSelectModalVisible] = useState<boolean>(false);
  const [tableSelectData, setTableSelectData] = useState<permissionItem[]>([]);
  const [currentTableData, setCurrentTableData] = useState<permissionItem[]>([]);

  // const [currentTableData, setCurrentTableData] = useState<any[]>([]);

  const columns = [
    {
      title: '对象类型',
      dataIndex: 'category',
      index: 'category',
      width: 200,
    },
    {
      title: '对象',
      dataIndex: 'objectId',
      index: 'objectId',
      width: 200,
    },
    {
      title: '项目类型',
      dataIndex: 'projectTypes',
      index: 'projectTypes',
    },
  ];

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setTableSelectData(selectedRows);
    },
  };

  console.log(tableSelectData);

  return (
    <>
      <div className={styles.categoryHead}>
        <div>
          <CommonTitle>配置权限条目</CommonTitle>
        </div>
        <div className={styles.buttonPart}>
          <Button type="primary" className="mr7" onClick={() => setTypeSelectModalVisible(true)}>
            <PlusOutlined />
            添加
          </Button>
          <Button className="mr7">
            <EditOutlined />
            编辑
          </Button>
          <Button>
            <DeleteOutlined />
            删除
          </Button>
        </div>
      </div>
      <Table
        size="small"
        rowKey="objectId"
        rowSelection={{
          type: 'radio',
          columnWidth: '38px',
          // selectedRowKeys: tableSelectData,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={currentTableData}
        bordered
      />

      {typeSelectModalVisible && (
        <PermissionTypeModal
          visible={typeSelectModalVisible}
          onChange={setTypeSelectModalVisible}
          changeTableEvent={setCurrentTableData}
          hasAddData={currentTableData}
        />
      )}
    </>
  );
};

export default CategoryTable;
