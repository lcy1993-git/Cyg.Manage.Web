import React, { Dispatch, SetStateAction, useState } from 'react'
import EmptyTip from '@/components/empty-tip'
import type { AuditFileInfo } from '../check-result-modal'
import { Button, Tree } from 'antd'
import styles from './index.less'
import ReviewDetailsModal from './components/check-review-details'
const { DirectoryTree } = Tree

interface AuditResultTabProps {
  createEvent: Dispatch<SetStateAction<React.Key[]>>
  setTabEvent: Dispatch<SetStateAction<string>>
  auditResultData: any
  setAuditFileInfo: (fileInfo: AuditFileInfo) => void
  projectInfo?: any
}

const AuditResultTab: React.FC<AuditResultTabProps> = (props) => {
  const { createEvent, setTabEvent, auditResultData, setAuditFileInfo, projectInfo } = props
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [reviewDetailVisible, setReviewDetailVisible] = useState<boolean>(false)

  const onCheck = (checkedKeysValue: React.Key[], e: any) => {
    const checkedIds = e.checkedNodes
      // eslint-disable-next-line array-callback-return
      .map((item: any) => {
        if (item.category === 1) {
          return item.value
        }
      })
      .filter(Boolean)

    createEvent(checkedIds)
    setCheckedKeys(checkedKeysValue)
    setTabEvent('audit')
  }

  const onSelect = (info: string, e: any) => {
    if (e.node.category === 2 && e.node.title) {
      // const typeArray = e.node.type.split('.').filter(Boolean);
      // const type = typeArray[typeArray.length - 1];

      setAuditFileInfo({
        extension: e.node.type,
        id: e.node.value,
        title: e.node.title,
      })
    }
  }

  const previewEvent = () => {
    // console.log(111)
  }

  const checkDetailEvent = () => {
    setReviewDetailVisible(true)
  }

  return (
    <div className={styles.treeTableContent}>
      <Button onClick={() => checkDetailEvent()} className="ml7">
        查看评审详情
      </Button>
      {auditResultData?.length > 0 && (
        <div className={styles.treeTable}>
          <DirectoryTree
            titleRender={(v: any) => {
              return v.category === 2 ? (
                <span className={styles.treeTitle} onClick={() => previewEvent()}>
                  {v.title}
                </span>
              ) : (
                <span>{v.title}</span>
              )
            }}
            checkable // @ts-ignore
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            defaultExpandAll={true}
            treeData={auditResultData} // @ts-ignore
            onSelect={onSelect}
          />
        </div>
      )}
      {auditResultData?.length === 0 && <EmptyTip description="暂无评审成果" />}
      {reviewDetailVisible && (
        <ReviewDetailsModal
          visible={reviewDetailVisible}
          onChange={setReviewDetailVisible}
          projectId={projectInfo?.projectId}
        />
      )}
    </div>
  )
}

export default AuditResultTab
