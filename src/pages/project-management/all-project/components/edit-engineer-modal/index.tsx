import { addProject, editEngineer, getEngineerInfo } from "@/services/project-management/all-project";
import { useControllableValue } from "ahooks";
import { Button } from "antd";
import { Form, message, Modal } from "antd"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useRequest } from "ahooks";
import CreateEngineerForm from "../create-engineer-form";
import moment from "moment";

interface EditEngineerProps {
    engineerId: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent: () => void
}

const EditEngineerModal: React.FC<EditEngineerProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    const [requestLoading, setRequestLoading] = useState(false);
    const [areaId, setAreaId] = useState<string>("");
    const [libId, setLibId] = useState<string>("");

    const [form] = Form.useForm();

    const { engineerId, changeFinishEvent } = props;

    const { data: engineerInfo } = useRequest(() => getEngineerInfo(engineerId), {
        ready: !!(engineerId && state),
        refreshDeps: [engineerId],
        onSuccess: (res) => {
            form.setFieldsValue({
                ...engineerInfo,
                compileTime: engineerInfo?.compileTime ? moment(engineerInfo?.compileTime) : null,
                startTime: engineerInfo?.startTime ? moment(engineerInfo?.startTime) : null,
                endTime: engineerInfo?.endTime ? moment(engineerInfo?.endTime) : null,
                importance: String(engineerInfo?.importance),
                grade: String(engineerInfo?.grade),
            })

            setAreaId(engineerInfo?.province ?? "")
            setLibId(engineerInfo?.libId ?? "")
        }
    })

    const edit = () => {
        form.validateFields().then(async (value) => {
            try {
                await editEngineer({
                    id: engineerId,
                    ...value
                })
                message.success("工程信息更新成功")
                setState(false)
                changeFinishEvent?.()
            } catch (msg) {
                console.error(msg)
            } finally {
                setRequestLoading(false)
            }
        })
    }

    return (
        <Modal title="编辑工程信息" width={750} visible={state as boolean} destroyOnClose={true}
            footer={[
                <Button key="cancle" onClick={() => setState(false)}>
                    取消
            </Button>,
                <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
                    保存
            </Button>,
            ]} onOk={() => edit()} onCancel={() => setState(false)}>
            <Form form={form}>
                <CreateEngineerForm areaId={areaId} libId={libId} />
            </Form>
        </Modal>
    )
}

export default EditEngineerModal