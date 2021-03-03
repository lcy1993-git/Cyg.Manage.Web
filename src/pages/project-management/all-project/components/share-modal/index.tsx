import { getCompanyName } from "@/services/project-management/all-project"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { useControllableValue, useRequest } from "ahooks"
import { Form, Input, Modal } from "antd"
import uuid from "node-uuid"
import React, { Dispatch, useState } from "react"
import { SetStateAction } from "react"

interface ShareModalProps {
    projectIds: string[]
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    finishEvent: () => void
}

const ShareModal: React.FC<ShareModalProps> = (props) => {
    const [companyInfoArray, setCompanyInfoArray] = useState<any[]>([
        { user: "", companyInfo: null }
    ]);
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const { projectIds,finishEvent } = props;

    const { run: getCompanyInfo } = useRequest(getCompanyName, {
        manual: true
    })

    const saveShareInfo = () => {
        finishEvent?.()
    }

    const addEvent = () => {

    }

    const removeEvent = () => {

    }

    return (
        <Modal title="共享" width={680} visible={state as boolean} onCancel={() => setState(false)} cancelText="取消" okText="确认">
            <table>
                <thead>
                    <tr>
                        <th style={{ width: "50px" }}>序号</th>
                        <th>用户</th>
                        <th>公司名称</th>
                        <th style={{ width: "60px" }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        companyInfoArray.map((item, index) => {
                            return (
                                <tr key={uuid.v1()}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Form.Item noStyle>
                                            <Input />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        {item?.companyName}
                                    </td>
                                    <td>
                                        <span className="mr7" onClick={() => addEvent()}>
                                            <PlusOutlined />
                                        </span>
                                        {
                                            companyInfoArray.length > 1 &&
                                            <span onClick={() => removeEvent()}>
                                                <MinusOutlined />
                                            </span>
                                        }
                                    </td>
                                </tr>

                            )
                        })
                    }
                </tbody>
            </table>
        </Modal>
    )
}

export default ShareModal