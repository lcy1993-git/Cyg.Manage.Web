import bgSrc from '@/assets/image/index/bg.png'
import PageCommonWrap from '@/components/page-common-wrap'
import { exportProjectMonitor } from '@/services/project-management/project-monitor'
import { Button, message, Tabs } from 'antd'
import { Moment } from 'moment'
import React, { useRef, useState } from 'react'
import { MonitorProvider } from './context'
import styles from './index.less'
import ProjectComplete from './project-complete'
import ProjectSituation from './project-situation'
import UseSituation from './use-situation'

const { TabPane } = Tabs
const ProjectMonitor: React.FC = () => {
  //下载中提示
  const [messageApi, contextHolder] = message.useMessage()
  const [startDate, setStartDate] = useState<Moment | null | string>(null)
  const [endDate, setEndDate] = useState<Moment | null | string>(null)

  const key = 'completeDownload'

  const divRef = useRef<HTMLDivElement>(null)

  // const [exportLoading, setExportLoading] = useState<boolean>(false)

  //导出用户数据
  const exportEvent = async () => {
    messageApi.open({
      key,
      type: 'loading',
      content: '导出中..',
      duration: 0,
    })

    const res = await exportProjectMonitor({
      startDate: startDate,
      endDate: endDate,
    })
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    })
    let finalyFileName = `项目情况统计信息.xlsx`
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

    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: '导出完成!',
        duration: 2,
      })
    }, 1000)
  }

  return (
    <MonitorProvider
      value={{
        setStartDate,
        setEndDate,
      }}
    >
      <PageCommonWrap noPagePadding noPadding>
        {contextHolder}
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }} ref={divRef}>
          <div className={styles.title}>项目情况监控-大屏</div>
          <div className={styles.exportBtn}>
            <Button type="primary" onClick={() => exportEvent()}>
              导出全部
            </Button>
          </div>
          <div className={styles.chartTable}>
            <Tabs className="normalTabs noMargin" type="card">
              <TabPane tab="竣工项目情况统计" key="jg">
                <ProjectSituation />
              </TabPane>
              <TabPane tab="竣工图完成情况" key="jgt">
                <ProjectComplete />
              </TabPane>
              <TabPane tab="云平台应用情况" key="ypt">
                <UseSituation />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageCommonWrap>
    </MonitorProvider>
  )
}

export default ProjectMonitor
