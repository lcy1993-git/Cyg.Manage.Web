import {
  createResult,
  downloadFile,
  getResultTreeData,
  createCompileResult,
  downloadFileComplie,
  getCompileResultTreeData,
} from '@/services/project-management/all-project';
import { useControllableValue, useRequest } from 'ahooks';
import { Button, Modal, Spin, message, Tabs } from 'antd';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import DesignResultTab from '../check-design-result';

import styles from './index.less';

const { TabPane } = Tabs;

interface CheckResultModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  projectInfo: any;
}

const CheckResultModal: React.FC<CheckResultModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('design');
  const { changeFinishEvent, projectInfo } = props;
  const [requestLoading, setRequestLoading] = useState(false);

  const { run } = useRequest(() => getResultTreeData(projectInfo.projectId), {
    ready: !!projectInfo.projectId,
    refreshDeps: [projectInfo.projectId],
  });

  const { run: getCompileTree } = useRequest(
    () => getCompileResultTreeData(projectInfo.projectId),
    {
      ready: !!projectInfo.projectId,
      refreshDeps: [projectInfo.projectId],
    },
  );

  const closeEvent = () => {
    setState(false);
    changeFinishEvent?.();
  };

  const mapTreeData = (data: any) => {
    return {
      title: data.name,
      value: data.path,
      key: data.path,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  const refresh = () => {
    message.success('刷新成功');
    if (currentTab === 'design') {
      run();
    } else {
      getCompileTree();
    }
  };

  const createFile = async () => {
    if (checkedKeys.length === 0) {
      message.error('请至少选择一个文件进行下载');
      return;
    }

    if (currentTab === 'design') {
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
        console.log(error);
      } finally {
        setRequestLoading(false);
      }
    }

    message.success('生成成功');
  };

  useEffect(() => {
    if (state) {
      run();
    }
  }, [state]);

  return (
    <Modal
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
              生成
            </Button>
          </div>
        </div>
        <div>
          <Tabs className="normalTabs" onTabClick={(key: string) => setCurrentTab(key)}>
            <TabPane key="design" tab="设计成果">
              <DesignResultTab
                mapTreeData={mapTreeData}
                projectInfo={projectInfo}
                createEvent={setCheckedKeys}
                setTabEvent={setCurrentTab}
              />
            </TabPane>
            <TabPane key="compile" tab="项目需求编制成果">
              222
            </TabPane>
          </Tabs>
        </div>
        {/* <div className={styles.treeTableContent}>
                      <Spin spinning={loading}>
                          {
                              treeData.length > 0 &&
                              <div className={styles.treeTable}>
                                  <DirectoryTree
                                      checkable
                                      onCheck={onCheck}
                                      checkedKeys={checkedKeys}
                                      defaultExpandAll={true}
                                      treeData={treeData.map(mapTreeData)}
                                  />
                              </div>
                          }
                          {
                              treeData.length === 0 &&
                              <EmptyTip description="暂无成果" />
                          }
                      </Spin>
                  </div> */}
      </Spin>
    </Modal>
  );
};

export default CheckResultModal;
