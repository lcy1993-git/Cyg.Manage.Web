import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { useMount } from 'ahooks'
import moment from 'moment'

const RecentlyWarned: React.FC = () => {
  const [recentlyWarnedList, setRecentlyWarnedList] = useState<any[]>([])
  useMount(() => {
    let arr = Array.from({ length: 50 }, (item, index) => {
      return {
        id: index,
        text: `警告内容警告内容警告内容警告内容容警`,
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
    setRecentlyWarnedList(arr)
    console.log(arr)
  })
  return (
    <div className={styles.recentlyWarned}>
      <div className={styles.title}>最近警告</div>
      <div className={styles.warnList}>
        {recentlyWarnedList.map((item) => {
          return (
            <div className={styles.warnItem}>
              <p className={styles.warnText}>{item.text}</p>
              <p className={styles.warnTime}>{item.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentlyWarned
