import CyFormItem from "@/components/cy-form-item";
import { editPassword } from "@/services/user/user-info";
import { useControllableValue } from "ahooks";
import { Form, Input, message, Modal } from "antd";
import React, { Dispatch } from "react";
import { SetStateAction } from "react";
import { history } from 'umi';

interface EditPasswordProps {
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const EditPassword = (props: EditPasswordProps) => {
    const [state, setState] = useControllableValue(props, {valuePropName: "visible"});
    
    const [form] = Form.useForm();

    const sureEditPassword = () => {
        form.validateFields().then(async (value) => {
            const {pwd,newPwd} = value;
            await editPassword({pwd,newPwd})
            
            setState(false)
            message.success("密码修改成功,请重新登录")
            
            history.push('/login');
            localStorage.setItem('Authorization', '');
        })
    }

    return (
        <Modal title="修改密码" visible={state as boolean} destroyOnClose okText="确定" cancelText="取消" onCancel={() => setState(false)} onOk={() => sureEditPassword()}>
            <Form form={form} preserve={false}>
                <CyFormItem name="pwd" label="原密码" required labelWidth={100} hasFeedback rules={[
                    {
                        required: true, message: "请输入原密码"
                    }
                ]}>
                    <Input type="password" placeholder="请输入" />
                </CyFormItem>
                <CyFormItem name="newPwd" label="新密码" required labelWidth={100} hasFeedback>
                    <Input type="password" placeholder="请输入" />
                </CyFormItem>
                <CyFormItem name="confirmPassword" label="确认密码" required labelWidth={100} hasFeedback dependencies={['newPwd']} rules={[
                    {
                        required: true,
                        message: '请确认密码',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPwd') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('两次密码输入不一致，请确认');
                        },
                    }),
                ]}>
                    <Input type="password" placeholder="请输入" />
                </CyFormItem>
            </Form>
        </Modal>
    )
}

export default EditPassword