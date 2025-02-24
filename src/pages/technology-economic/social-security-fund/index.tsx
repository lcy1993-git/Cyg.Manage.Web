import CommonTitle from '@/components/common-title'
import WrapperComponent from '@/components/page-common-wrap'
import TableImportButton from '@/components/table-import-button'
import { querySocialSecurityHouseFundTree } from '@/services/technology-economic/social-security-fund'
import { DownOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
import type { TreeDataNode } from 'antd'
import { Spin, Table, Tree } from 'antd'
import type { Key } from 'react'
import React, { useState } from 'react'
import styles from './index.less'

type DirectoryNode = TreeDataNode & {
  id: string
  key: string
  socialSecurityRate: number
  houseFundRate: number
  remark: string
}
const SocialSecurityFund: React.FC = () => {
  const [preLoading, setPreLoading] = useState(false)
  const [tableData, setTableData] = useState<DirectoryNode[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [activeKey, setActiveKey] = useState<Key[]>([])
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '费率(%)',
      dataIndex: 'rate',
    },
    {
      title: '备注及说明',
      dataIndex: 'remark',
    },
  ]
  const deepAddKey = (arr: []) => {
    return arr.map((item: { key: any; id: any; children: string | any[] }) => {
      // eslint-disable-next-line no-param-reassign
      item.key = item.id
      if (item.children && item.children.length !== 0) {
        deepAddKey(item.children as [])
      }
      return item
    })
  }
  const getTableList = async () => {
    setPreLoading(true)
    const data = await querySocialSecurityHouseFundTree()
    deepAddKey(data as [])
    setTableData(data)
    setPreLoading(false)
  }

  const findRowByKey = (key: React.Key, arr: []) => {
    let val: any = null
    arr.map((item: any) => {
      if (item.id === key) {
        val = item
      }
      if (item.children.length !== 0) {
        if (val) return null
        val = item.children.find((child: { id: Key }) => {
          return child.id === key
        })
      }
      return null
    })
    return val
  }
  const treeOnSelect = (keys: Key[]) => {
    const row = findRowByKey(keys[0], tableData[0].children as [])
    if (row) {
      setActiveKey([row.id])
      setDataSource([
        {
          name: '社会保险费率',
          rate: row.socialSecurityRate,
          remark: row.remark,
        },
        {
          name: '住房公积金费率',
          rate: row.houseFundRate,
          remark: row.remark,
        },
      ])
    }
  }

  useMount(() => {
    getTableList()
  })
  return (
    <WrapperComponent>
      <div className={styles.socialSecurityFund}>
        <div className={styles.imfomationModalWrap}>
          <div className={styles.topContainer}>
            <div className={styles.topContainerTitle}>
              <CommonTitle>社保公积金费率</CommonTitle>
            </div>
            <div className={styles.importButton}>
              <TableImportButton
                extraParams={{
                  // commonlyTableType: 6,
                  RateFileId: window.location.hash.split('=')[1],
                }}
                modalTitle={'导入费率'}
                buttonTitle={'导入费率'}
                // style={{ zIndex: 99 }}
                downType={6}
                template={true}
                requestSource={'tecEco1'}
                importUrl={`/RateTable/ImportRateTable`}
                setSuccessful={getTableList}
              />
            </div>
          </div>
          <Spin spinning={preLoading}>
            <div className={styles.bottomContainer}>
              <div className={styles.containerLeft}>
                <div className={styles.containerLeftTitle}>目录</div>
                <div className={styles.listElement}>
                  {!preLoading && (
                    <Tree
                      height={620}
                      selectedKeys={activeKey}
                      showLine
                      key={'id'}
                      onSelect={treeOnSelect}
                      defaultExpandAll
                      switcherIcon={<DownOutlined />}
                      titleRender={(item) => {
                        // @ts-ignore
                        return <div className={styles.listElementItem}>{item.name}</div>
                      }}
                      treeData={tableData}
                    />
                  )}
                </div>
              </div>
              <div className={styles.containerRight}>
                <div className={styles.body}>
                  <Table
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    size={'small'}
                    columns={columns}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </WrapperComponent>
  )
}

export default SocialSecurityFund
