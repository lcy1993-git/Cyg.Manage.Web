import { useControllableValue } from "ahooks";
import { Button } from "antd";
import { Modal } from "antd"
import React, { useState } from "react"
import { SetStateAction } from "react";
import { Dispatch } from "react";
import MapForm from "../map-form";

interface CreateMapProps {
    libId?: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent?: () => void
}

const CreateMap:React.FC<CreateMapProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    
    return (
        <Modal title="创建映射" visible={state as boolean} bodyStyle={{paddingTop: "0px", paddingBottom: "0px"}} width="90%" destroyOnClose footer={[
            <Button key="cancle" onClick={() => setState(false)}>
                取消
            </Button>,
            <Button key="save" type="primary">
                保存
            </Button>,
        ]} onCancel={() => setState(false)}>
            <MapForm />
        </Modal>
    )
}

export default CreateMap