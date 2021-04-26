import { EllipsisOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Tooltip } from "antd";
import { Popover } from "antd";
import uuid from "node-uuid";
import React from "react"
import { useRef } from "react";
import { useGetOverflowArray } from "./hooks";
import styles from "./index.less"

interface OverFlowHiddenComponentChildrenItem {
    width: number
    element: React.ReactNode
}

interface OverFlowHiddenComponentProps {
    childrenList: OverFlowHiddenComponentChildrenItem[]
}

const OverFlowHiddenComponent: React.FC<OverFlowHiddenComponentProps> = (props) => {
    const { childrenList = [] } = props;

    const contentRef = useRef<HTMLDivElement>(null)

    const thisSize = useSize(contentRef);

    const afterHandleArray = useGetOverflowArray<OverFlowHiddenComponentChildrenItem>(thisSize.width ?? 100, childrenList)

    const overContent = afterHandleArray.overflowArray.map((item) => {
        return (
            <div key={uuid.v1()} className="mb10 mt7">
                {item.element}
            </div>
        )
    })

    return (
        <div ref={contentRef} className={styles.overFlowHiddenComponent}>
            <div className={styles.noOverFlowContent}>
                {
                    afterHandleArray.noOverflowArray.map((item) => {
                        return (
                            <div key={uuid.v1()} style={{ width: `${item.width}px` }}>
                                {item.element}
                            </div>
                        )
                    })
                }
            </div>
            {
                afterHandleArray.noOverflowArray && afterHandleArray.overflowArray.length > 0 &&
                <div className={styles.overFlowContent}>
                    <Popover
                        content={overContent}
                        placement="bottomLeft"
                        title={null}
                        trigger="click"
                    >
                        <Tooltip title="展开">
                            <EllipsisOutlined className={styles.tableCommonButton} />
                        </Tooltip>
                    </Popover>
                </div>
            }
        </div>
    )
}

export default OverFlowHiddenComponent