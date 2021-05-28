import {useState} from 'react';
import { Tabs, Table } from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
import styles from './index.less';



const columns1 = [
  {
    title: "编号",
    dataIndex: "id",
    key: "id",
    width: 220,
    render(e: string, m){
      if(m.isRoot) {
        return (<span><FolderOpenOutlined />&nbsp;{m.id}</span>)
      }
      return (<span>{e}</span>);
    }
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
    isRoot: true,
    id: "人工",
    children: [
      {
        id: 1
      }
    ]
  },
  {
    isRoot: true,
    id: "材料",
    children: [
      {
        id: 2
      }
    ]

  },
  {
    isRoot: true,
    id: "机械",
    children: [
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
      {
        id: 3
      },
    ]
  },
];

const dataSource2 = [
  {id: "123"},
  {id: "123"},
  {id: "123"},
]
const columns2 = [
  {
    title: "调整项目及内容",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "调整类型",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "人工费系数",
    dataIndex: "part",
    key: "part"
  },
  {
    title: "材料费系数",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "机械费系数",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "消耗量系数",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "人材机编号",
    dataIndex: "id",
    key: "id"
  },
]

const InfoTabs = () => {

  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="定额人材机" key="定额人材机">
              <Table
                columns={columns1}
                dataSource={dataSource}
                pagination={false}
                bordered
                defaultExpandedRowKeys={["人工", "材料", "机械"]}
                rowKey="id"
                scroll={{y: 300}}
              />
          </TabPane>
          <TabPane tab="定额调整系数" key="定额调整系数">
            <Table
              columns={columns2}
              dataSource={dataSource2}
              pagination={false}
              bordered
              scroll={{y: 300}}
            />
          </TabPane>
          <TabPane tab="工作内容" key="工作内容">
            <div className={styles.workContent}>工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容
            工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容
            工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容工作内容
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default InfoTabs;