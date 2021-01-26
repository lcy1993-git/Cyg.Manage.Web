import GeneralTable from "@/components/general-table";
import PageCommonWrap from "@/components/page-common-wrap";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const PlatformRole: React.FC = () => {

    const rightButton = () => {
        return (
            <div>
                <Button type="primary" className="mr7">
                    <PlusOutlined />
                    添加
                </Button>
                <Button>
                    <EditOutlined />
                    编辑
                </Button>
            </div>
        )
    }

    const columns = [
        {
            title: "角色名称",
            dataIndex: "roleName",
            index: "roleName",
            width: 240
        },
        {
            title: "角色类型",
            dataIndex: "roleType",
            index: "roleType",
            width: 240
        },
        {
            title: "备注",
            dataIndex: "remark",
            index: "remark",
        }
    ]
    
    return (
        <PageCommonWrap>
            <GeneralTable
                buttonRightContentSlot={rightButton}
                needCommonButton={true}
                tableTitle="角色管理"
                url="/Role/GetPagedList"
                columns={columns}
            />
        </PageCommonWrap>
    )
}

export default PlatformRole