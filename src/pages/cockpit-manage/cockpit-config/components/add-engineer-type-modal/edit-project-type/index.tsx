import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface EditProjectTypeStatistic {
    visible: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
    changeFinishEvent: (componentProps: any) => void;
}

const EditProjectTypeModal: React.FC<EditProjectTypeStatistic> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
    const { changeFinishEvent } = props;
    const [form] = Form.useForm();

    const sureAddEvent = () => {
        form.validateFields().then((values) => {
            const { type,condition } = values;
            const componentProps = [...type,...condition];

            setState(false);
            
            changeFinishEvent?.([
                {
                    name: "projectType",
                    key: uuid.v1(),
                    x:0,
                    y:0,
                    w:3,
                    h:11,
                    componentProps: componentProps
                }
            ])
        })
    }

    return (
        <Modal
            title="配置-项目类型"
            width={750}
            visible={state as boolean}
            destroyOnClose
            onCancel={() => setState(false)}
            onOk={() => sureAddEvent()}
        >
            <Form form={form}>
                <CommonTitle>项目类型</CommonTitle>
                <Form.Item name="type">
                    <Checkbox.Group>
                        <Checkbox value="classify">项目分类</Checkbox>
                        <Checkbox value="category">项目类别</Checkbox>
                        <Checkbox value="stage">项目阶段</Checkbox>
                        <Checkbox value="buildType">建设类型</Checkbox>
                        <Checkbox value="level">电压等级</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                
            </Form>
        </Modal>
    );
};

export default EditProjectTypeModal;
