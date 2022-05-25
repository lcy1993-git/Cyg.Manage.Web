import CheckResultModal from '@/pages/project-management/all-project/components/check-result-modal'
import { getProjectInfo } from '@/services/project-management/all-project'
// import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Tabs } from 'antd'
import React, { Dispatch, memo, SetStateAction, useEffect } from 'react'
import ProjectBaseInfo from '../project-base-info'
import ProjectProcessInfo from '../project-process-info/index'
import styles from './index.less'

const { TabPane } = Tabs

interface ProjectDetailInfoProps {
  projectId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  isResult?: boolean
  judgmentMark?: { showEntrustTip: boolean }
}

const ProjectDetailInfo: React.FC<ProjectDetailInfoProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  // const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const { projectId, judgmentMark } = props

  const { data: projectInfo, run } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
  })

  useEffect(() => {
    if (state) {
      run()
    }
  }, [state])

  const processTitle = () => {
    return (
      <span>
        项目过程
        {projectInfo?.sources.includes('被委托') &&
          projectInfo?.identitys.findIndex((item: any) => item.value === 4) > -1 &&
          projectInfo?.stateInfo.status === 14 &&
          judgmentMark?.showEntrustTip && <span className={styles.unread}></span>}
      </span>
    )
  }

  return (
    <Modal
      maskClosable={false}
      title="项目详情"
      width={745}
      destroyOnClose
      bodyStyle={{ padding: '0 0 20px 0', height: 'auto' }}
      visible={state as boolean}
      footer={null}
      onCancel={() => setState(false)}
    >
      <div className={styles.projectDetailInfo}>
        <Tabs className="normalTabs">
          <TabPane key="base" tab="基本信息">
            <ProjectBaseInfo projectInfo={projectInfo} />
          </TabPane>
          {/* <TabPane key="schedule" tab="项目进度">
            <ProjectSchedule />
          </TabPane> */}

          <TabPane
            key="process"
            tab={processTitle()}
            style={{ height: '650px', overflowY: 'auto' }}
          >
            <ProjectProcessInfo operateLog={projectInfo?.operateLog ?? []} />
          </TabPane>
          <TabPane key="amountWork" tab="工程量" style={{ height: '650px', overflowY: 'auto' }}>
            <div className={styles.amountWork}>{projectInfo?.amountWork ?? []} </div>
          </TabPane>
          {projectInfo &&
            ((projectInfo.stateInfo.status > 4 &&
              projectInfo.stateInfo.status !== 14 &&
              projectInfo.stateInfo.status !== 30 &&
              projectInfo.stateInfo.status !== 31) ||
              projectInfo.stateInfo.status === 4) && (
              <TabPane key="result" tab="项目成果">
                <CheckResultModal projectInfo={{ ...projectInfo, projectId: projectInfo?.id }} />
              </TabPane>
            )}
        </Tabs>
      </div>
    </Modal>
  )
}

export default memo(ProjectDetailInfo)
