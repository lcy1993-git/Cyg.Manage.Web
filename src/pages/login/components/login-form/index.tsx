import React, { useState } from "react";
import { Button, Form, Input, Tabs } from "antd";
import styles from "./index.less"
import ImageIcon from "@/components/image-icon";

import { loginRules } from "@/pages/login/components/login-form/rule"
import VerificationCode from "../verification-code";

const { TabPane } = Tabs;

type loginType = "account" | "phone"

const LoginForm: React.FC = () => {
    const [activeKey, setActiveKey] = useState<loginType>("account");
    const [formRules, setFormRules] = useState(loginRules["account"]);

    const [form] = Form.useForm();

    const tabChangeEvent = (activeKey: string) => {
        setActiveKey(activeKey as loginType);
        // 根据不同的type,设置不同的校验规则
        setFormRules(loginRules[activeKey])
    }

    const login = (type: loginType) => {
        // TODO  校验通过之后进行保存
        form.validateFields().then((values) => {
            console.log(values)
        })
    }

    return (
        <Form form={form}>
            <div className={styles.loginFormTitle}>
                <span className={styles.welcomeTitle}>Hello!</span>
                <span>欢迎回来</span>
            </div>
            <div className={styles.loginTypeTabs}>
                <Tabs defaultActiveKey="account" activeKey={activeKey} onChange={tabChangeEvent}>
                    <TabPane tab="账号密码登录" key="account">

                        <Form.Item className={styles.accountInput} name="account" rules={formRules.account}>
                            <Input placeholder="用户名" className={styles.loginInput} suffix={<ImageIcon imgUrl="user.png" />} type="text" />
                        </Form.Item>

                        <Form.Item className={styles.passwordInput} name="password" rules={formRules.password}>
                            <Input placeholder="密码" className={styles.loginInput} suffix={<ImageIcon imgUrl="lock.png" />} type="password" />
                        </Form.Item>

                        <div>
                            <Button className={styles.loginButton} onClick={() => login("account")} type="primary">立即登录</Button>
                        </div>
                    </TabPane>
                    <TabPane tab="手机验证码登录" key="phone">

                        <Form.Item className={styles.phoneInput} name="phone" rules={formRules.phone}>
                            <Input suffix={<ImageIcon imgUrl="phone.png" />} placeholder="手机号" className={styles.loginInput} type="text" />
                        </Form.Item>


                        <Form.Item className={styles.verificationCode} name="verificationCode" rules={formRules.verificationCode}>
                            <VerificationCode />
                        </Form.Item>

                        <div>
                            <Button className={styles.loginButton} onClick={() => login("phone")} type="primary">立即登录</Button>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </Form>
    )
}

export default LoginForm
