import { shareProject } from "@/services/project-management/all-project"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { useControllableValue } from "ahooks"
import { Input, message, Modal } from "antd"
import React, { Dispatch, useState } from "react"
import { useEffect } from "react"
import { SetStateAction } from "react"
import ShowCompanyInfoChunk from "../show-company-info-chunk"

import styles from "./index.less"

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

    const saveShareInfo = async () => {
        const userIds = companyInfoArray.filter((item) => item.companyInfo).map((item) => item.companyInfo).map((item) => item.value);
        
        if(userIds.length === 0) {
            message.error("至少需要一个存在的管理员用户信息");
            return
        }
        await shareProject({
            userIds,projectIds
        })
        message.success("共享成功")
        setState(false)
        finishEvent?.()
    }

    const addEvent = () => {
        setCompanyInfoArray([...companyInfoArray, {user: "", companyInfo: null}])
    }

    const removeEvent = (index: number) => {
        const copyData = JSON.parse(JSON.stringify(companyInfoArray));
        copyData.splice(index,1);
        setCompanyInfoArray(copyData)
    }

    const userChangeEvent = async (value: string, index: number) => {
        const copyData = JSON.parse(JSON.stringify(companyInfoArray));
        copyData.splice(index,1,{user: value,companyInfo: copyData[index].companyInfo});
        setCompanyInfoArray(copyData)
    }

    const getCompanyInfoChange = (companyInfo: any, index: number) => {
        const copyData = JSON.parse(JSON.stringify(companyInfoArray));
        copyData.splice(index,1,{user: copyData[index].user,companyInfo: companyInfo});
        setCompanyInfoArray(copyData)
    }

    useEffect(() => {
        if(state) {
            setCompanyInfoArray([
                { user: "", companyInfo: null }
            ])
        }
    }, [state])

    return (
        <Modal title="共享" width={680} visible={state as boolean} destroyOnClose onCancel={() => setState(false)} onOk={() => saveShareInfo()} cancelText="取消" okText="确认">
            <table className={styles.shareTable}>
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
                                <tr key={`shabeTable_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Input value={item.user} onChange={(e) => userChangeEvent(e.target.value, index)} />
                                    </td>
                                    <td>
                                        <ShowCompanyInfoChunk user={item.user} onChange={(companyInfo) => getCompanyInfoChange(companyInfo, index)} />
                                    </td>
                                    <td>
                                        <span className={`${styles.canClickButton} mr7`} onClick={() => addEvent()}>
                                            <PlusOutlined />
                                        </span>
                                        {
                                            companyInfoArray.length > 1 &&
                                            <span className={styles.canClickButton} onClick={() => removeEvent(index)}>
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