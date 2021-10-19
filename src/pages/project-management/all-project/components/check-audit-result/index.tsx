import React, { Dispatch, SetStateAction, useState } from 'react';
import EmptyTip from '@/components/empty-tip';
import type { CurrentFileInfo } from '../check-result-modal';
import { Tree } from 'antd';
import styles from './index.less';
const { DirectoryTree } = Tree;

interface AuditResultTabProps {
  createEvent: Dispatch<SetStateAction<React.Key[]>>;
  setTabEvent: Dispatch<SetStateAction<string>>;
  auditResultData: any;
  setCurrentFileInfo: (fileInfo: CurrentFileInfo) => void;
}

const AuditResultTab: React.FC<AuditResultTabProps> = (props) => {
  const { createEvent, setTabEvent, auditResultData, setCurrentFileInfo } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    createEvent(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    setTabEvent('design');
  };

  const onSelect = (info: string, e: any) => {
    if (e.node.category === 2 && e.node.title) {
      const typeArray = e.node.title.split('.');
      const type = typeArray[typeArray.length - 1];

      setCurrentFileInfo({
        type,
        path: info[0],
        title: e.node.title,
      });
    }
  };

  const previewEvent = () => {
    console.log(111);
  };

  return (
    <div className={styles.treeTableContent}>
      {auditResultData?.length > 0 && (
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
      {auditResultData?.length === 0 && <EmptyTip description="暂无评审成果" />}
    </div>
  );
};

export default AuditResultTab;
