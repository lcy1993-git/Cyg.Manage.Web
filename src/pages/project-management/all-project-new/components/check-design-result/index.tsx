import React, { Dispatch, SetStateAction, useState } from 'react';
import EmptyTip from '@/components/empty-tip';

import { Tree } from 'antd';
import styles from './index.less';
const { DirectoryTree } = Tree;

interface DesignResultProps {
  createEvent: Dispatch<SetStateAction<React.Key[]>>;
  setTabEvent: Dispatch<SetStateAction<string>>;
  designData: any;
}

const DesignResultTab: React.FC<DesignResultProps> = (props) => {
  const { createEvent, setTabEvent, designData } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    createEvent(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    setTabEvent('design');
  };

  console.log(designData);

  const onSelect = (info: any, e, m) => {
    if(e.node.category === 2) {
      
    }
  };

  const previewEvent = () => {
    console.log(111);
  };

  return (
    <div className={styles.treeTableContent}>
      {designData?.length > 0 && (
        <div className={styles.treeTable}>
          <DirectoryTree
            titleRender={(v) => {
              return v.category === 2 ? (
                <span className={styles.treeTitle} onClick={() => previewEvent()}>
                  {v.title}
                </span>
              ) : (
                <span>{v.title}</span>
              );
            }}
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            defaultExpandAll={true}
            treeData={designData}
            onSelect={onSelect}
          />
        </div>
      )}
      {designData?.length === 0 && <EmptyTip description="暂无设计成果" />}
    </div>
  );
};

export default DesignResultTab;
