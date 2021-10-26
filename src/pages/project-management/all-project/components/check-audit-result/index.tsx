import React, { Dispatch, SetStateAction, useState } from 'react';
import EmptyTip from '@/components/empty-tip';
import type { AuditFileInfo } from '../check-result-modal';
import { Tree } from 'antd';
import styles from './index.less';
const { DirectoryTree } = Tree;

interface AuditResultTabProps {
  createEvent: Dispatch<SetStateAction<React.Key[]>>;
  setTabEvent: Dispatch<SetStateAction<string>>;
  auditResultData: any;
  setAuditFileInfo: (fileInfo: AuditFileInfo) => void;
}

const AuditResultTab: React.FC<AuditResultTabProps> = (props) => {
  const { createEvent, setTabEvent, auditResultData, setAuditFileInfo } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[], e: any) => {
    const checkedIds = e.checkedNodes
      .map((item: any) => {
        if (item.category === 1) {
          return item.value;
        }
      })
      .filter(Boolean);

    createEvent(checkedIds);
    setCheckedKeys(checkedKeysValue);
    setTabEvent('audit');
  };

  const onSelect = (info: string, e: any) => {
    if (e.node.category === 2 && e.node.title) {
      // const typeArray = e.node.type.split('.').filter(Boolean);
      // const type = typeArray[typeArray.length - 1];

      setAuditFileInfo({
        extension: e.node.type,
        url: e.node.value,
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
            treeData={auditResultData}
            onSelect={onSelect}
          />
        </div>
      )}
      {auditResultData?.length === 0 && <EmptyTip description="暂无评审成果" />}
    </div>
  );
};

export default AuditResultTab;
