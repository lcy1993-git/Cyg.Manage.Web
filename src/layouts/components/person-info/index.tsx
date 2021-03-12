import { useRequest } from "ahooks";
import { getUserInfo } from "@/services/user/user-info";
import { useControllableValue } from "ahooks";
import { Form } from "antd"
import { Modal } from "antd"
import React, { Dispatch, SetStateAction } from "react"
import styles from "./index.less"

interface PersonInfoModalProps {
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const PersonInfoModal: React.FC<PersonInfoModalProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const {data: userInfo, run: getUserInfoEvent} = useRequest(() => getUserInfo(),{
        manual: true
    })

    const [form] = Form.useForm();

    const closeModalEvent = () => {
        setState(false);
    }

    const openModalEvent = () => {
        setState(false);
    }

    return (
        <Modal title="个人信息" visible={state as boolean} okText="确定" cancelText="取消" onCancel={() => closeModalEvent()} onOk={() => openModalEvent()}>
            <Form form={form}>
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
                    <div className={styles.personInfoItemLabel}></div>
                    <div className={styles.personInfoItemContent}></div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}></div>
                    <div className={styles.personInfoItemContent}></div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}></div>
                    <div className={styles.personInfoItemContent}></div>
                </div>
                <div className={styles.personInfoItem}>
                    <div className={styles.personInfoItemLabel}></div>
                    <div className={styles.personInfoItemContent}></div>
                </div>
            </Form>
        </Modal>
    )
}

export default PersonInfoModal