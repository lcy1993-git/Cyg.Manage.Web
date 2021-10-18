import React, { Dispatch, memo, SetStateAction, useEffect } from 'react';

import { getProjectInfo } from '@/services/project-management/all-project';
import { useControllableValue, useRequest } from 'ahooks';
import { Modal, Tabs } from 'antd';
import ProjectBaseInfo from '../project-base-info';

import styles from './index.less';
import ProjectProcessInfo from '../project-process-info/index';
import CheckResultModal from '@/pages/project-management/all-project-new/components/check-result-modal';
const { TabPane } = Tabs;

interface ProjectDetailInfoProps {
  projectId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  isResult?: boolean;
}

const ProjectDetailInfo: React.FC<ProjectDetailInfoProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const { projectId } = props;

  const { data: projectInfo, run } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
  });

  useEffect(() => {
    if (state) {
      run();
    }
  }, [state]);

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
          <TabPane key="process" tab="项目过程">
            <ProjectProcessInfo operateLog={projectInfo?.operateLog ?? []} />
          </TabPane>
          {projectInfo &&
            ((projectInfo.stateInfo.status > 4 && projectInfo.stateInfo.status !== 14) ||
              projectInfo.stateInfo.status === 4) && (
              <TabPane key="result" tab="项目成果">
                <CheckResultModal projectInfo={{ ...projectInfo, projectId: projectInfo?.id }} />
              </TabPane>
            )}
        </Tabs>
      </div>
    </Modal>
  );
};

export default memo(ProjectDetailInfo);
