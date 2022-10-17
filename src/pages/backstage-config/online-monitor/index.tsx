import PageCommonWrap from '@/components/page-common-wrap'
import { getProjectStatistics, getUserStatistics } from '@/services/backstage-config/online-monitor'
import {
  ExportOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import React, { useMemo, useState } from 'react'
import LineChartItem from './components/line-chart-item'
import NumberItem from './components/number-item'
import styles from './index.less'

const OnlineMonitor: React.FC = () => {
  //实时时间
  const [realTime, setRealTime] = useState<string>('')
  //项目统计
  const [statisType, setStatisType] = useState<'user' | 'project'>('user')
  //获取用户数量
  const { data: userQtyData } = useRequest(() => getUserStatistics(), {})

  //获取系统时间
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTime = () => {
    const time = new Date()
    const year = time.getFullYear() //年
    const month = time.getMonth() + 1 //月
    const day = time.getDate() //日
    const hour = time.getHours() //时
    const m = time.getMinutes() //分
    const minutes = m <= 9 ? '0' + m : m //分
    const s = time.getSeconds() //秒
    const seconds = s <= 9 ? '0' + s : s
    // eslint-disable-next-line no-useless-concat
    const t = year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minutes + ':' + seconds
    setRealTime(t)
  }

  //实时时间
  useMemo(() => {
    setInterval(getTime, 1000)
  }, [])

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.monitorPage}>
        <div className={styles.timeAndAccount}>
          <div className={styles.time}>{realTime}</div>
          {statisType === 'user' && (
            <>
              <div className={styles.accountItem}>
                <NumberItem
                  account={userQtyData?.companyUserTotalQty}
                  size="large"
                  title="公司用户总数"
                />
                <NumberItem
                  account={userQtyData?.companyUserOnLineTotalQty}
                  size="small"
                  title="当前在线"
                />

                <NumberItem
                  account={userQtyData?.companyAdminUserTotalQty}
                  size="large"
                  title="用户账号总数"
                />

                <NumberItem
                  account={userQtyData?.companyAdminUserOnLineTotalQty}
                  size="small"
                  title="当前在线"
                />
              </div>
              <div className={styles.exportItem}>
                <ExportOutlined style={{ color: '#1f9c55', fontSize: '45px' }} />
                <div style={{ fontSize: '18px', color: '#a3a3a3' }}>账号信息导出</div>
              </div>
              <RightCircleOutlined
                title="查看项目统计"
                className={styles.checkItem}
                onClick={() => setStatisType('project')}
              />
            </>
          )}
          {statisType === 'project' && (
            <>
              <div className={styles.projectItem}>
                <NumberItem account={1234456} size="large" title="工程总数量" />

                <NumberItem account={5555} size="small" title="项目总数量" />
              </div>
              <div className={styles.service}>新疆服</div>
              <div className={styles.exportItem}>
                <ExportOutlined style={{ color: '#1f9c55', fontSize: '45px' }} />
                <div style={{ fontSize: '18px', color: '#a3a3a3' }}>项目信息导出</div>
              </div>
              <LeftCircleOutlined
                title="返回用户统计"
                className={styles.checkItem}
                onClick={() => setStatisType('user')}
              />
            </>
          )}
        </div>

        {statisType === 'user' && (
          <>
            <div className={styles.moduleChart}>
              <div className="flex">
                <div className={styles.lineItem}>
                  <LineChartItem data={userQtyData?.clientCategorys[0]} />
                </div>
                <div className={styles.lineItem}>
                  <LineChartItem data={userQtyData?.clientCategorys[1]} />
                </div>
                <div className={styles.lineItem}>
                  <LineChartItem data={userQtyData?.clientCategorys[2]} />
                </div>
              </div>
            </div>
          </>
        )}
        {statisType === 'project' && (
          <>
            <div className={styles.moduleChart}>
              <div className="flex">
                <div className={styles.lineItem}>
                  <LineChartItem />
                </div>
                <div className={styles.lineItem}>
                  <LineChartItem />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageCommonWrap>
  )
}

export default OnlineMonitor
