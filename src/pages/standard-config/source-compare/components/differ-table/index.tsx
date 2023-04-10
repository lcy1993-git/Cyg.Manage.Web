import React, { useRef } from 'react'
import GeneralTable from '@/components/general-table'

interface DifferTableParams {
  categoryId: string
}

const DifferTable: React.FC<DifferTableParams> = (props) => {
  const { categoryId } = props
  const tableRef = useRef<HTMLDivElement>(null)
  // const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);

  const columns = [
    {
      title: '条目',
      dataIndex: 'id',
      index: 'id',
      width: 320,
    },
    {
      title: '资源类型',
      dataIndex: 'sourceTypeText',
      index: 'sourceTypeText',
      width: 240,
    },
    {
      title: '差异类别',
      dataIndex: 'email',
      index: 'email',
      width: 240,
    },
    {
      title: '差异名称',
      dataIndex: 'discrepancyName',
      index: 'discrepancyName',
      width: 240,
    },
    {
      title: '差异描述',
      dataIndex: 'discrepancyDescribe',
      index: 'discrepancyDescribe',
      width: 240,
    },
    {
      title: '之前为',
      dataIndex: 'wasBefore',
      index: 'wasBefore',
      width: 240,
    },
    {
      title: '之后为',
      dataIndex: 'wasAfter',
      index: 'wasAfter',
      width: 240,
    },
  ]

  return (
    <GeneralTable
      noPaging
      ref={tableRef}
      columns={columns}
      requestSource="resource"
      url="/SourceCompare/GetCompareList"
      tableTitle="差异明细"
      type="radio"
      postType="query"
      // getSelectData={(data) => setTableSelectRow(data)}
      extractParams={{
        categoryId: categoryId,
      }}
    />
  )
}

export default DifferTable
