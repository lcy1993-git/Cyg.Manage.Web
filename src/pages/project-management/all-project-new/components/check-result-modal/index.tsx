import {
  createResult,
  downloadFile,
  getResultTreeData,
  createCompileResult,
  downloadFileComplie,
  getCompileResultTreeData,
} from '@/services/project-management/all-project';
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useControllableValue, useRequest } from 'ahooks';
import { Button, Modal, Spin, message, Tabs } from 'antd';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import CompileResultTab from '../check-compile-result';
import DesignResultTab from '../check-design-result';
import pdfSvg from '@/assets/image/fileIcon/pdf.svg';
import foldSvg from '@/assets/image/fileIcon/fold.svg';
import wordSvg from '@/assets/image/fileIcon/word.svg';
import excelSvg from '@/assets/image/fileIcon/excel.svg';
import jpgSvg from '@/assets/image/fileIcon/jpg.svg';

import styles from './index.less';
import UrlFileView from '@/components/url-file-view';
import { FileType } from '@/components/api-file-view/getStrategyComponent';

const { TabPane } = Tabs;

export interface CurrentFileInfo {
  path: string;
  type: FileType | undefined;
  title: string;
}

interface CheckResultModalProps {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: () => void;
  projectInfo?: any;
  isResult?: boolean;
}

