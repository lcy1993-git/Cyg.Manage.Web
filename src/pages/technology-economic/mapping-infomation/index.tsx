import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { getSourceMaterialMappingLibraryList } from '@/services/technology-economic/material'
import { getMaterialLibraryTreeById } from '@/services/technology-economic/supplies-library'
import { useMount } from 'ahooks'
import { Select, Tabs, Tree } from 'antd'
import Search from 'antd/lib/input/Search'
import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

const { Option } = Select

const { DirectoryTree } = Tree
const { TabPane } = Tabs
const columns = [
  {
    title: '序号',
    width: 80,
    render(v: any, record: any, index: number) {
      return <span>{index + 1}</span>
    },
  },

  {
    dataIndex: 'code',
    index: 'code',
    title: '编号',
    ellipsis: true,
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '名称',
    ellipsis: true,
  },
  {
    dataIndex: 'standard',
    index: 'standard',
    title: '规格',
    ellipsis: true,
  },
  {
    dataIndex: 'count',
    index: 'count',
    title: '数量',
    ellipsis: true,
  },
  {
    dataIndex: 'projectMappingCode',
    index: 'projectMappingCode',
    title: '项目划分',
    ellipsis: true,
  },
]

interface SelectIten {
  enabled: boolean
  id: string
  name: string
  publishDate: moment.Moment
  publishOrg: string
  sourceMaterialLibraryId: string
  remark: string
}

const MappingInfomation = () => {
  const [materialLibraryId, setMaterialLibraryId] = useState<string>('')
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [materialLibList, setMaterialLibList] = useState([])
  const [slectLsit, setSlectLsit] = useState<SelectIten[]>([])
  const [id, setId] = useState<string>('')
  const [sourceMaterialLibraryId, setSourceMaterialLibraryId] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(true)
  const [mappingType, setMappingType] = useState<string>('1')
  const tableRef = React.useRef<HTMLDivElement>(null)
  const getTree = (arr: any[]) => {
    return arr.map((item) => {
      // eslint-disable-next-line no-param-reassign
      item.title = item.name
      // eslint-disable-next-line no-param-reassign
      item.value = item.id
      // eslint-disable-next-line no-param-reassign
      item.key = item.id
      if (item.children && item.children.length !== 0) {
        getTree(item.children)
      }
      return item
    })
  }
  useMount(async () => {
    // 获取id
    let val = qs.parse(window.location.href.split('?')[1])?.id
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const materialLibraryId = qs.parse(window.location.href.split('?')[1])?.sourceMaterialLibraryId
    val = val === 'undefined' ? '' : val
    setId(val as string)
    setSourceMaterialLibraryId(materialLibraryId as string)
  })
  const getTreeList = async () => {
    if (id === '') return
    tableRef && tableRef?.current?.reset()
    tableRef && tableRef?.current?.search()
  }
  const getDirectoryList = async () => {
    if (id === '') return
    const res = await getMaterialLibraryTreeById(sourceMaterialLibraryId)
    setMaterialLibList(getTree(res) as [])
  }
  const tableTabChange = (val: string) => {
    setMappingType(val)
    setVisible(false)
    setSearchKeyWord('')
    setTimeout(() => {
      setVisible(true)
    })
  }
  useEffect(() => {
    getDirectoryList()
    getTreeList()
  }, [id])
  useEffect(() => {
    getTreeList()
  }, [materialLibraryId, mappingType])
  const ref = useRef(null)
  const typeOnChange = (val: string) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = slectLsit.find((item) => item.id === val)
    console.log(slectLsit, val, item)
    if (item) {
      setId(item.id)
      setSourceMaterialLibraryId(item.sourceMaterialLibraryId)
    }
  }
  const treeOnChange = (val: any) => {
    setMaterialLibraryId(val[0])
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    })
  }
  const getSelectList = async () => {
    const data = {
      pageIndex: 1,
      pageSize: 9999,
      keyWord: '',
    }
    const res = await getSourceMaterialMappingLibraryList(data)
    setSlectLsit(res?.items)
  }
  const onSearch = () => {
    // tableRef && tableRef?.current?.searchByParams({'keyWord':searchKeyWord})
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    })
    // tableRef && tableRef?.current?.search()
  }
  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={onSearch}
          enterButton
          placeholder="请输入关键词"
        />
      </TableSearch>
    )
  }
  const getRequest = () => {
    const url = window.location.search //获取url中"?"符后的字串
    const theRequest = new Object()
    if (url.indexOf('?') != -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return theRequest
  }
  useEffect(() => {
    getSelectList()
  }, [])
  const tabs = [
    {
      title: '估算',
      key: 1,
    },
    {
      title: '概算',
      key: 2,
    },
    {
      title: '预算',
      key: 3,
    },
    {
      title: '拆除',
      key: 4,
    },
  ]
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin">
            <TabPane tab="物料库目录" key="物料库目录">
              <div className={styles.selectWrap}>
                <Select style={{ width: 270 }} value={id} onChange={typeOnChange}>
                  {slectLsit.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
                </Select>
                <br />
                <br />
                <div className={styles.treeBox}>
                  {materialLibList.length !== 0 && (
                    <DirectoryTree
                      defaultExpandAll={false}
                      key={'id'}
                      onSelect={treeOnChange}
                      treeData={materialLibList}
                    />
                  )}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.empty} />
        <div className={styles.wrapRigntContent}>
          <div className={styles.tabPaneBox}>
            <div className={styles.listTable}>
              <Tabs defaultActiveKey="1" onChange={tableTabChange} className="normalTabs noMargin">
                {tabs.map((tab) => {
                  return (
                    <TabPane tab={tab.title} key={tab.key}>
                      <div>
                        {visible && (
                          <GeneralTable
                            buttonLeftContentSlot={searchComponent}
                            url="/MaterialLibrary/GetMaterialMappingQuotaList"
                            // noPaging
                            ref={tableRef}
                            // dataSource={tableData}
                            rowKey={'id'}
                            columns={columns}
                            tableTitle=""
                            requestSource="tecEco1"
                            type="radio"
                            childrenColumnName={'materialMappingQuota'}
                            extractParams={{
                              keyWord: searchKeyWord.trim(),
                              mappingType: mappingType,
                              sourceMaterialMappingLibraryId: id || getRequest()?.id,
                              sourceMaterialLibraryId:
                                sourceMaterialLibraryId || getRequest()?.sourceMaterialLibraryId,
                              sourceMaterialLibraryCatalogueId: materialLibraryId,
                            }}
                          />
                        )}
                      </div>
                    </TabPane>
                  )
                })}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default MappingInfomation
