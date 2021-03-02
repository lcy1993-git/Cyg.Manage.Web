
import { useControllableValue } from "ahooks";
import { Form } from "antd";
import { Modal } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react"
import ArrangeForm from "../arrange-form";

interface ArrangeModalProps {
    projectIds: string[]
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const ArrangeModal: React.FC<ArrangeModalProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    const { projectIds } = props;

    const [selectType, setSelectType] = useState<string>("");

    const [form] = Form.useForm();

    const saveInfo = () => {
        form.validateFields().then(async (values) => {
            
        })
    }

    return (
        <Modal title="项目安排"
            width={680} visible={state as boolean}
            onCancel={() => setState(false)}
        >
            <Form form={form}>
                <ArrangeForm onChange={(value) => setSelectType(value)} />
            </Form>
        </Modal>
    )
}

export default ArrangeModal