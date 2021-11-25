import { Stop } from '@/pages/login'
import React from 'react'
import styles from './index.less'

interface Props {
  data: Stop
}

const StopServer: React.FC<Props> = (props) => {
  const { data } = props

  return (
    <div className={styles.stopInfoBox}>
      <div className={styles.stopInfoTitle}>关于服务器停机维护的公告</div>
      {data?.content && <div dangerouslySetInnerHTML={{ __html: data?.content }}></div>}
    </div>
  )
}

export default StopServer
