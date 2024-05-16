import excelSvg from '@/assets/image/fileIcon/excel.svg'
import foldSvg from '@/assets/image/fileIcon/fold.svg'
import jpgSvg from '@/assets/image/fileIcon/jpg.svg'
import pdfSvg from '@/assets/image/fileIcon/pdf.svg'
import wordSvg from '@/assets/image/fileIcon/word.svg'
import { FileType } from '@/components/api-file-view/getStrategyComponent'
import UrlFileView from '@/components/url-file-view'
import { baseUrl } from '@/services/common'
import {
  createCompileResult,
  createResult,
  downloadAuditFile,
  downloadFile,
  downloadFileCompile,
  getCompileResultTreeData,
  getResultTreeData,
} from '@/services/project-management/all-project'
import { uploadAuditLog } from '@/utils/utils'
import { FileOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, message, Modal, Spin, Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import CompileResultTab from '../check-compile-result'
import DesignResultTab from '../check-design-result'
import ViewAuditFile from '../external-list-modal/components/viewFile'
import styles from './index.less'

const { TabPane } = Tabs

export interface CurrentFileInfo {
  path: string
  type: FileType | undefined
  title: string
}
export interface AuditFileInfo {
  id: string
  extension: string | undefined
  title: string
}

interface CheckResultModalProps {
  visible?: boolean
  onChange?: Dispatch<SetStateAction<boolean>>
  changeFinishEvent?: () => void
  projectInfo?: any
}

const CheckResultModal: React.FC<CheckResultModalProps> = (props) => {
  // const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [auditKeys] = useState<React.Key[]>([])
  const [compileKeys, setCompileKeys] = useState<React.Key[]>([])
  const [currentTab, setCurrentTab] = useState<string>('design')
  const { projectInfo } = props
  const [requestLoading, setRequestLoading] = useState(false)

  const [currentFileInfo, setCurrentFileInfoErr] = useState<CurrentFileInfo>({
    path: '',
    type: undefined,
    title: '',
  })
  const [auditFileInfo, setAuditFileInfoErr] = useState<AuditFileInfo>({
    id: '',
    extension: undefined,
    title: '',
  })

  const setCurrentFileInfo = (info: CurrentFileInfo) => {
    if (info.type === 'doc' || info.type === 'xls' || info.type === 'xml') {
      message.error(`当前版本暂不支持${info.type}文件预览，请导出该文件在本地进行预览`)
    } else {
      setCurrentFileInfoErr(info)
    }
  }

  const setAuditFileInfo = (info: AuditFileInfo) => {
    if (info.extension === '.doc' || info.extension === '.xls' || info.extension === 'xml') {
      message.error(`当前版本暂不支持${info.extension}文件预览，请导出该文件在本地进行预览`)
    } else {
      setAuditFileInfoErr(info)
    }
  }

  const { data: resultData, loading } = useRequest(() => getResultTreeData(projectInfo.projectId))

  const { data: compileResultData, loading: cloading } = useRequest(() =>
    getCompileResultTreeData(projectInfo.projectId)
  )

  // const { data: auditResultData, run: getAuditTree } = useRequest(getAuditResultData, {
  //   manual: true,
  // })

  // const closeEvent = () => {
  //   setState(false);
  //   // changeFinishEvent?.();
  // };

  const mapTreeData = (data: any) => {
    return {
      title: data.name,
      value: data.path,
      key: data.path,
      category: data.category,
      icon:
        data.category === 1 ? (
          <img src={foldSvg} className={styles.svg} alt="" />
        ) : data.name.endsWith('jpg') || data.name.endsWith('dwg') ? (
          <img src={jpgSvg} className={styles.svg} alt="" />
        ) : data.name.endsWith('docx') || data.name.endsWith('doc') ? (
          <img src={wordSvg} className={styles.svg} alt="" />
        ) : data.name.endsWith('pdf') ? (
          <img src={pdfSvg} className={styles.svg} alt="" />
        ) : data.name.endsWith('xlsx') ? (
          <img src={excelSvg} className={styles.svg} alt="" />
        ) : (
          <FileOutlined />
        ),

      children: data.children ? data.children.map(mapTreeData) : [],
    }
  }

  // const refresh = () => {
  //   message.success('刷新成功')
  //   if (currentTab === 'design') {
  //     run(projectInfo.projectId)
  //   } else {
  //     getCompileTree(projectInfo.projectId)
  //   }
  // }

  const createFile = async () => {
    if (currentTab === 'design') {
      if (checkedKeys.length === 0) {
        message.error('请至少选择一个文件进行下载')
        return
      }

      try {
        setRequestLoading(true)
        const path = await createResult({
          projectId: projectInfo.projectId,
          paths: checkedKeys,
        })
        const res = await downloadFile({
          path: path,
        })

        let blob = new Blob([res], {
          type: 'application/zip',
        })
        let finalyFileName = `${projectInfo.name}[设计成果].zip`
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
          document.body.removeChild(link)
        }
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '成功',
            auditLevel: 2,
            serviceAdress: `${baseUrl.upload}/Download/GetProjectOutcomeFile`,
          },
        ])
      } catch (error) {
        message.error({ error })
      } finally {
        setRequestLoading(false)
      }
    } else if (currentTab === 'compile') {
      if (compileKeys.length === 0) {
        message.error('请至少选择一个文件进行下载')
        return
      }
      try {
        setRequestLoading(true)
        const path = await createCompileResult({
          projectId: projectInfo.projectId,
          paths: compileKeys,
        })
        const res = await downloadFileCompile({
          path: path,
        })

        let blob = new Blob([res], {
          type: 'application/zip',
        })
        let finalyFileName = `${projectInfo.name}[需求编制成果].zip`
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
          document.body.removeChild(link)
        }
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '成功',
            auditLevel: 2,
            serviceAdress: `${baseUrl.upload}/Download/GetProjectCompilationResultFile`,
          },
        ])
      } catch (error) {
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '失败',
            auditLevel: 2,
            serviceAdress: `${baseUrl.upload}/Download/GetProjectCompilationResultFile`,
          },
        ])
      } finally {
        setRequestLoading(false)
      }
    } else {
      if (auditKeys.length === 0) {
        message.error('请至少选择一个文件进行下载')
        return
      }
      try {
        setRequestLoading(true)
        // const path = await createCompileResult({
        //   projectId: projectInfo.projectId,
        //   paths: compileKeys,
        // });
        const res = await downloadAuditFile(projectInfo.projectId, auditKeys)

        let blob = new Blob([res], {
          type: 'application/zip',
        })
        let finalyFileName = `${projectInfo.name}[评审成果].zip`
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
          document.body.removeChild(link)
        }
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '成功',
            auditLevel: 2,
            serviceAdress: `${baseUrl.review}/ReviewOpinionFile/DownReivewFileTree`,
          },
        ])
      } catch (error) {
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '失败',
            auditLevel: 2,
            serviceAdress: `${baseUrl.review}/ReviewOpinionFile/DownReivewFileTree`,
          },
        ])
      } finally {
        setRequestLoading(false)
      }
    }

    message.success('生成成功')
  }

  // useEffect(() => {
  //   if (currentTab === 'design') {
  //     run(projectInfo.projectId)
  //   }
  //   if (currentTab === 'compile') {
  //     getCompileTree(projectInfo.projectId)
  //   }
  //   // if (currentTab === 'audit') {
  //   //   getAuditTree(projectInfo.projectId)
  //   // }
  // }, [currentTab])

  // const mapAuditTree = (datas: any) => {
  //   return {
  //     title: datas.key,
  //     icon: <img src={foldSvg} className={styles.svg} />,
  //     value: datas.value.id,
  //     category: 1,
  //     key: datas.value.id,
  //     children: [
  //       {
  //         title: datas.value.extend.file.name,
  //         value: datas.value.extend.file.id,
  //         key: datas.value.extend.file.id,
  //         type: datas.value.extend.file.extension,
  //         icon:
  //           datas.value.extend.file.extension === '.doc' ||
  //           datas.value.extend.file.extension === '.docx' ? (
  //             <img src={wordSvg} className={styles.svg} />
  //           ) : (
  //             <img src={excelSvg} className={styles.svg} />
  //           ),
  //         category: 2,
  //       },
  //     ],
  //   }
  // }

  // const handleAuditData = useMemo(() => {
  //   if (auditResultData) {
  //     return auditResultData.map((item) => {
  //       return {
  //         title: item.name,
  //         key: item.name,
  //         category: 1,
  //         icon: <img src={foldSvg} className={styles.svg} />,
  //         children: item.datas.map(mapAuditTree),
  //       }
  //     })
  //   }
  //   return
  // }, [auditResultData])

  return (
    <>
      <Spin spinning={requestLoading} tip="正在生成...">
        <div className={`${styles.resultButton} flex`}>
          <div className="flex2" style={{ paddingLeft: '20px' }}>
            <span className={styles.titleIcon}></span>
            <span className={styles.helpTitle}>项目名称: </span>
            <span className={styles.projectTitle}>{projectInfo?.name}</span>
          </div>
          <div className="flex1">
            <span className={styles.titleIcon}></span>
            <span className={styles.helpTitle}>当前阶段: </span>
            <span>{projectInfo?.stageText}</span>
          </div>

          <div className={styles.resultButtonContent} style={{ paddingRight: '20px' }}>
            <Button type="primary" onClick={() => createFile()} loading={requestLoading}>
              导出
            </Button>
          </div>
        </div>
        <div className={styles.resultTable}>
          <Tabs className="normalTabs" onChange={(key: string) => setCurrentTab(key)} type="card">
            <TabPane key="design" tab="设计成果">
              <Spin spinning={loading} tip="正在获取成果...">
                <DesignResultTab
                  designData={resultData?.map(mapTreeData)}
                  createEvent={setCheckedKeys}
                  setTabEvent={setCurrentTab}
                  setCurrentFileInfo={setCurrentFileInfo}
                />
              </Spin>
            </TabPane>
            <TabPane key="compile" tab="项目需求编制成果">
              <Spin spinning={cloading} tip="正在获取成果...">
                <CompileResultTab
                  compileResultData={compileResultData?.map(mapTreeData)}
                  createEvent={setCompileKeys}
                  setTabEvent={setCurrentTab}
                  setCurrentFileInfo={setCurrentFileInfo}
                />
              </Spin>
            </TabPane>
            {/* <TabPane key="audit" tab="评审成果">
              <AuditResultTab
                auditResultData={handleAuditData}
                createEvent={setAuditKeys}
                setTabEvent={setCurrentTab}
                setAuditFileInfo={setAuditFileInfo}
                projectInfo={projectInfo}
              />
            </TabPane> */}
          </Tabs>
        </div>
      </Spin>

      <Modal
        maskClosable={false}
        className={styles.fileRead}
        title={`预览-${currentFileInfo.title}`}
        width={'98%'}
        style={{ top: 20 }}
        visible={!!currentFileInfo.type}
        destroyOnClose
        footer={null}
        onCancel={() => setCurrentFileInfo({ ...currentFileInfo, type: undefined })}
      >
        {currentFileInfo.path && (
          <UrlFileView params={{ path: currentFileInfo.path }} fileType={currentFileInfo.type!} />
        )}
      </Modal>
      <Modal
        maskClosable={false}
        className={styles.fileRead}
        title={`预览-${auditFileInfo.title}`}
        width={'98%'}
        style={{ top: 20 }}
        visible={!!auditFileInfo.extension}
        destroyOnClose
        footer={null}
        onCancel={() => setAuditFileInfo({ ...auditFileInfo, extension: undefined })}
      >
        {auditFileInfo.id && <ViewAuditFile params={auditFileInfo} />}
      </Modal>
    </>
  )
}

export default CheckResultModal
