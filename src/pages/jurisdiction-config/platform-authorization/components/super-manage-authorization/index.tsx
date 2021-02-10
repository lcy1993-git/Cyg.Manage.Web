import { Tabs } from "antd";
import React from "react";
import RoleAuthorization from "../role-authorization";
import UserAuthorization from "../user-authorization";

const {TabPane} = Tabs;

interface ExtractParams {
    templateId: string
}

interface SuperManageAuthorizationProps {
    extractParams: ExtractParams
}

const SuperManageAuthorization: React.FC<SuperManageAuthorizationProps> = (props) => {
    const {extractParams} = props;
    const tabsRightSlot = (
        <div>
            <span className="tipInfo mr7">权限优先级：</span>
            <span className="tipInfo">用户 &gt; 角色</span>
        </div>
    )

    const slot = {
        "right": tabsRightSlot
    }

    return (
        <div>
            <Tabs className="normalTabs noMargin" tabBarExtraContent={slot}>
                <TabPane key="role" tab="用户授权">
                    <UserAuthorization extractParams={extractParams} />
                </TabPane>
                <TabPane key="user" tab="角色授权">
                    <RoleAuthorization extractParams={extractParams}/>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default SuperManageAuthorization