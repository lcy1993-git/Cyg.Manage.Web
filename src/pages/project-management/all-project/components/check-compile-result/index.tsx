import React, { Dispatch, SetStateAction, useState } from 'react';
import EmptyTip from '@/components/empty-tip';
import { getCompileResultTreeData } from '@/services/project-management/all-project';

import { useRequest } from 'ahooks';
import { Spin, Tree } from 'antd';

import styles from './index.less';

const { DirectoryTree } = Tree;

interface DesignResultProps {
  projectInfo: any;
  mapTreeData: (data: any) => any;
  createEvent: Dispatch<SetStateAction<React.Key[]>>;
  setTabEvent: Dispatch<SetStateAction<string>>;
}

const CompileResultTab: React.FC<DesignResultProps> = (props) => {
  const { projectInfo, mapTreeData, createEvent, setTabEvent } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const { data: treeData = [], loading } = useRequest(
    () => getCompileResultTreeData(projectInfo.projectId),
    { ready: !!projectInfo.projectId, refreshDeps: [projectInfo.projectId] },
  );

  const onCheck = (checkedKeysValue: React.Key[]) => {
    createEvent(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    setTabEvent('compile');
  };

  return (
    <div className={styles.treeTableContent}>
      <Spin spinning={loading}>
        {treeData.length > 0 && (
          <div className={styles.treeTable}>
            <DirectoryTree
              checkable
              onCheck={() => onCheck}
              checkedKeys={checkedKeys}
              defaultExpandAll={true}
              treeData={treeData.map(mapTreeData)}
            />
          </div>
        )}
        {treeData.length === 0 && <EmptyTip description="该项目暂无项目需求编制成果" />}
      </Spin>
    </div>
  );
};

export default CompileResultTab;
