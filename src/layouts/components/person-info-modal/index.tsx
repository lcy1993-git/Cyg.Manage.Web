
import { editUserInfo, getUserInfo } from "@/services/user/user-info";
import { useControllableValue, useRequest } from "ahooks";
import { Form, Input, message } from "antd"
import { Modal } from "antd"
import React, { Dispatch, SetStateAction } from "react"
import styles from "./index.less"
import { useEffect } from "react";

interface PersonInfoModalProps {
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const PersonInfoModal: React.FC<PersonInfoModalProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const [form] = Form.useForm();

    const { data: userInfo, run: getUserInfoEvent } = useRequest(() => getUserInfo(), {
        manual: true,
        onSuccess: () => {
            console.log(userInfo)
            form.setFieldsValue({
                ...userInfo
            })
        }
    })

    const closeModalEvent = () => {
        setState(false);
        form.resetFields();
    }

    const openModalEvent = () => {
        form.validateFields().then(async(value) => {
            await editUserInfo(value);
            message.success("用户信息修改成功");
            setState(false);
        })
    }

    useEffect(() => {
        if (state) {
            getUserInfoEvent()
        }
    }, [state])

    return (
        <Modal title="个人信息" bodyStyle={{ padding: "0px 20px" }} destroyOnClose width={750} visible={state as boolean} okText="确定" cancelText="取消" onCancel={() => closeModalEvent()} onOk={() => openModalEvent()}>
            <Form form={form} preserve={false}>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>用户名</div>
                    <div className={styles.personInfoItemContent}>
                        {userInfo?.userName}
                    </div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>公司</div>
                    <div className={styles.personInfoItemContent}>
                        {userInfo?.companyName}
                    </div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>角色</div>
                    <div className={styles.personInfoItemContent}>
                        {userInfo?.roleName}
                    </div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>
                        邮箱
                    </div>
                    <div className={styles.personInfoItemContent}>
                        <Form.Item name="email" noStyle>
                            <Input />
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>
                        昵称
                    </div>
                    <div className={styles.personInfoItemContent}>
                        <Form.Item name="nickName" noStyle>
                            <Input />
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}>
                        真实姓名
                    </div>
                    <div className={styles.personInfoItemContent}>
                        <Form.Item name="name" noStyle>
                            <Input />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default PersonInfoModal