import CommonTitle from "@/components/common-title";
import { CopyOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Tabs, Form, message } from "antd";
import React, { useState } from "react";
import CreateEngineerForm from "../create-engineer-form";
import CreateProjectForm from "../create-project-form";

const { TabPane } = Tabs;

interface CreateEngineerProps {
    form: any
}

const CreateEngineer: React.FC<CreateEngineerProps> = (props) => {
    const {form} = props;

    const [activeProjectKey, setActiveProjectKey] = useState<string>("0");

    const tabChangeEvent = (activeKey: string) => {
        setActiveProjectKey(activeKey)
    }

    const deleteEvent = (index: string) => {
        const currentIndex = parseFloat(index);
        if(isNaN(currentIndex)) {
            setActiveProjectKey("0")
            return
        }
        if(currentIndex > 0) {
            setActiveProjectKey(String(currentIndex - 1));
            return
        }
    }

    const copyEvent = () => {
        const formData = form.getFieldsValue();

        const {project} = formData;

        const copyFormData = project[activeProjectKey];
  
        form.setFieldsValue({"project": [...project,copyFormData]})

    }

    return (
        <div>
            <CommonTitle>工程信息</CommonTitle>
            <CreateEngineerForm />
            <CommonTitle>项目信息</CommonTitle>
            <Form.List name="project" initialValue={[{ name: "" }]}>
                {
                    (fields, {add, remove}) => (
                        <>
                            <div>
                                <Button className="mr7" onClick={() => {
                                    setActiveProjectKey(String(fields.length))
                                    add()
                                }}>
                                    <PlusOutlined />
                                    空白项目
                                </Button>
                                <Button className="mr7" onClick={() => copyEvent()}>
                                    <CopyOutlined />
                                    复制项目
                                </Button>
                                <Button className="mr7" onClick={() => {
                                    if(fields.length === 1) {
                                        message.error("至少需要一个项目，不能进行删除了");
                                        return
                                    }
                                    deleteEvent(activeProjectKey)
                                    remove(fields[activeProjectKey].name)
                                }}>
                                    <DeleteOutlined />
                                    删除项目
                                </Button>
                            </div>
                            <Tabs className="normalTabs" activeKey={activeProjectKey} onChange={tabChangeEvent}>
                                {
                                    fields.map((field, key) => (
                                        <TabPane key={key} tab={`项目${key + 1}`}>
                                            <CreateProjectForm field={field} />
                                        </TabPane>
                                    ))
                                }
                            </Tabs>
                        </>
                    )
                }
            </Form.List>


        </div>
    )
}

export default CreateEngineer