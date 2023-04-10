import AnnularFighure from '@/components/annular-fighure'
import type { StatusParams } from '@/services/project-management/project-all-area-statistics'
import { useSize } from 'ahooks'
import React, { useEffect, useMemo, useRef } from 'react'
import styles from './index.less'

interface statusDataParams {
  statusData: StatusParams
}

const StatisticsBieChart: React.FC<statusDataParams> = ({ statusData = {} }) => {
  const windowContentRef = useRef<HTMLDivElement>(null)
  const contentSize = useSize(windowContentRef)

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
      },
      color: ['#68b660', '#42d5c8', '#0076ff', '#fbd436', '#f2627b', '#8796ff'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: true,
          data: statusData?.items?.map((item: any) => {
            return { value: item.value, name: item.key }
          }),
        },
      ],
    }
  }, [statusData])

  useEffect(() => {
    if (contentSize.width || contentSize.height) {
      const myEvent = new Event('resize')
      window.dispatchEvent(myEvent)
    }
  }, [contentSize])

  return (
    <div className={styles.statisticsBieChart} ref={windowContentRef}>
      <AnnularFighure options={option} />
    </div>
  )
}

export default StatisticsBieChart
