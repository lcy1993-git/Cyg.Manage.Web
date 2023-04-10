import { EllipsisOutlined } from '@ant-design/icons'
import { useSize } from 'ahooks'
import { Tooltip } from 'antd'
import { Popover } from 'antd'
import { isArray } from 'lodash'
import React from 'react'
import { useRef } from 'react'
import { useGetOverflowArray } from './hooks'
import styles from './index.less'

interface OverFlowHiddenComponentChildrenItem {
  width: number
}

interface OverFlowHiddenComponentProps {
  childrenList: OverFlowHiddenComponentChildrenItem[]
}

const OverFlowHiddenComponent: React.FC<OverFlowHiddenComponentProps> = (props) => {
  const { children, childrenList = [] } = props

  const contentRef = useRef<HTMLDivElement>(null)

  const thisSize = useSize(contentRef)

  const afterHandleArray = useGetOverflowArray<OverFlowHiddenComponentChildrenItem>(
    thisSize.width ?? 100,
    childrenList
  )

  const noOverFlowChildren = () => {
    const afterHandleArrayLength = afterHandleArray.noOverflowArray.length

    const copyChildren = isArray(children) ? [...children] : []

    return copyChildren.splice(0, afterHandleArrayLength)
  }

  const overFlowChildren = () => {
    const afterHandleArrayLength = afterHandleArray.noOverflowArray.length

    const copyChildren = isArray(children) ? [...children] : []

    return copyChildren.splice(afterHandleArrayLength, copyChildren.length)
  }

  return (
    <div ref={contentRef} className={styles.overFlowHiddenComponent}>
      <div className={styles.noOverFlowContent}>{noOverFlowChildren()}</div>
      {afterHandleArray.noOverflowArray && afterHandleArray.overflowArray.length > 0 && (
        <div className={styles.overFlowContent}>
          <Popover content={overFlowChildren()} placement="bottomLeft" title={null} trigger="click">
            <Tooltip title="展开">
              <EllipsisOutlined className={styles.tableCommonButton} />
            </Tooltip>
          </Popover>
        </div>
      )}
    </div>
  )
}

export default OverFlowHiddenComponent
