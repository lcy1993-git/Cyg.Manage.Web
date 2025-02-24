import { useEffect, useMemo, useState, useRef } from 'react'
import { useMount, useRequest, useSize } from 'ahooks'
import { Tabs, Tree, Select, Button } from 'antd'
import PageCommonWrap from '@/components/page-common-wrap'
import ChapterInfo from './components/chapter-info'
import ListTable from '../components/list-table'
import InfoTabs from './components/info-tabs'

import qs from 'qs'
import type { TreeData } from '@/utils/utils'
import { formatDataTree, fileTreeFormData } from '@/utils/utils'
import {
  queryQuotaLibraryPager,
  queryQuotaLibraryCatalogList,
  getQuotaLibraryCatalogDescription,
} from '@/services/technology-economic'
import { EyeOutlined } from '@ant-design/icons'
import styles from './index.less'
import { history } from 'umi'
const { TabPane } = Tabs

interface DataSource {
  quotaItem?: {
    id: string
    [key: string]: string
  }
}
interface Items {
  id: string
  total: number
  name: string
}
interface QuotaList {
  total: number
  items: Items[]
}

const columns = [
  {
    dataIndex: 'no',
    index: 'no',
    title: '定额编号',
    width: 180,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.no
    },
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '定额名称',
    width: 460,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.name
    },
  },
  {
    dataIndex: 'unit',
    index: 'unit',
    title: '单位',
    width: 60,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.unit
    },
  },
  {
    dataIndex: 'basePrice',
    index: 'basePrice',
    title: '基价(元)',
    width: 100,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.basePrice
    },
  },
  {
    dataIndex: 'laborCost',
    index: 'laborCost',
    title: '人工费(元)',
    width: 120,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.laborCost
    },
  },
  {
    dataIndex: 'materialCost',
    index: 'materialCost',
    title: '材料费(元)',
    width: 120,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.materialCost
    },
  },
  {
    dataIndex: 'machineryCost',
    index: 'machineryCost',
    title: '机械费(元)',
    width: 120,
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.machineryCost
    },
  },
  {
    dataIndex: 'scaffoldType',
    index: 'scaffoldType',
    title: '脚手架',
    ellipsis: true,
    render(v: string, record: DataSource) {
      return record?.quotaItem?.scaffoldType
    },
  },
]

const QuotaProject = () => {
  const [activeQuotaId, setActiveQuotaId] = useState<string>(
    (qs.parse(window.location.href.split('?')[1]).id as string) || ''
  )
  const [catalogueId, setCatalogueId] = useState<string>('')
  const [resourceItem, setResourceItem] = useState<object>({})
  const [title, setTitle] = useState<string>('')
  const [nodeId, setNodeId] = useState<string>('')
  const [disabledDown, setDisabledDown] = useState<boolean>(false)

  const { data: quotaList = { total: 0, items: [] }, run: quotaListRun } = useRequest<QuotaList>(
    queryQuotaLibraryPager,
    {
      manual: true,
    }
  )

  const { data: catalogueList, run: catalogueListRun } = useRequest<TreeData[]>(
    queryQuotaLibraryCatalogList,
    {
      manual: true,
    }
  )

  const { data: chapterData, run: chapterRun } = useRequest<string>(
    getQuotaLibraryCatalogDescription,
    { manual: true }
  )

  useEffect(() => {
    catalogueId && chapterRun(catalogueId)
  }, [catalogueId])

  const ref = useRef(null)
  const refWrap = useSize(ref)

  useEffect(() => {
    activeQuotaId && catalogueListRun(activeQuotaId)
  }, [activeQuotaId])

  useMount(() => {
    quotaListRun({ pageIndex: 1, pageSize: 3000 })
  })

  const treeData = useMemo(() => {
    if (catalogueList && catalogueList.length > 0) {
      let data = fileTreeFormData(formatDataTree(catalogueList))
      if (data.length !== 0) {
        setCatalogueId(data[0]?.id)
        return data
      }
    }
    return []
  }, [catalogueList])

  const options = useMemo(() => {
    if (quotaList.total) {
      return quotaList.items.map((item) => {
        return (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        )
      })
    } else {
      return null
    }
  }, [quotaList])

  const onCheck = (
    kes: React.Key[],
    { node }: { node: { key: number | string; name: string; id: string } }
  ) => {
    setTitle(node.name)
    setNodeId(node.id)
    setDisabledDown(node?.name?.includes('.') && !node?.name?.includes('第'))
    catalogueId === node.key || setCatalogueId(node.key as string)
    setResourceItem({})
  }
  const onSelect = (e: string) => {
    setActiveQuotaId(e)
    setResourceItem({})
  }
  const addEvent = () => {
    const id = ''
    history.push(`/technology-economic/quota-infomation/components/reinforcement-quota?id=${id}`)
  }
  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <EyeOutlined />
          钢筋定额
        </Button>
      </div>
    )
  }
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          {/*{catalogueId}*/}
          {/*{activeQuotaId}*/}
          <Tabs className="normalTabs noMargin">
            <TabPane tab="定额库目录" key="1">
              <div className={styles.selectWrap}>
                <Select
                  placeholder="请选择定额库"
                  style={{ width: '100%' }}
                  children={options}
                  onChange={(e) => onSelect(e)}
                  defaultValue={activeQuotaId}
                />
              </div>
              <div className={styles.fileTree}>
                {treeData.length !== 0 && (
                  <Tree.DirectoryTree
                    // @ts-ignore
                    onSelect={onCheck}
                    treeData={treeData}
                    defaultSelectedKeys={[treeData[0]?.id]}
                    // defaultExpandAll
                  />
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.empty} />
        <div className={styles.wrapRigntContent}>
          <Tabs className="normalTabs noMargin">
            <TabPane tab="&nbsp;&nbsp;资源列表" key="1">
              <div className={styles.tabPaneBox}>
                <div className={styles.listTable}>
                  <ListTable
                    catalogueId={catalogueId}
                    buttonRightContentSlot={tableElement}
                    scrolly={refWrap?.height ? refWrap?.height - 531 : 0}
                    setResourceItem={setResourceItem}
                    url="/QuotaLibraryCatalog/QueryQuotaItemPager"
                    rowKey={(e: DataSource) => e.quotaItem?.id}
                    columns={columns}
                  />
                </div>
                <div className={styles.heightEmpty} />
                <InfoTabs data={resourceItem} />
              </div>
            </TabPane>
            <TabPane tab="章节说明" key="章节说明">
              <ChapterInfo
                data={chapterData || ''}
                title={title}
                nodeId={nodeId}
                disabledDown={disabledDown}
                fileId={activeQuotaId || catalogueId}
                id={catalogueId}
                update={() => catalogueId && chapterRun(catalogueId)}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default QuotaProject
