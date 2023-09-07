import bgSrc from '@/assets/image/index/bg.png'
import PageCommonWrap from '@/components/page-common-wrap'
import { exportProjectInfo, exportUserStatistics } from '@/services/backstage-config/online-monitor'
import { message, Tabs } from 'antd'
import React, { useRef, useState } from 'react'
import styles from './index.less'
import ProjectSituation from './project-situation'

const { TabPane } = Tabs
const ProjectMonitor: React.FC = () => {
  //下载中提示
  const [messageApi] = message.useMessage()
  const key = 'completeDownload'

  //实时时间
  // const [realTime, setRealTime] = useState<string>('')
  //项目统计
  const [statisType] = useState<'user' | 'project'>('user')

  // const [setCurrentKey] = useState<string>('jg')

  const divRef = useRef<HTMLDivElement>(null)

  // const [exportLoading, setExportLoading] = useState<boolean>(false)

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
      const res = await exportProjectInfo({ areaCode: 'area' })
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
  const changeTabEvent = (key: any) => {
    // setCurrentKey(key)
    console.log(key)
  }

  return (
    <PageCommonWrap noPagePadding noPadding>
      <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }} ref={divRef}>
        <div className={styles.title} onClick={() => exportEvent()}>
          项目情况监控-大屏
        </div>
        <div className={styles.chartTable}>
          <Tabs
            className="normalTabs noMargin"
            onChange={(key: string) => changeTabEvent(key)}
            type="card"
          >
            <TabPane tab="竣工项目情况统计" key="jg">
              <ProjectSituation />
            </TabPane>
            <TabPane tab="竣工图完成情况" key="jgt">
              22
            </TabPane>
            <TabPane tab="云平台应用情况" key="ypt">
              33
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default ProjectMonitor
