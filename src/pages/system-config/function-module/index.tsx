import PageCommonWrap from "@/components/page-common-wrap";
import React, { useRef } from "react";
import { Button, Switch } from "antd";
import TreeTable from "@/components/tree-table/index";
import { TreeDataItem } from "@/services/function-module"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const FunctionModule: React.FC = () => {
    const tableRef = useRef<HTMLDivElement>(null);

    const updateStatus = (record: TreeDataItem) => {
        tableFresh();
    }

    const tableFresh = () => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current?.refresh();
        }
    }

    const functionTableColumns = [
        {
            title: "模块名称",
            dataIndex: "name",
            index: "name",
            width: 240
        },
        {
            title: "请求地址",
            dataIndex: "url",
            index: "url",
            width: 300
        },
        {
            title: "数据类型",
            dataIndex: "categoryText",
            index: "categoryText",
            width: 100
        },
        {
            title: "授权码",
            dataIndex: "authCode",
            index: "authCode",
            width: 100
        },
        {
            title: "排序",
            dataIndex: "sort",
            index: "sort",
            width: 100
        },
        {
            title: "",
            render: (record: TreeDataItem) => {
                const isChecked = !record.isDisable;
                return (
                    <Switch checked={isChecked} onChange={() => updateStatus(record)} />
                )
            },
            width: 100
        }
    ]

    const functionModuleButton = () => {
        return (
            <>
                <Button type="primary" className="mr7">
                    <PlusOutlined />
                    添加
                    </Button>
                <Button className="mr7">
                    <EditOutlined />
                    编辑
                </Button>
                <Button className="mr33">
                    <DeleteOutlined />
                    删除
                </Button>
            </>
        )
    }

    return (
        <PageCommonWrap>
            <TreeTable<TreeDataItem>
                ref={tableRef}
                rightButtonSlot={functionModuleButton}
                columns={functionTableColumns}
                url="/Module/GetTreeList" />
        </PageCommonWrap>
    )
}

export default FunctionModule