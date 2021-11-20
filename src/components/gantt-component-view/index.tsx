import { useGetMinAndMaxTime } from '@/utils/hooks'
import { flatten } from '@/utils/utils'
import React, { useMemo, useState } from 'react'
import uuid from 'node-uuid'
import moment from 'moment'

import styles from './index.less'
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info'

interface GanttComponentViewProps {
  dayWidth?: number
  itemHeight?: number
  dataSource?: any[]
  title?: string
  ganttData: any
}

interface DataSourceItem {
  name: string
  id: string
  startTime: string
  endTime: string
}

const weekObject = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
}

const ganttBgColorObject = {
  '1': '#A1ACA5',
  '2': '#A8D02C',
  '3': '#2AFE97',
  '4': '#FDFA88',
  '12': '#21CEBE',
  '13': '#0584C7',
  '7': '#26DDFD',
  '16': '#0E7B3B',
}

const GanttComponentView: React.FC<GanttComponentViewProps> = (props) => {
  const [projectId, setProjectId] = useState('')
  const [projectVisible, setProjectVisible] = useState<boolean>(false)

  const { title = '工程项目名称', ganttData = [] } = props

  const flattenData = useMemo(() => {
    return flatten<DataSourceItem>(ganttData)
  }, [JSON.stringify(ganttData)])

  const timeData = useGetMinAndMaxTime(flattenData)

  // 获取到了所有时间中的最大时间和最小时间
  const timeArray = useMemo(() => {
    const { diffMonths, monthStartTime } = timeData
    if (isNaN(diffMonths) || !monthStartTime) {
      return []
    }

    const finalyTimeData = [...new Array(diffMonths).keys()]
      .map((item) => {
        return moment(monthStartTime).add(item, 'month').format('YYYY-MM-DD')
      })
      .map((item) => {
        return {
          startTime: item,
          days: moment(item).daysInMonth(),
          endTime: moment(item).endOf('month').format('YYYY-MM-DD'),
          key: uuid.v1(),
          month: moment(item).format('YYYY-MM'),
        }
      })
    return finalyTimeData
  }, [JSON.stringify(timeData)])

  const calendarElement = timeArray?.map((item) => {
    return (
      <div key={item.key} className={styles.ganttComponentMonth}>
        <div className={styles.ganttComponentMonthContent}>{item.month}</div>
        <div className={styles.ganttComponentMonthDayContent}>
          {[...new Array(item.days).keys()].map((ite) => {
            return (
              <div key={`${item.key}_day${ite}`} className={styles.ganttCalendarItem}>
                {ite + 1}
              </div>
            )
          })}
        </div>
        <div className={styles.ganttComponentMonthDayAndWeekContent}>
          {[...new Array(item.days).keys()].map((ite) => {
            return (
              <div key={`${item.key}_week${ite}`} className={styles.ganttCalendarItem}>
                {weekObject[moment(item.startTime).add(ite, 'days').day()]}
              </div>
            )
          })}
        </div>
      </div>
    )
  })

  const menuElement = flattenData.map((item) => {
    return (
      <div
        className={styles.ganttComponentMenuItem}
        key={item.id}
        onClick={() => {
          setProjectId(item.id)
          setProjectVisible(true)
        }}
      >
        {item.name}
      </div>
    )
  })

  const ganttGriddingBackground = flattenData.map((item) => {
    return (
      <div
        className={styles.ganttComponentGriddingLine}
        key={`${item.id}_line`}
        style={{ width: `${timeData.days * 30}px` }}
      >
        {[...new Array(timeData.days).keys()].map((ite, ind) => {
          return (
            <div
              key={`${item.id}_line_${ind}`}
              className={styles.ganttComponentGriddingLineItem}
            ></div>
          )
        })}
      </div>
    )
  })

  const ganttBar = flattenData.map((item, index) => {
    const diffDays = moment(item.endTime).diff(item.startTime, 'days') + 1
    const leftDiffDays = moment(item.startTime).diff(timeData.monthStartTime, 'days')
    return (
      <div
        className={styles.ganttBarItem}
        key={`${item.id}_bar`}
        style={{
          width: `${diffDays * 30}px`,
          left: `${leftDiffDays * 30}px`,
          top: `${index * 44}px`,
        }}
        onClick={() => {
          setProjectId(item.id)
          setProjectVisible(true)
        }}
      >
        <div
          className={styles.ganttBarItemPercent}
          style={{
            width: `${item.progressValue}%`,
            backgroundColor: `${ganttBgColorObject[item.status]}`,
          }}
        >
          <span>{item.progressValue}%</span>
        </div>
      </div>
    )
  })

  return (
    <div className={styles.ganttComponentView}>
      {projectVisible && (
        <ProjectDetailInfo
          projectId={projectId}
          visible={projectVisible}
          onChange={setProjectVisible}
        />
      )}
      <div className={styles.ganttComponentButton}>
        <div className={styles.ganttComponentButtonLeft}></div>
        <div className={styles.ganttComponentButtonRight}></div>
      </div>
      <div className={styles.ganttComponentViewContent}>
        <div className={styles.ganttComponentViewScroY}>
          <div className={styles.ganttComponentViewLeft}>
            <div className={styles.ganttComponentMenuTitle}>
              <div className={styles.ganttComponentMenuTitleContent}>{title}</div>
            </div>
            <div className={styles.ganttComponentMenuContent}>{menuElement}</div>
          </div>
          <div className={styles.ganttComponentViewRight}>
            <div className={styles.ganttComponentCalendarContent}>{calendarElement}</div>
            <div className={styles.ganttComponentGriddingContent}>
              {ganttGriddingBackground}
              {ganttBar}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GanttComponentView
