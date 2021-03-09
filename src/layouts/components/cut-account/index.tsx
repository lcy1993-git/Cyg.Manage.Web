import CyFormItem from "@/components/cy-form-item";
import { userLoginRequest } from "@/services/login";
import { useControllableValue } from "ahooks";
import { Form, Input, message, Modal } from "antd";
import React, { Dispatch } from "react";
import { SetStateAction } from "react";

interface EditPasswordProps {
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const CutAccount = (props: EditPasswordProps) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const [form] = Form.useForm();

    const sureCutAccount = () => {
        form.validateFields().then(async (value) => {
            const { userName, pwd } = value;
            // TODO 快捷切换
            const resData = await userLoginRequest({userName, pwd});

            const { accessToken, modules, user } = resData;

            localStorage.setItem('Authorization', accessToken);
            localStorage.setItem('functionModules', JSON.stringify(modules));
            localStorage.setItem('userInfo', JSON.stringify(user));

            setState(false)
            message.success("账户切换成功")
            location.reload();
        })
    }

    return (
        <Modal title="快捷登录" visible={state as boolean} okText="确定" cancelText="取消" onCancel={() => setState(false)} onOk={() => sureCutAccount()}>
            <Form form={form}>
                <CyFormItem name="userName" label="用户名" required labelWidth={100} rules={[
                    {
                        required: true, message: "请输入用户名"
                    }
                ]}>
                    <Input placeholder="请输入" />
                </CyFormItem>
                <CyFormItem name="pwd" label="密码" required labelWidth={100} rules={[
                    {
                        required: true, message: "密码"
                    }
                ]}>
                    <Input type="password" placeholder="请输入" />
                </CyFormItem>
            </Form>
        </Modal>
    )
}

export default CutAccount