import PageCommonWrap from '@/components/page-common-wrap'
import TreeTable from '@/components/tree-table'
import { updateCompanyStatus } from '@/services/system-config/subordinate-company'
import { message, Switch } from 'antd'
import React, { useRef } from 'react'
import Styles from './index.less'

interface TableRef extends HTMLDivElement {
  refresh: () => void
}

const SubordinateCompany: React.FC = () => {
  const tableRef = useRef<TableRef>(null)
  const updateStatus = async (data: any) => {
    const { id, isFilterTree } = data
    await updateCompanyStatus({ companyId: id, isFilterTree: !isFilterTree })
    message.success('更新成功')
    refreshTable()
  }

  const refreshTable = () => {
    if (tableRef && tableRef.current) {
      tableRef.current.refresh()
    }
  }

  const tableColumns = [
    {
      title: '下级公司名称',
      dataIndex: 'name',
      index: 'name',
    },
    {
      title: '管理员账号',
      dataIndex: 'adminUserName',
      index: 'adminUserName',
    },

    {
      title: '是否纳入管理',
      render: (record: any) => {
        const isChecked = record.isFilterTree
        return (
          <>
            <Switch checked={isChecked} onChange={() => updateStatus(record)} />
            <span style={{ color: isChecked ? '#0E7B3B' : '#C1C1C1', paddingLeft: '8px' }}>
              {isChecked ? '是' : '否'}
            </span>
          </>
        )
      },
      width: 140,
    },
  ]
  return (
    <PageCommonWrap>
      <div className={Styles.tableContent}>
        <TreeTable
          needCheck={false}
          url="/CompanyTree/GetCompanyTreeList"
          ref={tableRef}
          tableTitle="下级公司配置"
          columns={tableColumns}
        />
      </div>
      <div className={Styles.tipInfo}>
        <span>
          说明：通过该功能，可以配置是否将下级公司立项的项目数据纳入您的“首页统计”、“我的工作台”、“网架可视化”当中进行统一管理。
        </span>
      </div>
    </PageCommonWrap>
  )
}

export default SubordinateCompany
