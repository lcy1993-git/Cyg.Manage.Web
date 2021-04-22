import React, { FC, useState } from 'react';
import { Drawer, Button, Table } from 'antd';
import styles from './index.less';
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

// export interface SidePopupProps {
//   visible?: boolean;
//   onClose: () => void;
// }
// const data: TableDataType[] = [];

const SidePopup = (props: any) => {
  // const { visible, onClose } = props;
  // const [visible, setVisbel] = useState(true)
  const { data, visible, setRightSidebarVisiviabel } = props;
  return (
    <div         className={styles.wrap}>
      <Drawer
        title="Basic Drawer"

        placement="right"
        closable={true}
        visible={visible}
        onClose={() => setRightSidebarVisiviabel(false)}
        destroyOnClose={true}
        mask={false}
        getContainer={false}
        style={{position: 'absolute', width: 300}}
      >
        <Table style={{height: 30}} pagination={false} columns={columns} dataSource={data} rowClassName={styles.row}/>
      </Drawer>
    </div>
  );
};

export default SidePopup;
