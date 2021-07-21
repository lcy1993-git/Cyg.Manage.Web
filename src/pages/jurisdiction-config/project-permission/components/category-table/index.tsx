import React, { useState, useEffect, useMemo } from 'react';
import { Button, Checkbox, Table } from 'antd';
import CommonTitle from '@/components/common-title';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import PermissionTypeModal from '../type-select-modal';

const CategoryTable: React.FC = () => {
  const [typeSelectModalVisible, setTypeSelectModalVisible] = useState<boolean>(false);

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
      <Table columns={columns} bordered />

      {typeSelectModalVisible && (
        <PermissionTypeModal
          visible={typeSelectModalVisible}
          onChange={setTypeSelectModalVisible}
        />
      )}
    </>
  );
};

export default CategoryTable;
