import React from "react";
import {Menu, Button, Dropdown} from "antd"
import { DownOutlined, ExportOutlined, ImportOutlined } from "@ant-design/icons";

interface TableExportButtonProps {
    selectIds?: string[]
    exportUrl: string
    extraParams?: object
}

const TableExportButton:React.FC<TableExportButtonProps> = (props) => {
    const {selectIds = [],exportUrl = "",extraParams} = props;

    const importButoonMenu = (
        <Menu>
            <Menu.Item icon={<ImportOutlined />}>
                导入
            </Menu.Item>
            <Menu.Item icon={<ExportOutlined />}>
                导出所选
            </Menu.Item>
            <Menu.Item icon={<ExportOutlined />}>
                导出所有
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={importButoonMenu}>
            <Button>
                导出 <DownOutlined />
            </Button>
        </Dropdown>
    )
}

export default TableExportButton