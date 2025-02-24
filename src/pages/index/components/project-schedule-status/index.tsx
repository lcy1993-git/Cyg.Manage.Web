import React, { useMemo, useState } from 'react'
import ChartBox from '../chart-box'
import ChartTab from '../chart-tab'
import ProjectNatures from '../project-natures'
import StatusBar from '../project-status-bar'
import styles from './index.less'
import { AreaInfo } from '@/services/index'

interface Props {
  componentProps?: string[]
  currentAreaInfo: AreaInfo
}

interface TabData {
  id: string
  name: string
}

const ProjectSchedule: React.FC<Props> = (props) => {
  const { componentProps = ['nature', 'status'], ...rest } = props
  const [activeKey, setActiveKey] = useState<string>()

  const tabData: TabData[] = [
    {
      id: 'nature',
      name: '项目性质',
    },
    {
      id: 'status',
      name: '项目状态',
    },
  ]

  const showTabData = useMemo(() => {
    const filterData = tabData.filter((item) => componentProps.includes(item.id))

    if (filterData && filterData.length > 0) {
      setActiveKey(filterData[0].id)
    }
    return filterData
  }, [JSON.stringify(componentProps)])

  return (
    <ChartBox title="项目情况" titleAlign="left">
      <div className={styles.container}>
        <div className={styles.projectControl}>
          <div className={styles.flex1} />
          <div className={styles.tabs}>
            <ChartTab
              data={showTabData}
              onChange={(v: string) => setActiveKey(v)}
              defaultValue={activeKey}
            />
          </div>
        </div>

        <div className={styles.content}>
          {activeKey === 'nature' ? <ProjectNatures {...rest} /> : null}
          {activeKey === 'status' ? <StatusBar {...rest} /> : null}
        </div>
      </div>
    </ChartBox>
  )
}

export default ProjectSchedule
