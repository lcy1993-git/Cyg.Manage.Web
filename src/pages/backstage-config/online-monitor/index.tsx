import PageCommonWrap from '@/components/page-common-wrap'
import {
  exportProjectInfo,
  exportUserStatistics,
  getProjectStatistics,
  getUserStatistics,
} from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import React, { useMemo, useState } from 'react'
import highRight from '../../../assets/icon-image/monitor/highRight.png'
import lowRight from '../../../assets/icon-image/monitor/lowRight.png'
import BarChartItem from './components/bar-chart-item'
import LineChartItem from './components/line-chart-item'
import NumberItem from './components/number-item'
import styles from './index.less'

const OnlineMonitor: React.FC = () => {
  //下载中提示
  const [messageApi, contextHolder] = message.useMessage()
  const key = 'completeDownload'

  //实时时间
  const [realTime, setRealTime] = useState<string>('')
  //项目统计
  const [statisType, setStatisType] = useState<'user' | 'project'>('user')

  //星期
  const [day, setDay] = useState<string>('')

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

  // const [exportLoading, setExportLoading] = useState<boolean>(false)

  //获取系统时间
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDate = () => {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    const time = new Date()
    const year = time.getFullYear() //年
    const month = time.getMonth() + 1 //月
    const day = time.getDate() //日
    const hour = time.getHours() //时
    const m = time.getMinutes() //分
    const minutes = m <= 9 ? '0' + m : m //分
    const s = time.getSeconds() //秒
    const seconds = s <= 9 ? '0' + s : s
    const week = time.getDay()
    // eslint-disable-next-line no-useless-concat
    const t = year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minutes + ':' + seconds
    const toady = '星期' + days[week]
    setDay(toady)
    setRealTime(t)
  }

  //实时时间
  useMemo(() => {
    setInterval(getDate, 1000)
  }, [])

  //导出用户数据
  const exportEvent = async () => {
    messageApi.open({
      key,
      type: 'loading',
      content: '下载中..',
      duration: 0,
    })
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
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: '下载完成!',
        duration: 2,
      })
    }, 1000)
  }

  const projectClass = statisType === 'project' ? styles.projectBg : null

  return (
    <PageCommonWrap noPagePadding noPadding>
      {contextHolder}
      <div className={`${styles.monitorPage} ${projectClass}`}>
        <div className={styles.header}>
          <div className={styles.topLeft}>
            <span className={styles.time}>{realTime}</span>
            <span className={styles.day}>{day}</span>
          </div>
          <div className={styles.topCenter}>
            <span className={styles.title}>工程智慧云-运维监控大屏</span>
          </div>
          <img alt="" src={lowRight} className={styles.imgBox1} />
          <span className={styles.export} onClick={exportEvent}>
            {statisType === 'user' ? '账号信息导出' : '项目信息导出'}
          </span>
          <img alt="" src={highRight} className={styles.imgHover1} />
          <img alt="" src={lowRight} className={styles.imgBox2} />
          {statisType === 'user' && (
            <span className={styles.pageChange} onClick={() => setStatisType('project')}>
              项目统计
            </span>
          )}
          {statisType === 'project' && (
            <span
              className={styles.pageChange}
              onClick={() => {
                setArea('')
                setCurrentClickName('')
                setStatisType('user')
              }}
            >
              用户数据
            </span>
          )}

          <img alt="" src={highRight} className={styles.imgHover2} />
        </div>
        {statisType === 'user' && (
          <>
            <div className={styles.account}>
              <NumberItem
                account={userQtyData?.companyUserTotalQty}
                title="公司用户总数"
                imgSrc="userTotal.png"
              />
              <NumberItem
                account={userQtyData?.companyUserOnLineTotalQty}
                title="在线公司用户总数"
                type="all"
                imgSrc="onlineUser.png"
              />
              <NumberItem
                account={userQtyData?.companyAdminUserTotalQty}
                title="公司管理员总数"
                imgSrc="totalManage.png"
              />
              <NumberItem
                account={userQtyData?.companyAdminUserOnLineTotalQty}
                title="在线公司管理员总数"
                type="admin"
                imgSrc="onlineManage.png"
              />
            </div>
            <div className={styles.moduleChart}>
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
          </>
        )}
        {statisType === 'project' && (
          <>
            <div className={styles.account}>
              <NumberItem
                account={projectQtyData?.engineerQty}
                title="工程总数量（个）"
                imgSrc="engineer.png"
              />
              <NumberItem
                account={projectQtyData?.projectQty}
                title="项目总数量（个）"
                imgSrc="project.png"
              />
            </div>
            <div className={styles.moduleChart}>
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
          </>
        )}
      </div>
    </PageCommonWrap>
  )
}

export default OnlineMonitor
