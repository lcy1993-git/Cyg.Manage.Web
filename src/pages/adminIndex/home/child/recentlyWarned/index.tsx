import React, { useState } from 'react'
import styles from './index.less'
import { useMount } from 'ahooks'
import moment from 'moment'
import { getAuditPageList } from '@/services/security-audit'

const RecentlyWarned: React.FC = () => {
  const [recentlyWarnedList, setRecentlyWarnedList] = useState<any[]>([])

  const getWarnList = async () => {
    const res = await getAuditPageList({
      pageSize: 100,
      pageIndex: 1,
      levels: [3, 4],
      sort: {
        propertyName: 'executionTime',
        isAsc: false,
      },
    })
    setRecentlyWarnedList(res.items)
  }
  useMount(() => {
    getWarnList().then(() => {})
  })
  return (
    <div className={styles.recentlyWarned}>
      <div className={styles.title}>最近警告</div>
      <div className={styles.warnList}>
        {recentlyWarnedList.map((item) => {
          return (
            <div className={styles.warnItem}>
              <p className={styles.warnText}>{`${item.clientTypeText}${
                item.executionUserName || ''
              }${item.eventTypeText}${item.executionResult}`}</p>
              <p className={styles.warnTime}>{moment(item.executionTime).format('MM-DD HH:mm')}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentlyWarned
