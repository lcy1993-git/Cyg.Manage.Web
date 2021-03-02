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
}

const ShareModal: React.FC<ShareModalProps> = (props) => {
    const [companyInfoArray, setCompanyInfoArray] = useState();
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const { projectIds } = props;

    const {run: getCompanyInfo} = useRequest(getCompanyName,{
        manual: true
    })

    return (
        <Modal title="共享" width={680} visible={state as boolean} onCancel={() => setState(false)} cancelText="取消" okText="确认">
            <Form>
                <Form.List name="shareInfo" initialValue={[{}]}>
                    {
                        (fields, { add, remove }) => (
                            <>
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
                                            fields.map((field, index) => {
                                                return (
                                                    <tr key={uuid.v1()}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Form.Item {...field} name={[field.name, "userName"]} fieldKey={[field.fieldKey, "userName"]}>
                                                                <Input />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            
                                                        </td>
                                                        <td>
                                                            <span className="mr7" onClick={() => add()}>
                                                                <PlusOutlined />
                                                            </span>
                                                            {
                                                                fields.length > 1 &&
                                                                <span onClick={() => remove(field.name)}>
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
                            </>
                        )
                    }
                </Form.List>
            </Form>
        </Modal>
    )
}

export default ShareModal