import React, { useState } from "react";
import { Button, Form, Input, Tabs } from "antd";
import styles from "./index.less"
import ImageIcon from "@/components/image-icon";

import { loginRules } from "@/pages/login/components/login-form/rule"
import VerificationCode from "@/components/verification-code";

import {phoneNumberRule} from "@/utils/common-rule"

import {userLoginRequest,phoneLoginRequest} from "@/services/login"

const { TabPane } = Tabs;

type LoginType = "account" | "phone"

const LoginForm: React.FC = () => {
    const [activeKey, setActiveKey] = useState<LoginType>("account");
    const [formRules, setFormRules] = useState(loginRules["account"]);

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [canSendCode, setCanSendCode] = useState<boolean>(false);

    const [form] = Form.useForm();

    const tabChangeEvent = (activeKey: string) => {
        setActiveKey(activeKey as LoginType);
        // 根据不同的type,设置不同的校验规则
        setFormRules(loginRules[activeKey])
    }

    const login = (type: LoginType) => {
        // TODO  校验通过之后进行保存
        form.validateFields().then(async (values) => {
            let resData = null;
            if(type === "account") {
                resData = await userLoginRequest(values);
            }else {
                resData = await phoneLoginRequest(values);
            }
            console.log(resData)
        })
    }

    const formChangeEvent = (changedValues: object) => {
        if(changedValues.hasOwnProperty("phone")) {
            setPhoneNumber(changedValues["phone"]);
            const canSendSms = phoneNumberRule.test(changedValues["phone"]);
            setCanSendCode(canSendSms);
        }
    }

    // 失去焦点获取手机号是否符合格式，不符合格式不能进行点击

    return (
        <Form form={form} onValuesChange={formChangeEvent}>
            <div className={styles.loginFormTitle}>
                <span className={styles.welcomeTitle}>Hello!</span>
                <span>欢迎回来</span>
            </div>
            <div className={styles.loginTypeTabs}>
                <Tabs defaultActiveKey="account" activeKey={activeKey} onChange={tabChangeEvent}>
                    <TabPane tab="账号密码登录" key="account">

                        <Form.Item className={styles.accountInput} name="userName" rules={formRules.account}>
                            <Input placeholder="用户名" className={styles.loginInput} suffix={<ImageIcon imgUrl="user.png" />} type="text" />
                        </Form.Item>

                        <Form.Item className={styles.passwordInput} name="pwd" rules={formRules.password}>
                            <Input placeholder="密码" className={styles.loginInput} suffix={<ImageIcon imgUrl="lock.png" />} type="password" />
                        </Form.Item>

                        <div>
                            <Button className={styles.loginButton} onClick={() => login("account")} type="primary">立即登录</Button>
                        </div>
                    </TabPane>
                    <TabPane tab="手机验证码登录" key="phone">

                        <Form.Item className={styles.phoneInput} name="phone" rules={formRules.phone} validateTrigger="onBlur">
                            <Input suffix={<ImageIcon imgUrl="phone.png" />} placeholder="手机号" className={styles.loginInput} type="text" />
                        </Form.Item>

                        <Form.Item className={styles.verificationCode} name="code" rules={formRules.verificationCode}>
                            <VerificationCode canSend={canSendCode} type={0} phoneNumber={phoneNumber}  />
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
