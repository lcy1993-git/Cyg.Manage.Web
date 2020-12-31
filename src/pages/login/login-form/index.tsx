import React from "react";
import { Button, Form, Input, message } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./index.less";
import {loginRule} from "./login-rule";
import { loginParams, loginRequest } from "@/services/login";
import {history} from "umi";

const loginForm: React.FC = () => {
    const [loginForm] = Form.useForm();

    const loginEvent = async (values: loginParams) => {
        try {
            await loginRequest(values);
            history.push("/index");
        }catch (msg) {
            message.error(msg)
        }
    }

    return (
        <Form form={loginForm} onFinish={loginEvent}>
            <Form.Item name="UserName" className={styles.userInput} rules={loginRule.userRule}>
                <Input size="large" addonBefore={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="Pwd" className={styles.passwordInput} rules={loginRule.passwordRule}>
                <Input size="large" type="password" addonBefore={<KeyOutlined />} />
            </Form.Item>
            <div className={styles.loginButtonContent}>
                <Button type="primary" htmlType="submit">登 录</Button>
                <Button style={{marginLeft: "20px"}}>重 置</Button>
            </div>
        </Form>
    )
}

export default loginForm