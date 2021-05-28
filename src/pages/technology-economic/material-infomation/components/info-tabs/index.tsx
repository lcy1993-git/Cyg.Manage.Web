import {useState} from 'react';
import { Tabs, Table } from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
import styles from './index.less';



const columns = [
  {
    title: "编号",
    dataIndex: "id",
    key: "id",
    width: 220,
  },
  {
    title: "人材机名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "单位",
    dataIndex: "columns3",
    key: "columns3",
    width: 220,
  },
  {
    title: "数量",
    dataIndex: "columns4",
    key: "columns4",
  },
  {
    title: "预算价（元）",
    dataIndex: "columns4",
    key: "columns4",
  },
  {
    title: "单重（kg）",
    dataIndex: "columns4",
    key: "columns4",
  },
  {
    title: "计价",
    dataIndex: "columns4",
    key: "columns4",
  },
];
const dataSource = [
  {
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  },
  {
    id: 11
  },
  {
    id: 22
  },
  {
    id: 33
  },
  {
    id: 13
  },
  {
    id: 23
  },
  {
    id: 33
  },
];

const InfoTabs = () => {

  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="拆分人材机" key="拆分人材机">
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                defaultExpandedRowKeys={["人工", "材料", "机械"]}
                rowKey="id"
                scroll={{y: 300}}
              />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default InfoTabs;