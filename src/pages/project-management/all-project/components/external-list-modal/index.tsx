// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import {
  addAllotUser,
  confirmOuterAudit,
  getExternalArrangeStep,
  getReviewFileUrl,
  removeAllotUser,
} from '@/services/project-management/all-project'
import {
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useControllableValue, useRequest, useUpdateEffect } from 'ahooks'
import { Button, Divider, Form, message, Modal, Radio, Spin, Steps, Tooltip } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import SelectAddListForm from '../select-add-list-form'
import ViewAuditFile from './components/viewFile'
import styles from './index.less'

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>
  getCompanyInfo?: (companyInfo: any) => void
  defaultType?: string
  allotCompanyId?: string
  visible: boolean
  projectId: string
  stepData?: any
  refresh?: () => void
}

export interface CurrentFileInfo {
  url: string
  extension: string | undefined
  title: string
}

const { Step } = Steps

const ExternalListModal: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false)
  const [isPassExternalArrange, setIsPassExternalArrange] = useState<boolean>(false)
  const [backTo, setBackTo] = useState<number>(4)
  const [addPersonState, setAddPersonState] = useState<boolean>(false)
  const [addPeople, setAddPeople] = useState<any[]>([])
  const [current, setCurrent] = useState<number>(0)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [backToLoading, setBackToLoading] = useState<boolean>(false)
  // const [requestLoading, setRequestLoading] = useState(false);

  const [newStepData, setNewStepData] = useState<any[]>([])

  const [form] = Form.useForm()
  const { projectId, refresh } = props

  const [currentFileInfo, setCurrentFileInfoErr] = useState<CurrentFileInfo>({
    url: '',
    extension: undefined,
    title: '',
  })

  const setCurrentFileInfo = (info: CurrentFileInfo) => {
    if (info.extension === '.doc' || info.extension === '.xls') {
      message.error(`当前版本暂不支持${info.extension}文件预览，请导出该文件在本地进行预览`)
    } else {
      setCurrentFileInfoErr(info)
    }
  }

  const { data: stepData, run, loading } = useRequest(() => getExternalArrangeStep(projectId))
  const { run: addUser } = useRequest(
    () => addAllotUser({ projectId: projectId, userId: addPeople[0]?.value }),
    {
      manual: true,
      onSuccess: () => {
        run()
      },
    }
  )

  const checkResultEvent = async () => {
    setCurrent(current + 1)
    // await confirmOuterAudit({
    //   projectId: projectId,
    //   parameter: { 是否结束: `${isPassExternalArrange === '1' ? true : false}` },
    // });
    // message.success('外审已通过');
    // setState(false);
    // refresh?.();
  }

  useEffect(() => {
    setNewStepData(stepData)
  }, [stepData])

  useUpdateEffect(() => {
    addUser()
  }, [addPeople])

  const deleteAllotUser = async (id: string) => {
    await removeAllotUser({ projectId: projectId, userAllotId: id })
    message.success('已移除')
    const res = await run()

    if (res && res.length === 0) {
      setState(false)
      refresh?.()
    }
  }

  const deleteConfirm = (id: string) => {
    if (stepData.length > 1) {
      Modal.confirm({
        title: '删除外审人员',
        icon: <ExclamationCircleOutlined />,
        content: '删除该人员后将不再保存该人员的评审结果记录，请确认?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteAllotUser(id),
      })
      return
    }
    message.error('至少保留一位外审人员')
  }

  const prevEvent = () => {
    setCurrent(current - 1)
  }

  const confirmResultEvent = async () => {
    if (isPassExternalArrange) {
      setConfirmLoading(true)
      await confirmOuterAudit({ projectId: projectId, auditPass: true })
      setConfirmLoading(false)
      setState(false)
      message.success('操作成功')
      refresh?.()
      return
    }
    setCurrent(current + 1)
  }

  const reviewCheckEvent = async (id: string) => {
    const res = await getReviewFileUrl({ projectId: projectId, userId: id })

    if (res && isArray(res) && res?.length === 0) {
      message.info('该评审未产生评审成果')
      return
    }
    const url = res[0]?.extend.file.url
    const extension = res[0]?.extend.file.extension
    const name = res[0]?.name
    setCurrentFileInfo({ url: url, extension: extension, title: name })
  }

  const backToEvent = async () => {
    setBackToLoading(true)
    await confirmOuterAudit({ projectId: projectId, auditPass: false, returnToState: backTo })
    setBackToLoading(false)
    setState(false)
    message.success('外审已退回')
    refresh?.()
  }

  const downloadEvent = async (id: string) => {
    const res = await getReviewFileUrl({ projectId: projectId, userId: id })
    if (res && isArray(res) && res?.length === 0) {
      message.info('该评审暂无下载文件')
      return
    }

    const fileName = '评审文件 '
    const url = res[0]?.extend.file.url
    const aEl = document.createElement('a')
    aEl.href = url
    aEl.setAttribute('download', fileName)
    // document.body.appendChild(aEl)
    aEl.click()
    // window.open(url)
    // window.URL.revokeObjectURL(aEl.href)
    // document.body.removeChild(aEl)
  }

  return (
    <>
      <Modal
        title="外审结果"
        visible={state as boolean}
        maskClosable={false}
        width={850}
        onCancel={() => setState(false)}
        footer={
          !newStepData
            ?.map((item: any) => {
              if (item.status === 3) {
                return true
              }
              return false
            })
            .includes(false) && current === 0
            ? [
                <>
                  {addPersonState ? (
                    <Form style={{ width: '100%' }} form={form}>
                      <SelectAddListForm
                        isAdd={true}
                        // projectName={proName}
                        onChange={(people) => setAddPeople(people)}
                      />
                    </Form>
                  ) : (
                    <span className={styles.addClickTitle} onClick={() => setAddPersonState(true)}>
                      添加外审人员
                    </span>
                  )}
                  <Button key="save" type="primary" onClick={() => checkResultEvent()}>
                    确认评审结果
                  </Button>
                </>,
              ]
            : current === 1
            ? [
                <>
                  <Button style={{ margin: '0 8px' }} onClick={() => prevEvent()}>
                    上一步
                  </Button>
                  <Button
                    key="save"
                    type="primary"
                    onClick={() => confirmResultEvent()}
                    loading={confirmLoading}
                  >
                    确认
                  </Button>
                </>,
              ]
            : current === 2
            ? [
                <>
                  <Button style={{ margin: '0 8px' }} onClick={() => prevEvent()}>
                    上一步
                  </Button>
                  <Button
                    key="save"
                    type="primary"
                    onClick={() => backToEvent()}
                    loading={backToLoading}
                  >
                    确认
                  </Button>
                </>,
              ]
            : [
                <>
                  {addPersonState ? (
                    <Form style={{ width: '100%' }} form={form}>
                      <SelectAddListForm
                        isAdd={true}
                        // projectName={proName}
                        onChange={(people) => setAddPeople(people)}
                      />
                    </Form>
                  ) : (
                    <span className={styles.addClickTitle} onClick={() => setAddPersonState(true)}>
                      添加外审人员
                    </span>
                  )}
                  <Button
                    onClick={() => {
                      message.info('当前存在未提交评审结果的外审人员，无法执行此操作')
                    }}
                    key="save"
                    type="default"
                  >
                    确认评审结果
                  </Button>
                </>,
              ]
        }
      >
        <Steps current={current}>
          <Step title="结果查看" icon={<EnvironmentOutlined />} />
          {current > 0 && <Step title="结果确认" icon={<EnvironmentOutlined />} />}
          {current > 1 && <Step title="外审退回" icon={<EnvironmentOutlined />} />}
        </Steps>
        {/* 当前外审人员列表 */}
        {current === 0 && (
          <Spin spinning={loading} tip="数据重新请求中...">
            <div className={styles.peopleList}>
              {newStepData?.map((el: any, idx: any) => (
                <div className={styles.single} key={el.id}>
                  <div>外审 {idx + 1}</div>
                  <div className={styles.exName}>{`${el.userNameText}`}</div>
                  <div>
                    {el.status === 3 ? (
                      <Button
                        style={{ backgroundColor: '#0e7b3b', color: '#fff' }}
                        onClick={() => reviewCheckEvent(el.userId)}
                      >
                        评审结果
                      </Button>
                    ) : (
                      <Button disabled>评审结果</Button>
                    )}
                  </div>
                  <div style={{ marginRight: '12px' }}>
                    <Tooltip title="下载">
                      <DownloadOutlined
                        className={styles.downloadIcon}
                        onClick={() => downloadEvent(el.userId)}
                      />
                    </Tooltip>

                    <Tooltip title="删除">
                      <DeleteOutlined
                        className={styles.deleteIcon}
                        onClick={() => deleteConfirm(el.id)}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Spin>
        )}
        {current === 1 &&
          !newStepData
            ?.map((item: any) => {
              if (item.status === 3) {
                return true
              }
              return false
            })
            .includes(false) && (
            <Form style={{ width: '100%' }} form={form}>
              <Divider />
              <div className={styles.notArrange}>
                <p style={{ textAlign: 'center' }}>外审结果确认</p>
                <Radio.Group
                  onChange={(e) => setIsPassExternalArrange(e.target.value)}
                  value={isPassExternalArrange}
                >
                  <Radio value={false}>外审不通过</Radio>
                  <Radio value={true}>外审通过</Radio>
                </Radio.Group>
              </div>
            </Form>
          )}

        {current === 2 && (
          <Form style={{ width: '100%' }} form={form}>
            <Divider />
            <div className={styles.notArrange}>
              <p style={{ textAlign: 'center' }}>外审退回</p>
              <Radio.Group onChange={(e) => setBackTo(e.target.value)} value={backTo}>
                <Radio value={4}>设计中</Radio>
                {/* <Radio value={11}>造价中</Radio> */}
              </Radio.Group>
            </div>
          </Form>
        )}
      </Modal>
      <Modal
        maskClosable={false}
        className={styles.fileRead}
        title={`预览-${currentFileInfo.title}`}
        width={'80%'}
        centered
        visible={!!currentFileInfo.extension}
        destroyOnClose
        bodyStyle={{ height: '820px', overflowY: 'auto' }}
        footer={null}
        onCancel={() => setCurrentFileInfo({ ...currentFileInfo, extension: undefined })}
      >
        {currentFileInfo.url && <ViewAuditFile params={currentFileInfo} />}
      </Modal>
    </>
  )
}

export default ExternalListModal
