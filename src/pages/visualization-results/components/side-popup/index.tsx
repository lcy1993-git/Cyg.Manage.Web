import React, { FC, useState } from 'react';
import { Drawer, Button, Table } from 'antd';

const columns = [
  {
    title: '属性名',
    dataIndex: 'propertyName',
  },
  {
    title: '属性值',
    dataIndex: 'data',
  },
];
export interface TableDataType {
  propertyName: string;
  data: string;
}
const data: TableDataType[] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    propertyName: 'test',
    data: `Edward King ${i}`,
  });
}
const SidePopup: FC = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        侧边弹出
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Table pagination={false}  columns={columns} dataSource={data} />
      </Drawer>
    </>
  );
};

export default SidePopup;
