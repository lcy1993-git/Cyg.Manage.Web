import CommonTitle from '@/components/common-title'
import PageCommonWrap from '@/components/page-common-wrap'
import { useLayoutStore } from '@/layouts/context'
import {
  handoverCompanyGroup,
  handoverEngineer,
  handoverTask,
} from '@/services/personnel-config/work-handover'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useMount, useUnmount } from 'ahooks'
import { Button, message, Modal, Tabs } from 'antd'
import qs from 'qs'
import React, { useState } from 'react'
import Description from './components/description'
import GroupIdentity from './components/identity'
import ProjectManage from './components/manage'
import MissionTab from './components/mission'
import styles from './index.less'

const { TabPane } = Tabs

const WorkHandover: React.FC = () => {
  const userId = qs.parse(window.location.href.split('?')[1]).id as string
  const name = qs.parse(window.location.href.split('?')[1]).name as string
  const userName = qs.parse(window.location.href.split('?')[1]).userName as string
  const [clickTabKey, setClickTabKey] = useState<string>('manage')
  //部组交接
  const [receiverId, setReceiverId] = useState<string | undefined>(undefined)
  const [receiverName, setReceiverName] = useState<string>('')
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [isFresh, setIsFresh] = useState<boolean>(false)
  const [engineerIds, setEngineerIds] = useState<string[]>([])
  //交接完成显示flag
  const [doneFlag, setDoneFlag] = useState<boolean>(false)

  const [projectIds, setProjectIds] = useState<string[]>([])
  const [currentMissionTabKey, setCurrentMissionTabKey] = useState<string>('prospect')
  const { removeTab } = useLayoutStore()

  const [engineerData, setEngineerData] = useState<any[]>([])

  const { setWorkHandoverFlag } = useLayoutStore()

  useMount(() => {
    setWorkHandoverFlag?.(true)
  })

  useUnmount(() => {
    setWorkHandoverFlag?.(false)
  })

  //获取项目数量
  const projectLen =
    engineerData
      ?.map((item) => {
        return item.projects
      })
      .flat().length ?? 0

  //部组交接
  const identityConfirm = () => {
    Modal.confirm({
      title: '部组身份交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中部组管理员身份交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handIdentityEvent,
    })
  }

  const handIdentityEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员')
      return
    }
    if (groupIds.length === 0) {
      message.warning('请选择需要交接的条目')
      return
    }

    await handoverCompanyGroup({
      companyGroupIds: groupIds,
      userId: userId,
      receiveUserId: receiverId,
    })
    setIsFresh(true)
    setDoneFlag(true)
    setReceiverId(undefined)
    message.success('操作成功')
  }

  //项目管理交接
  const manageConfirm = () => {
    Modal.confirm({
      title: '项目管理交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中工程项目交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handManageEvent,
    })
  }

  const handManageEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员')
      return
    }
    if (engineerIds.length === 0) {
      message.warning('请选择需要交接的条目')
      return
    }

    await handoverEngineer({
      engineerIds: engineerIds,
      userId: userId,
      receiveUserId: receiverId,
    })
    setIsFresh(true)
    setDoneFlag(true)
    setReceiverId(undefined)
    message.success('交接成功')
  }

  //勘察任务交接
  const prospectConfirm = () => {
    Modal.confirm({
      title: '勘察任务交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中工程项目交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handProspectEvent,
    })
  }

  const handProspectEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员')
      return
    }
    if (projectIds.length === 0) {
      message.warning('请选择需要交接的条目')
      return
    }

    await handoverTask({
      projectIds: projectIds,
      userId: userId,
      receiveUserId: receiverId,
      taskCategory: 1,
    })
    setIsFresh(true)
    setDoneFlag(true)
    setReceiverId(undefined)
    message.success('交接成功')
  }
  //设计任务交接
  const designConfirm = () => {
    Modal.confirm({
      title: '设计任务交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中工程项目交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handDesginEvent,
    })
  }

  const handDesginEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员')
      return
    }
    if (projectIds.length === 0) {
      message.warning('请选择需要交接的条目')
      return
    }

    await handoverTask({
      projectIds: projectIds,
      userId: userId,
      receiveUserId: receiverId,
      taskCategory: 2,
    })
    setIsFresh(true)
    setDoneFlag(true)
    setReceiverId(undefined)
    message.success('交接成功')
  }

  const finishEvent = () => {
    removeTab?.(`/jurisdiction-config/work-handover?id=${userId}&name=${name}&userName=${userName}`)
  }

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.handover}>
        <div className={styles.moduleTitle}>
          <CommonTitle>工作交接-{name != 'null' ? name : userName}</CommonTitle>
        </div>
        <div className={styles.moduleHead}>
          <div className={styles.tabTitle}>待交接的方案</div>
          <div className={styles.moduleTabs}>
            <Tabs
              type="card"
              onChange={(key) => {
                setClickTabKey(key)
                setDoneFlag(false)
                setReceiverId(undefined)
                setReceiverName('')
              }}
            >
              <TabPane tab="项目管理" key={'manage'}>
                <ProjectManage
                  userId={userId}
                  recevierId={receiverId}
                  isFresh={isFresh}
                  setIsFresh={setIsFresh}
                  getReceiverId={setReceiverId}
                  setReceiverName={setReceiverName}
                  setEngineerIds={setEngineerIds}
                  getEngineerData={setEngineerData}
                  doneFlag={doneFlag}
                />
              </TabPane>
              <TabPane tab="作业任务" key={'mission'}>
                <MissionTab
                  changeTabKey={setCurrentMissionTabKey}
                  userId={userId}
                  recevierId={receiverId}
                  isFresh={isFresh}
                  setIsFresh={setIsFresh}
                  getReceiverId={setReceiverId}
                  setReceiverName={setReceiverName}
                  getEngineerData={setEngineerData}
                  getProjectIds={setProjectIds}
                  doneFlag={doneFlag}
                  setDoneFlag={setDoneFlag}
                />
              </TabPane>
              <TabPane tab="部组身份" key={'identity'}>
                <GroupIdentity
                  userId={userId}
                  getReceiverId={setReceiverId}
                  getGroupIds={setGroupIds}
                  isFresh={isFresh}
                  setIsFresh={setIsFresh}
                  receiverId={receiverId}
                  setReceiverName={setReceiverName}
                  doneFlag={doneFlag}
                />
              </TabPane>
              <TabPane tab="其他" key="others">
                <Description />
              </TabPane>
            </Tabs>
          </div>
        </div>
        {clickTabKey === 'manage' && (
          <div className={styles.account}>
            <span>总共</span>
            <span className={styles.numberAccount}>
              {engineerData?.length ? engineerData.length : 0}
            </span>
            <span>个工程，</span>
            <span className={styles.numberAccount}>{projectLen}</span>个项目
          </div>
        )}

        <div className={styles.actionBtn}>
          {clickTabKey === 'manage' ? (
            <Button
              type="primary"
              onClick={() => {
                if (engineerIds && engineerIds.length === 0) {
                  message.info('请选择需要交接的条目')
                  return
                }
                if (!receiverId) {
                  message.info('请选择接收人员')
                  return
                }
                manageConfirm()
              }}
            >
              <span>交接</span>
            </Button>
          ) : clickTabKey === 'mission' ? (
            currentMissionTabKey === 'prospect' ? (
              <Button
                type="primary"
                onClick={() => {
                  if (projectIds && projectIds.length === 0) {
                    message.info('请选择需要交接的条目')
                    return
                  }
                  if (!receiverId) {
                    message.info('请选择接收人员')
                    return
                  }
                  prospectConfirm()
                }}
              >
                <span>交接</span>
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  if (projectIds && projectIds.length === 0) {
                    message.info('请选择需要交接的条目')
                    return
                  }
                  if (!receiverId) {
                    message.info('请选择接收人员')
                    return
                  }
                  designConfirm()
                }}
              >
                <span>交接</span>
              </Button>
            )
          ) : clickTabKey === 'identity' ? (
            <Button
              type="primary"
              onClick={() => {
                if (groupIds && groupIds.length === 0) {
                  message.info('请选择需要交接的条目')
                  return
                }
                if (!receiverId) {
                  message.info('请选择接收人员')
                  return
                }
                identityConfirm()
              }}
            >
              <span>交接</span>
            </Button>
          ) : (
            <Button type="primary" onClick={() => finishEvent()}>
              <span>交接完成</span>
            </Button>
          )}
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default WorkHandover
