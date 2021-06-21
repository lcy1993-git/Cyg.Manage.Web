import React, { Dispatch, SetStateAction, useState } from 'react';
import EmptyTip from '@/components/empty-tip';

import { Tree } from 'antd';

import styles from './index.less';

const { DirectoryTree } = Tree;

interface DesignResultProps {
  createEvent: Dispatch<SetStateAction<React.Key[]>>;
  setTabEvent: Dispatch<SetStateAction<string>>;
  compileResultData: any;
}

const CompileResultTab: React.FC<DesignResultProps> = (props) => {
  const { createEvent, setTabEvent, compileResultData } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    createEvent(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    setTabEvent('compile');
  };

  return (
    <div className={styles.treeTableContent}>
      {compileResultData?.length > 0 && (
        <div className={styles.treeTable}>
          <DirectoryTree
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            defaultExpandAll={true}
            treeData={compileResultData}
          />
        </div>
      )}
      {compileResultData?.length === 0 && <EmptyTip description="该项目暂无项目需求编制成果" />}
    </div>
  );
};

export default CompileResultTab;
