import { useControllableValue } from "ahooks";
import { Modal } from "antd"
import React, { useState } from "react"
import { SetStateAction } from "react";
import { Dispatch } from "react";
import MapForm from "../map-form";

interface CreateMapProps {
    libId?: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent: () => void
}

const CreateMap:React.FC<CreateMapProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });


 
    return (
        <Modal title="创建映射" visible={state as boolean} destroyOnClose>
            <MapForm />
        </Modal>
    )
}

export default CreateMap