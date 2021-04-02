import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface EditProjectCaseStatistic {
    visible: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
    changeFinishEvent: (componentProps: any) => void;
}

const EditProjectCaseModal: React.FC<EditProjectCaseStatistic> = (props) => {
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
            title="配置-项目情况"
            width={750}
            visible={state as boolean}
            destroyOnClose
            onCancel={() => setState(false)}
            onOk={() => sureAddEvent()}
        >
            <Form form={form}>
                <CommonTitle>项目情况</CommonTitle>
                <Form.Item name="condition">
                    <Checkbox.Group>
                        <Checkbox value="status">项目状态</Checkbox>
                        <Checkbox value="nature">项目性质</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProjectCaseModal;
