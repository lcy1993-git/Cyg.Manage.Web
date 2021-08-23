
import { Tabs, Table } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

interface Props {
  data: {
    childs?: {
      [key: string]: string;
    }[]
  }
}

const columnsLeft = [
  {
    title: "信息价名称",
    dataIndex: "no",
    key: "no",
    width: 100,
  },
  {
    title: "含税价",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "不含税价",
    dataIndex: "unit",
    key: "unit",
    width: 220,
  },
  {
    title: "备注",
    dataIndex: "count",
    key: "count",
  },
];
const columnsRight = [
  {
    title: "标记",
    dataIndex: "no",
    key: "no",
    width: 100,
  },
  {
    title: "编号",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "名称",
    dataIndex: "unit",
    key: "unit",
    width: 220,
  },
  {
    title: "规格",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "单位",
    dataIndex: "prePrice",
    key: "prePrice",
  },
  {
    title: "计算式",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "默认资源",
    dataIndex: "valuationTypeText",
    key: "valuationTypeText",
  },
  {
    title: "关联父级量",
    dataIndex: "valuationTypeText",
    key: "valuationTypeText",
  },
  {
    title: "所属项目",
    dataIndex: "valuationTypeText",
    key: "valuationTypeText",
  },
];

const InfoTabs: React.FC<Props> = ({data}) => {

  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="信息价" key="信息价">
              <Table
                columns={columnsLeft}
                dataSource={data?.childs ?? []}
                pagination={false}
                bordered
                defaultExpandedRowKeys={["人工", "材料", "机械"]}
                rowKey="id"
                scroll={{y: 300}}
              />
          </TabPane>
          <TabPane tab="关联资源" key="关联资源">
              <Table
                columns={columnsRight}
                dataSource={data?.childs ?? []}
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
