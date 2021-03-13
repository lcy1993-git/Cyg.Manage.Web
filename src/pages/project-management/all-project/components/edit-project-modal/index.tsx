import { editProject, getProjectInfo } from "@/services/project-management/all-project";
import { useControllableValue } from "ahooks";
import { Button } from "antd";
import { Form, message, Modal } from "antd"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRequest } from "ahooks";
import moment from "moment";
import CreateProjectForm from "../create-project-form";

interface EditProjectProps {
    projectId: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
    changeFinishEvent: () => void
    areaId: string
    company: string
    companyName?: string
}

const EditProjectModal: React.FC<EditProjectProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });
    const [requestLoading, setRequestLoading] = useState(false);
    const [form] = Form.useForm();

    const { projectId, changeFinishEvent, areaId, company,companyName } = props;

    const { data: projectInfo, run} = useRequest(() => getProjectInfo(projectId), {
        manual: true,
        onSuccess: (res) => {
            form.setFieldsValue({
                ...projectInfo,
                startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
                endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
                deadline: projectInfo?.startTime ? moment(projectInfo?.deadline) : null,
                natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
                isAcrossYear: projectInfo?.isAcrossYear ? "true" : "false"
            })
        }
    })

    useEffect(() => {
        if(state) {
            run();
        }
    }, [state])

    const edit = () => {
        form.validateFields().then(async (value) => {
            try {
                await editProject({
                    id: projectId,
                    ...value
                })
                message.success("项目信息更新成功")
                setState(false)
                form.resetFields();
                changeFinishEvent?.()
            } catch (msg) {
                console.error(msg)
            } finally {
                setRequestLoading(false)
            }
        })
    }

    return (
        <Modal title="编辑项目信息" width={750} visible={state as boolean} destroyOnClose
            footer={[
                <Button key="cancle" onClick={() => setState(false)}>
                    取消
            </Button>,
                <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
                    保存
            </Button>,
            ]} onOk={() => edit()} onCancel={() => setState(false)}>
            <Form form={form} preserve={false}>
                <CreateProjectForm areaId={areaId} company={company} companyName={companyName} />
            </Form>
        </Modal>
    )
}

export default EditProjectModal