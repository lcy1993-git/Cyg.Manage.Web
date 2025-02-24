import { useGetMinAndMaxTime } from '@/utils/hooks'
import { flatten } from '@/utils/utils'
import React, { useMemo } from 'react'
import { Tooltip } from 'antd'
import uuid from 'node-uuid'
import moment from 'moment'
import ScrollView from 'react-custom-scrollbars'
import styles from './index.less'
import { useRef } from 'react'

import lineBg from '@/assets/image/index/line.png'

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
  const { title = '项目名称', ganttData = [] } = props

  const flattenData = useMemo(() => {
    return flatten<DataSourceItem>(ganttData)
  }, [JSON.stringify(ganttData)])

  const timeData = useGetMinAndMaxTime(flattenData)

  const menuRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
      <div className={styles.ganttComponentMenuItem} key={item.id}>
        <Tooltip placement="topLeft" title={item.name}>
          <span>{item.name}</span>
        </Tooltip>
      </div>
    )
  })

  const ganttBar = flattenData.map((item: any, index) => {
    const diffDays = moment(item.endTime).diff(item.startTime, 'days') + 1
    const leftDiffDays = moment(item.startTime).diff(timeData.monthStartTime, 'days')
    return (
      <div
        className={styles.ganttBarItem}
        key={`${item.id}_bar`}
        style={{
          width: `${diffDays * 30}px`,
          left: `${leftDiffDays * 30}px`,
          top: `${index * 25}px`,
        }}
      >
        <div
          className={styles.ganttBarItemPercent}
          style={{
            width: `${item.progressValue}%`,
            backgroundColor: `${ganttBgColorObject[item.status]}`,
          }}
        >
          {item.progressValue === 0 ? (
            <span className={styles.greenColor}>{item.progressValue}%</span>
          ) : (
            <span>{item.progressValue}%</span>
          )}
        </div>
      </div>
    )
  })

  const menuScrollEvent = (e: any) => {
    if (contentRef && contentRef.current) {
      //@ts-ignore
      contentRef.current.scrollTop(e.scrollTop)
    }
  }

  const ganttContentScrollEvent = (e: any) => {
    if (menuRef && menuRef.current) {
      //@ts-ignore
      menuRef.current.scrollTop(e.scrollTop)
    }
  }

  const scrollBarRenderView = (params: any) => {
    const { ...rest } = params
    const viewStyle = {
      backgroundColor: `#4DA944`,
      borderRadius: '6px',
      cursor: 'pointer',
    }
    return <div className="box" style={{ ...params.style, ...viewStyle }} {...rest} />
  }

  return (
    <div className={styles.ganttComponentView}>
      <div className={styles.ganttComponentButton}>
        <div className={styles.ganttComponentButtonLeft}></div>
        <div className={styles.ganttComponentButtonRight}></div>
      </div>
      <div className={styles.ganttComponentViewContent}>
        <div className={styles.ganttComponentViewLeft}>
          <div className={styles.ganttComponentMenuTitle}>
            <div className={styles.ganttComponentMenuTitleContent}>{title}</div>
          </div>
          <div className={styles.ganttComponentMenuContent}>
            <ScrollView
              onUpdate={menuScrollEvent}
              renderThumbVertical={scrollBarRenderView}
              renderThumbHorizontal={scrollBarRenderView}
              ref={menuRef}
            >
              {menuElement}
            </ScrollView>
          </div>
        </div>
        <div className={styles.ganttComponentViewRight}>
          <ScrollView
            renderThumbHorizontal={scrollBarRenderView}
            renderThumbVertical={scrollBarRenderView}
          >
            <div
              className={styles.ganttComponentCalendarContent}
              style={{ width: `${timeData.days * 30}px` }}
            >
              {calendarElement}
            </div>

            <div
              className={styles.ganttComponentGriddingContent}
              style={{ width: `${timeData.days * 30}px`, backgroundImage: `url(${lineBg})` }}
            >
              <ScrollView
                onUpdate={ganttContentScrollEvent}
                renderThumbVertical={scrollBarRenderView}
                renderThumbHorizontal={scrollBarRenderView}
                ref={contentRef}
              >
                {ganttBar}
              </ScrollView>
            </div>
          </ScrollView>
        </div>
      </div>
    </div>
  )
}

export default GanttComponentView
