import { useRequest } from 'ahooks'
import { Empty, Spin } from 'antd'
import { useEffect } from 'react'
import { getApiByType } from '../../utils/getApiByType'
import BasicTable from '../basic-table'
import DeEasyTable from '../de-easy-table'
import DeSpecialTable from '../de-special-table'
import DeWinterTable from '../de-winter-table'
import DesignTable from '../design-table'
import EasyTable from '../easy-table'
import SafetyTable from '../safety-table'
import SpecialTable from '../special-table'
import WinterTable from '../winter-table'
interface CommonRateTableProps {
  id: string | number
  type: string | number
  demolition: boolean
  rateFileId: string
}

interface ResData {
  name: React.ReactNode
  items: any
}

const CommonRateTable: React.FC<CommonRateTableProps> = ({ id, type, demolition, rateFileId }) => {
  const { data, run, loading } = useRequest<ResData>(getApiByType(type, rateFileId, demolition), {
    manual: true,
  })
  const props = {
    head: data?.name ?? '',
    data: data?.items ?? [],
    type,
  }

  const tableDom = () => {
    if (demolition) {
      switch (String(type)) {
        case '51':
          return <DeWinterTable {...props} />

        case '54':
          return <DeSpecialTable {...props} />

        default:
          return <DeEasyTable {...props} />
      }
    } else {
      switch (String(type)) {
        case '1':
        case '2':
        case '4':
        case '5':
          return <EasyTable {...props} />
        case '3':
          return <SafetyTable {...props} />
        case '51':
          return <WinterTable {...props} />
        // case '52':
        //   return <TemporaryTable {...props} />
        case '53':
          return <BasicTable {...props} />
        case '54':
          return <SpecialTable {...props} />
        case '55':
          return <DesignTable {...props} />
      }
    }
    return <Empty />
  }

  useEffect(() => {
    type && id && run(id)
  }, [type])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Spin spinning={loading}>{tableDom()}</Spin>
    </div>
  )
}

export default CommonRateTable
