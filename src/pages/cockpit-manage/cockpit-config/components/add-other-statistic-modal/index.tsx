import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface AddOtherStatistic {
    visible: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
    changeFinishEvent: (componentProps: any) => void;
}

const AddOtherStatisticModal: React.FC<AddOtherStatistic> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
    const { changeFinishEvent } = props;
    const [form] = Form.useForm();

    const sureAddEvent = () => {
        form.validateFields().then((values) => {
            const { type } = values;
            const componentProps = [...type];
            setState(false);
            changeFinishEvent?.([
                {
                    name: "toDo",
                    key: uuid.v1(),
                    x:0,
                    y:0,
                    w:3,
                    h:11,
                    componentProps: componentProps,
                    fixHeight: true
                }
            ])
        })
    }

    return (
        <Modal
            title="其他统计配置"
            width={750}
            visible={state as boolean}
            destroyOnClose
            onCancel={() => setState(false)}
            onOk={() => sureAddEvent()}
        >
            <Form form={form}>
                <CommonTitle>通知栏</CommonTitle>
                <Form.Item name="type">
                    <Checkbox.Group>
                        <Checkbox value="wait">已结项</Checkbox>
                        <Checkbox value="arrange">待安排</Checkbox>
                        <Checkbox value="other">其他消息</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddOtherStatisticModal;
