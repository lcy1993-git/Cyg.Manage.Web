import TableSearch from '@/components/table-search'
import UrlSelect from '@/components/url-select'
import { useGetSelectData } from '@/utils/hooks'
import { LeftOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useProjectAllAreaStatisticsStore } from '../../store'
import TitleWindow from '../title-window'
import CompanyTable from './components/company-table'
import ProjectTable from './components/project-table'
import styles from './index.less'

const CompanyAndProjectTable: React.FC = () => {
  const {
    dataType,
    companyInfo,
    projectShareCompanyId,
    setDataType,
    setCompanyInfo,
    setProjectShareCompanyId,
  } = useProjectAllAreaStatisticsStore()
  const [nowCompanyId, setNowCompanyId] = useState<string>('')
  const { companyId = '' } = JSON.parse(localStorage.getItem('userInfo') ?? '{}')
  const { data: companyData = [], loading } = useGetSelectData(
    {
      url: '/ProjectStatistics/GetCompanyList',
    },
    {
      onSuccess: () => {
        setNowCompanyId(companyData[0]?.value)
      },
    }
  )

  const handleCompanyData = useMemo(() => {
    if (companyData) {
      return companyData.map((item: any) => {
        if (item.value === companyId) {
          return { label: '我的公司', value: item.value }
        }
        return item
      })
    }
    return
  }, [companyData])

  const [selectedCompanyId] = useState<string>(companyId)

  useEffect(() => {
    setProjectShareCompanyId(companyId)
  }, [selectedCompanyId])

  const returnToCompanyType = () => {
    setCompanyInfo({
      companyId: '',
      companyName: '',
    })
    setProjectShareCompanyId(projectShareCompanyId)
    setDataType('company')
  }

  const getTitle = () => {
    if (dataType === 'company') {
      return <span>综合进度</span>
    }
    return (
      <span>
        <span className={styles.returnIcon} onClick={() => returnToCompanyType()}>
          <LeftOutlined />
        </span>
        <span>项目进度 - {companyInfo.companyName}</span>
      </span>
    )
  }

  return (
    <div className={styles.companyAndProjectTable}>
      <TableSearch width="320px" paddingTop="20px">
        <Spin spinning={loading}>
          <UrlSelect
            style={{ width: '240px', marginLeft: '15px' }}
            showSearch
            defaultData={handleCompanyData}
            titlekey="label"
            valuekey="value"
            value={nowCompanyId}
            onChange={(value: any) => {
              setNowCompanyId(value)
              dataType === 'project' && returnToCompanyType()
              setProjectShareCompanyId(value)
            }}
          />
        </Spin>
      </TableSearch>
      <TitleWindow title={getTitle}>
        {dataType === 'company' && <CompanyTable />}
        {dataType === 'project' && <ProjectTable />}
      </TitleWindow>
    </div>
  )
}

export default CompanyAndProjectTable
