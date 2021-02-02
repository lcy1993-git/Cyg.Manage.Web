import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Table, Spin } from "antd";
import React, { useImperativeHandle, Ref, forwardRef, useState } from "react";
import styles from "./index.less";
import { useRequest } from "ahooks";
import { treeTableCommonRequeset } from "@/services/table";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { TableProps } from "antd/lib/table";
import { flatten } from "@/utils/utils"
import CommonTitle from "../common-title";
import EmptyTip from "@/components/empty-tip";

type TreeTableSelectType = "radio" | "checkbox";

interface TreeTableProps<T> extends TableProps<T> {
    // 左侧插入按钮的slot
    leftButtonsSlot?: () => React.ReactNode
    // 右侧插入按钮的slot
    rightButtonSlot?: () => React.ReactNode
    // 按钮下方可能插入slot
    otherSlot?: () => React.ReactNode
    // 表的title
    tableTitle?: string | React.ReactNode
    // 单选还是多选
    type?: TreeTableSelectType
    // 获取被勾选的数据
    getSelectData?: (value: T | T[]) => void
    // 请求数据的url，如果使用外面的数据，就不传，用Table原来的dataSource
    url?: string
    // 是否需要勾选选项
    needCheck?: boolean
}

const TreeTable = forwardRef(<T extends {}>(props: TreeTableProps<T>, ref?: Ref<any>) => {
    const { dataSource = [],needCheck = true, rightButtonSlot, otherSlot,tableTitle,leftButtonsSlot, url = "", type = "radio", getSelectData, ...rest } = props;

    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const { data = [], loading, run } = useRequest(() => treeTableCommonRequeset<T>({ url }), { ready: !!url })

    const finalyDataSource = url ? data : dataSource;

    const rowSelection = {
        onChange: (values: any[], selectedRows: any[]) => {
            getSelectData?.(selectedRows);
        },
    };

    useImperativeHandle(ref, () => ({
        // changeVal 就是暴露给父组件的方法
        refresh: () => {
            run()
        }
    }));

    const expandEvent = (expanded: boolean, record: T) => {
        //@ts-ignore
        const { id } = record;
        const copyExpandedRowKeys = [...expandedRowKeys];
        if (expanded) {
            copyExpandedRowKeys.push(id);
        } else {
            const idIndex = copyExpandedRowKeys.findIndex((item) => item === id);
            copyExpandedRowKeys.splice(idIndex, 1);
        }
        setExpandedRowKeys(copyExpandedRowKeys);
    }
    // 全部展开
    const allOpenEvent = () => {
        const flattenData = flatten(finalyDataSource).filter((item) => item.children && item.children.length > 0).map((item) => item.id);
        setExpandedRowKeys(flattenData);
    }
    // 全部折叠
    const allCloseEvent = () => {
        setExpandedRowKeys([]);
    }



    return (
        <div className={styles.treeTableData}>
            <div className={styles.treeTbaleButtonsContent}>
                <div className={styles.treeTableButtonsLeftContent}>
                    {leftButtonsSlot?.()}
                </div>
                <div className={styles.treeTableButtonsRightContent}>
                    <div className={styles.treeTableButtonSlot}>
                        {
                            rightButtonSlot?.()
                        }
                    </div>
                    <div className={styles.treeTableButtonCommon}>
                        <Button className={styles.foldButton} onClick={() => allOpenEvent()}>
                            <UpOutlined />
                            全部展开
                        </Button>
                        <Button onClick={() => allCloseEvent()}>
                            <DownOutlined />
                            全部折叠
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.treeTableOtherSlots}>
                {
                    otherSlot?.()
                }
            </div>
            <div className={styles.treeTableTitleShowContent}>
                {
                    tableTitle ?
                    <CommonTitle>{tableTitle}</CommonTitle> :
                    null
                }
            </div>
            <div className={styles.treeTableContent}>
                <Spin spinning={loading}>
                    <Table
                        dataSource={finalyDataSource}
                        expandable={{
                            expandedRowKeys: expandedRowKeys,
                            expandIcon: ({ expanded, onExpand, record }) => {
                                //@ts-ignore 因为传入T是有children 的，但是目前还没有想到解决办法
                                const { children } = record;
                                if (!children || children.length === 0) {
                                    return <span style={{ marginRight: '6px' }}></span>;
                                }
                                return expanded ? (
                                    <MinusSquareOutlined
                                        className="noCopy f16"
                                        style={{ marginRight: '6px' }}
                                        onClick={(e) => onExpand(record, e)}
                                    />
                                ) : (
                                        <PlusSquareOutlined
                                            className="noCopy f16"
                                            style={{ marginRight: '6px' }}
                                            onClick={(e) => onExpand(record, e)}
                                        />
                                    );
                            },
                            onExpand: expandEvent
                        }}
                        locale={{
                            emptyText: <EmptyTip />
                        }}
                        size="small"
                        rowKey="id"
                        bordered={true}
                        rowSelection={
                            needCheck ?
                            {
                                type: type,
                                columnWidth: '30px',
                                checkStrictly: false,
                                ...rowSelection,
                            }
                            : undefined
                        }
                        pagination={false}
                        {...rest} />
                </Spin>
            </div>
        </div>
    )
})

export default TreeTable