const CheckResultModal: React.FC<CheckResultModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [compileKeys, setCompileKeys] = useState<React.Key[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('design');
  const { projectInfo, isResult = false } = props;
  const [requestLoading, setRequestLoading] = useState(false);

  const [currentFileInfo, setCurrentFileInfoErr] = useState<CurrentFileInfo>({path: "", type: undefined, title: ""})

  const setCurrentFileInfo = (info: CurrentFileInfo) => {
    if(info.type === 'doc' || info.type === 'xls'){
      message.error(`当前版本暂不支持${info.type}文件预览，请导出该文件再本地进行预览`);
    }else{
      setCurrentFileInfoErr(info)
    }
  }

  const { data: resultData, run, loading } = useRequest(getResultTreeData, {
    manual: true,
  });

  const { data: compileResultData, run: getCompileTree } = useRequest(getCompileResultTreeData, {
    manual: true,
  });

  const closeEvent = () => {
    setState(false);
    // changeFinishEvent?.();
  };

  const mapTreeData = (data: any) => {
    return {
      title: data.name,
      value: data.path,
      key: data.path,
      category: data.category,
      icon:
        data.category === 1 ? (
          <img src={foldSvg} className={styles.svg} />
        ) : data.name.endsWith('jpg') || data.name.endsWith('dwg') ? (
          <img src={jpgSvg} className={styles.svg} />
        ) : data.name.endsWith('docx') || data.name.endsWith('doc') ? (
          <img src={wordSvg} className={styles.svg} />
        ) : data.name.endsWith('pdf') ? (
          <img src={pdfSvg} className={styles.svg} />
        ) : data.name.endsWith('xlsx') ? (
          <img src={excelSvg} className={styles.svg} />
        ) : (
          <FileOutlined />
        ),

      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  const refresh = () => {
    message.success('刷新成功');
    if (currentTab === 'design') {
      run(projectInfo.projectId);
    } else {
      getCompileTree(projectInfo.projectId);
    }
  };

  const createFile = async () => {
    if (currentTab === 'design') {
      if (checkedKeys.length === 0) {
        message.error('请至少选择一个文件进行下载');
        return;
      }

      try {
        setRequestLoading(true);
        const path = await createResult({
          projectId: projectInfo.projectId,
          paths: checkedKeys,
        });
        const res = await downloadFile({
          path: path,
        });

        let blob = new Blob([res], {
          type: 'application/zip',
        });
        let finalyFileName = `导出成果.zip`;
        // for IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
        } else {
          // for Non-IE
          let objectUrl = URL.createObjectURL(blob);
          let link = document.createElement('a');
          link.href = objectUrl;
          link.setAttribute('download', finalyFileName);
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      } catch (error) {
        message.error({ error });
      } finally {
        setRequestLoading(false);
      }
    } else {
      if (compileKeys.length === 0) {
        message.error('请至少选择一个文件进行下载');
        return;
      }
      try {
        setRequestLoading(true);
        const path = await createCompileResult({
          projectId: projectInfo.projectId,
          paths: compileKeys,
        });
        const res = await downloadFileComplie({
          path: path,
        });

        let blob = new Blob([res], {
          type: 'application/zip',
        });
        let finalyFileName = `导出成果.zip`;
        // for IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
        } else {
          // for Non-IE
          let objectUrl = URL.createObjectURL(blob);
          let link = document.createElement('a');
          link.href = objectUrl;
          link.setAttribute('download', finalyFileName);
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      } catch (error) {
      } finally {
        setRequestLoading(false);
      }
    }

    message.success('生成成功');
  };

  useEffect(() => {
    if (state) {
      if (currentTab === 'design') {
        run(projectInfo.projectId);
      }
      getCompileTree(projectInfo.projectId);
    }
  }, [state, currentTab]);

  return (
    <>
      {isResult && (
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
              <Button className="mr7" onClick={() => refresh()}>
                刷新
              </Button>
              <Button type="primary" onClick={() => createFile()} loading={requestLoading}>
                生成
              </Button>
            </div>
          </div>
          <div className={styles.resultTable}>
            <Tabs className="normalTabs" onChange={(key: string) => setCurrentTab(key)} type="card">
              <TabPane key="design" tab="设计成果">
                <DesignResultTab
                  designData={resultData?.map(mapTreeData)}
                  createEvent={setCheckedKeys}
                  setTabEvent={setCurrentTab}
                  setCurrentFileInfo={setCurrentFileInfo}
                />
              </TabPane>
              <TabPane key="compile" tab="项目需求编制成果">
                <CompileResultTab
                  compileResultData={compileResultData?.map(mapTreeData)}
                  createEvent={setCompileKeys}
                  setTabEvent={setCurrentTab}
                  setCurrentFileInfo={setCurrentFileInfo}
                />
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      )}
      {!isResult && (
        <Modal
          maskClosable={false}
          title="查看成果"
          width={750}
          visible={state as boolean}
          destroyOnClose
          footer={null}
          onCancel={() => closeEvent()}
        >
          <Spin spinning={requestLoading} tip="正在生成...">
            <div className={`${styles.resultButton} flex`}>
              <div className="flex2">
                <span className={styles.titleIcon}></span>
                <span className={styles.helpTitle}>项目名称: </span>
                <span className={styles.projectTitle}>{projectInfo.projectName}</span>
              </div>
              <div className="flex1">
                <span className={styles.titleIcon}></span>
                <span className={styles.helpTitle}>当前阶段: </span>
                <span>{projectInfo.projectStage}</span>
              </div>
              <div className={styles.resultButtonContent}>
                <Button className="mr7" onClick={() => refresh()}>
                  刷新
                </Button>
                <Button type="primary" onClick={() => createFile()} loading={requestLoading}>
                  导出
                </Button>
              </div>
            </div>
            <div className={styles.resultTable}>
              <Tabs
                className="normalTabs"
                onChange={(key: string) => setCurrentTab(key)}
                type="card"
              >
                <TabPane key="design" tab="设计成果">
                  <Spin spinning={loading}>
                    <DesignResultTab
                      designData={resultData?.map(mapTreeData)}
                      createEvent={setCheckedKeys}
                      setTabEvent={setCurrentTab}
                      setCurrentFileInfo={setCurrentFileInfo}
                    />
                  </Spin>
                </TabPane>
                <TabPane key="compile" tab="项目需求编制成果">
                  <Spin spinning={loading}>
                    <CompileResultTab
                      compileResultData={compileResultData?.map(mapTreeData)}
                      createEvent={setCompileKeys}
                      setTabEvent={setCurrentTab}
                      setCurrentFileInfo={setCurrentFileInfo}
                    />
                  </Spin>
                </TabPane>
              </Tabs>
            </div>
          </Spin>
        </Modal>
      )}
      <Modal
        maskClosable={false}
        className={styles.fileRead}
        title={`预览-${currentFileInfo.title}`}
        width={"99%"}
        style={{top: 20}}
        visible={!!currentFileInfo.type}
        destroyOnClose
        footer={null}
        onCancel={() => setCurrentFileInfo({...currentFileInfo, type: undefined})}
      >
        { currentFileInfo.path && <UrlFileView params={{path: currentFileInfo.path}} fileType={currentFileInfo.type!} />}
      </Modal>
    </>
  );
};

export default CheckResultModal;
