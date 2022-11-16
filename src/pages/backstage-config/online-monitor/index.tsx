import PageCommonWrap from '@/components/page-common-wrap'
import {
  exportProjectInfo,
  exportUserStatistics,
  getProjectStatistics,
  getUserStatistics,
} from '@/services/backstage-config/online-monitor'
import { ExportOutlined, LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { message, Spin } from 'antd'
import React, { useMemo, useState } from 'react'
import BarChartItem from './components/bar-chart-item'
import LineChartItem from './components/line-chart-item'
import NumberItem from './components/number-item'
import styles from './index.less'

const OnlineMonitor: React.FC = () => {
  //实时时间
  const [realTime, setRealTime] = useState<string>('')
  //项目统计
  const [statisType, setStatisType] = useState<'user' | 'project'>('user')
  //获取用户数量
  const { data: userQtyData } = useRequest(() => getUserStatistics(), {
    pollingInterval: 8000,
  })

  const [area, setArea] = useState<string>('')
  //获取项目数量
  const { data: projectQtyData } = useRequest(() => getProjectStatistics({ areaCode: area }), {
    pollingInterval: 8000,
    refreshDeps: [area],
  })

  const [currentClickName, setCurrentClickName] = useState<string>('')

  const [exportLoading, setExportLoading] = useState<boolean>(false)

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

  //导出用户数据
  const exportEvent = async () => {
    setExportLoading(true)
    if (statisType === 'user') {
      const res = await exportUserStatistics()
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `账号统计信息.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    } else {
      const res = await exportProjectInfo({ areaCode: area })
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `项目统计信息.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    }

    setExportLoading(false)
    message.success('导出成功')
  }

  return (
    <PageCommonWrap noPadding={true}>
      <Spin spinning={exportLoading} tip="导出中...">
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
                    title="在线公司用户总数"
                    type="all"
                  />

                  <NumberItem
                    account={userQtyData?.companyAdminUserTotalQty}
                    size="large"
                    title="公司管理员总数"
                  />

                  <NumberItem
                    account={userQtyData?.companyAdminUserOnLineTotalQty}
                    size="small"
                    title="在线公司管理员总数"
                    type="admin"
                  />
                </div>
                <div className={styles.exportItem}>
                  <ExportOutlined
                    style={{ color: '#1f9c55', fontSize: '45px' }}
                    onClick={() => exportEvent()}
                  />
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
                  <NumberItem
                    account={projectQtyData?.engineerQty}
                    size="large"
                    title="工程总数量"
                  />

                  <NumberItem
                    account={projectQtyData?.projectQty}
                    size="small"
                    title="项目总数量"
                  />
                </div>
                {/* <div className={styles.service}>新疆服</div> */}
                <div className={styles.exportItem}>
                  <ExportOutlined
                    style={{ color: '#1f9c55', fontSize: '45px' }}
                    onClick={() => exportEvent()}
                  />
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
                    <LineChartItem data={userQtyData?.clientCategorys[0]} type="manage" />
                  </div>
                  <div className={styles.lineItem}>
                    <LineChartItem data={userQtyData?.clientCategorys[1]} type="survey" />
                  </div>
                  <div className={styles.lineItem}>
                    <LineChartItem data={userQtyData?.clientCategorys[2]} type="design" />
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
                    <BarChartItem
                      setArea={setArea}
                      area={area}
                      type="area"
                      setShowName={setCurrentClickName}
                    />
                  </div>
                  <div className={styles.lineItem}>
                    <BarChartItem area={area} type="state" showName={currentClickName} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Spin>
    </PageCommonWrap>
  )
}

export default OnlineMonitor
