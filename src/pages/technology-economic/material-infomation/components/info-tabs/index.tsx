import { Tabs, Table } from 'antd';
const { TabPane } = Tabs;
import styles from './index.less';

const columns1 = [
  {
    title: "列1",
    dataIndex: "columns1",
    key: "columns1",
    width: 220,
    className: 'grey'
  },
  {
    title: "列2",
    dataIndex: "columns2",
    key: "columns2",
  },
  {
    title: "列3",
    dataIndex: "columns3",
    key: "columns3",
    width: 220,
    className: 'grey'
  },
  {
    title: "列4",
    dataIndex: "columns4",
    key: "columns4",
  },
];
const dataSource = [
  {
    columns1: "定额费",
    columns2: "234",
    columns3: "定额系数",
    columns4: "456",
  },
  {
    columns1: "人工费",
    columns2: "234",
    columns3: "人工系数",
    columns4: "456",
  },
  {
    columns1: "材料费",
    columns2: "234",
    columns3: "材料系数",
    columns4: "456",
  },
  {
    columns1: "脚手架",
    columns2: "234",
    columns3: "调试费",
    columns4: "456",
  },
  {
    columns1: "脚手架",
    columns2: "234",
    columns3: "调试费",
    columns4: "456",
  },
  {
    columns1: "浇捣方式",
    columns2: "",
    columns3: "定额范围",
    columns4: "456",
  },
];

const dataSource2 = [
  {id: "123"},
  {id: "123"},
  {id: "123"},
]
const columns2 = [
  {
    title: "编号",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "单位",
    dataIndex: "part",
    key: "part"
  },
  {
    title: "含量",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "预算价",
    dataIndex: "id",
    key: "id"
  },
]

const columns3 = [
  {
    title: "调整条件",
    dataIndex: "if",
    key: "if",
  },
  {
    title: "调整类型",
    dataIndex: "if",
    key: "if",
  },
  {
    title: "系统调整设置",
    children: [
      {
        title: "人工",
        dataIndex: "if",
        key: "if",
      },
      {
        title: "材料",
        dataIndex: "if",
        key: "if",
      },
      {
        title: "机械",
        dataIndex: "if",
        key: "if",
      },
      {
        title: "消耗量",
        dataIndex: "if",
        key: "if",
      },
    ]
  },

  {
    title: "人机材编号",
    dataIndex: "if",
    key: "if",
  },
  {
    title: "n取值",
    dataIndex: "if",
    key: "if",
  },
];

const dataSource3 = [
  {
    if: "1"
  }
]

const columns4 = [
  {
    title: "序号",
    dataIndex: "xuhao",
    key: "xuhao"
  },
  {
    title: "表达式",
    dataIndex: "reg",
    key: "reg"
  },
  {
    title: "结果",
    dataIndex: "res",
    key: "res"
  },
  {
    title: "说明",
    dataIndex: "shuoming",
    key: "shuoming"
  },
];
const dataSource4 = [
  {
    xuhao: "1"
  },
  {
    xuhao: "2"
  },
  {
    xuhao: "3"
  },
];
const InfoTabs = () => {


  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="基本信息" key="基本信息">
              <Table
                columns={columns1}
                dataSource={dataSource}
                showHeader={false}
                pagination={false}
                bordered
              />
          </TabPane>
          <TabPane tab="材机列表" key="材机列表">
            <Table
              columns={columns2}
              dataSource={dataSource2}
              pagination={false}
              bordered
            />
          </TabPane>
          <TabPane tab="定额调整系数" key="定额调整系数">
            <Table
              columns={columns3}
              dataSource={dataSource3}
              pagination={false}
              bordered
            />
          </TabPane>
          <TabPane tab="计算式" key="计算式">
            <Table
              columns={columns4}
              dataSource={dataSource4}
              pagination={false}
              bordered
            />      
          </TabPane>
          <TabPane tab="批注" key="批注">
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default InfoTabs;