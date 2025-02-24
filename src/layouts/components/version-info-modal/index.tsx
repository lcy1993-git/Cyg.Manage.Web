import { webConfig } from '@/global'
import { Stop } from '@/pages/login'
import StopServer from '@/pages/login/components/stop-server'
import { getVersionUpdate } from '@/services/common'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Spin } from 'antd'
import uuid from 'node-uuid'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './index.less'

interface VersionInfoModalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  stopServerInfo: Stop
}

const VersionInfoModal: React.FC<VersionInfoModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [nowClickVersion, setNowClickVersion] = useState<string>('')
  const [historyVersionModalVisible, setHistoryVersionModalVisible] = useState<boolean>(false)
  const [historyVersionData, setHistoryVersionData] = useState<any[]>([])
  const [versionLoading, setVersionLoading] = useState<boolean>(false)
  //获取当前服务code
  const serverCode: any = localStorage.getItem('serverCode')

  // const finalyServerCode =
  //   window.location.hostname === '171.223.214.154'
  //     ? serverCodeObejct[`${serverCode}:${window.location.port}`]
  //     : serverCode

  const { data: versionInfo, run: getVersionInfoEvent, loading } = useRequest(
    () =>
      getVersionUpdate({
        productCode: '1301726010322214912',
        moduleCode: 'ManageWebV2',
        versionNo: webConfig.version,
        serverCode: serverCode,
      }),
    {
      manual: true,
    }
  )

  useEffect(() => {
    if (state) {
      getVersionInfoEvent()
    }
  }, [state])

  //查看历史版本
  const checkHistoryInfo = async (item: any) => {
    setNowClickVersion(item)
    setHistoryVersionModalVisible(true)
    setVersionLoading(true)
    try {
      const data = await getVersionUpdate({
        productCode: '1301726010322214912',
        moduleCode: 'ManageWebV2',
        versionNo: item,
        serverCode: serverCode,
      })
      setHistoryVersionData(data.data.description)
    } catch (msg) {
      console.error(msg)
    } finally {
      setVersionLoading(false)
    }
  }

  return (
    <>
      <Modal
        maskClosable={false}
        footer=""
        title={`v${nowClickVersion}`}
        visible={historyVersionModalVisible}
        onCancel={() => setHistoryVersionModalVisible(false)}
        width={650}
      >
        <Spin spinning={versionLoading}>
          <div className={styles.versionItem}>
            <div className={styles.versionItemTitle}>【更新说明】</div>
            <div className={styles.versionItemContent}>
              {historyVersionData ? historyVersionData : '无'}
            </div>
          </div>
        </Spin>
      </Modal>
      <Modal
        maskClosable={false}
        title="版本功能更新"
        width={820}
        visible={state as boolean}
        footer=""
        onCancel={() => setState(false)}
      >
        <Spin spinning={loading}>
          <div className={styles.versionItem}>
            <h3>【通知】</h3>
            {props.stopServerInfo?.content ? <StopServer data={props.stopServerInfo} /> : '   -'}
            <div className={styles.versionNumber}>版本：{versionInfo?.data?.versionNo}</div>
            <div className={styles.versionItemTitle}>【更新说明】</div>
            <div className={styles.versionItemContent}>{versionInfo?.data.description}</div>
          </div>

          <div className={styles.versionItem}>
            <div className={styles.versionItemTitle}>【历史版本】</div>

            {versionInfo?.data.branchAvailableVersions ? (
              versionInfo?.data.branchAvailableVersions
                ?.map((item: string) => {
                  return (
                    <div
                      key={uuid.v1()}
                      onClick={() => checkHistoryInfo(item)}
                      className={styles.historyVersion}
                    >
                      {`V${item}`}
                    </div>
                  )
                })
                .slice(0, 5)
            ) : (
              <div className={styles.versionItemContent}>无</div>
            )}
          </div>
        </Spin>
      </Modal>
    </>
  )
}

export default VersionInfoModal
