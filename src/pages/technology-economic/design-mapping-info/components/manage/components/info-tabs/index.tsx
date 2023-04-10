import { Tabs, Table } from 'antd'
import styles from './index.less'

const { TabPane } = Tabs

interface Props {
  data: {
    childs?: {
      [key: string]: string
    }[]
  }
}

const columns = [
  {
    title: '编号',
    dataIndex: 'no',

    width: 100,
  },
  {
    title: '材机名称',
    dataIndex: 'name',
  },
  {
    title: '单位',
    dataIndex: 'unit',

    width: 220,
  },
  {
    title: '数量',
    dataIndex: 'count',
  },
  {
    title: '预算价（元）',
    dataIndex: 'prePrice',
  },
  {
    title: '单重（kg）',
    dataIndex: 'weight',
  },
  {
    title: '计价',
    dataIndex: 'valuationTypeText',
  },
]

const InfoTabs: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className={styles.infoTabsWrap}>
        <Tabs className="normalTabs noMargin">
          <TabPane tab="拆分人材机" key="拆分人材机">
            <Table
              columns={columns}
              dataSource={data?.childs ?? []}
              pagination={false}
              bordered
              defaultExpandedRowKeys={['人工', '材料', '机械']}
              rowKey="id"
              scroll={{ y: 300 }}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}

export default InfoTabs
