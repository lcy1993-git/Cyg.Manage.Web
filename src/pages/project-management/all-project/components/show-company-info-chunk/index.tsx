import { getCompanyName } from '@/services/project-management/all-project'
import { useRequest } from 'ahooks'
import React from 'react'

interface ShowCompanyInfoChunkProps {
  user: string
  onChange: (companyInfo: any) => void
}

const ShowCompanyInfoChunk: React.FC<ShowCompanyInfoChunkProps> = (props) => {
  const { user = '', onChange } = props
  const { data: companyInfo } = useRequest(() => getCompanyName(user), {
    ready: !!user,
    refreshDeps: [user],
    debounceInterval: 500,
    onSuccess: () => {
      onChange(companyInfo)
    },
  })

  return <div>{companyInfo?.text}</div>
}

export default ShowCompanyInfoChunk
