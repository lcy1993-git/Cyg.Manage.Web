import React from 'react';
import { Drawer, Table } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import styles from './index.less';


const columns = [
  {
    title: '属性名',
    dataIndex: 'propertyName',
  },
  {
    title: '属性值',
    dataIndex: 'data',
    render(value: any, record: any, index: any){
      if(typeof value === "string") return <span key={index}>{value}</span>;
      if(record.propertyName === "多媒体"){
        console.log(record);
        if(!value) return <span className={styles.none}>暂无数据</span>
        return <span className={styles.link} key={index}>查看</span>
      }else if(record.propertyName === "材料表"){
        console.log(record);
        return <span className={styles.link} key={index}>查看</span>
      }else if(record.propertyName === "批注"){
        console.log(record);
        return <span className={styles.link} key={index}>添加批注</span>
      }
      return ""
    }
  },
];
export interface TableDataType {
  propertyName: string;
  data: string;
}

export interface Props {
  data: TableDataType[];
  visible: boolean;
  setRightSidebarVisiviabel: (arg0: boolean) => void;
}

const SidePopup: React.FC<Props> = (props) => {
  const { data, visible, setRightSidebarVisiviabel } = props;
  return (
    <div className={styles.wrap}>
      <Drawer
        placement="right"
        closable={false}
        visible={visible}
        destroyOnClose={true}
        mask={false}
        getContainer={false}
        style={{position: 'absolute', width: 340}}
      >
        <div className={styles.drawerClose} onClick={() => setRightSidebarVisiviabel(false)}>
          <MenuUnfoldOutlined />
        </div>
        <Table style={{height: 30}} pagination={false} columns={columns} dataSource={data} rowClassName={styles.row}/>
      </Drawer>
    </div>
  );
};

export default SidePopup;
