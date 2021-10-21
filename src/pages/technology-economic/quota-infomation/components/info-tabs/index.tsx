import React, { useMemo } from 'react';
import { Tabs, Table } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
import styles from './index.less';

interface MaterialMachineItems {
  no: string;
  type: number;
  [key: string]: string | number;
}
interface Props {
  data: {
    materialMachineItems?: MaterialMachineItems[];
    adjustments?: {
      no: string;
      [key: string]: string;
    }
  }
}

const columns1 = [
  {
    title: "编号",
    dataIndex: "no",
    key: "no",
    width: 220,
    render(e: string, m: MaterialMachineItems) {
      if (m.isRoot) {
        return (<span><FolderOpenOutlined />&nbsp;{m.no}</span>)
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
    dataIndex: "unit",
    key: "unit",
    width: 220,
  },
  {
    title: "数量",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "预算价（元）",
    dataIndex: "prePrice",
    key: "prePrice",
  },
  {
    title: "单重（kg）",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "计价",
    dataIndex: "valuationTypeText",
    key: "valuationTypeText",
  },
];
const dataSource = [
  {
    isRoot: true,
    no: "人工",
  },
  {
    isRoot: true,
    no: "材料",
  },
  {
    isRoot: true,
    no: "机械",
  },
];

const columns2 = [
  {
    title: "调整项目及内容",
    dataIndex: "adjustmentContent",
    key: "adjustmentContent",
  },
  {
    title: "调整类型",
    dataIndex: "typeText",
    key: "typeText",
    width: 120
  },
  {
    title: "人工费系数",
    dataIndex: "laborCoefficientFormula",
    key: "laborCoefficientFormula",
    width: 140
  },
  {
    title: "材料费系数",
    dataIndex: "materialCoefficientFormula",
    key: "materialCoefficientFormula",
    width: 140
  },
  {
    title: "机械费系数",
    dataIndex: "machineryCoefficientFormula",
    key: "machineryCoefficientFormula",
    width: 140
  },
  {
    title: "消耗量系数",
    dataIndex: "consumptionFormula",
    key: "consumptionFormula",
    width: 140
  },
  {
    title: "人材机编号",
    dataIndex: "materialMachineItemNo",
    key: "materialMachineItemNo",
    width: 120
  },
]

const InfoTabs: React.FC<Props> = ({ data }) => {
  const dataSourceResult = useMemo(() => {
    const materialMachineItems = JSON.parse(JSON.stringify(dataSource));
    if (Array.isArray(data?.materialMachineItems) && data?.materialMachineItems.length > 0) {
      const data1 = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 1);
      const data2 = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 2);
      const data3 = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 3);
      data1.length > 0 && (materialMachineItems[0].children = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 1));
      data2.length > 0 && (materialMachineItems[1].children = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 2));
      data3.length > 0 && (materialMachineItems[2].children = data.materialMachineItems.filter((item: MaterialMachineItems) => item.type === 3));
    }

    return {
      materialMachineItems,
      adjustments: data?.adjustments ?? [],
      workContent: ""
    };
  }, [JSON.stringify(data)])
  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="定额人材机" key="定额人材机">
            <Table
              columns={columns1}
              dataSource={dataSourceResult.materialMachineItems}
              pagination={false}
              bordered
              defaultExpandedRowKeys={[]}
              // defaultExpandedRowKeys={["人工", "材料", "机械"]}
              rowKey="no"
              scroll={{ y: 300 }}
            />
          </TabPane>
          <TabPane tab="定额调整系数" key="定额调整系数">
            <Table
              columns={columns2}
              dataSource={(dataSourceResult.adjustments ?? []) as object[]}
              pagination={false}
              bordered
              scroll={{ y: 300 }}
            />
          </TabPane>
          <TabPane tab="工作内容" key="工作内容">
            {/*@ts-ignore*/}
            <div className={styles.workContent}>{JSON.stringify(data?.quotaItem?.workContent) || ''}</div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default InfoTabs;
