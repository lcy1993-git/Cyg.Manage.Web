import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface AddEngineerProcessStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
}

const AddEngineerProcessModal: React.FC<AddEngineerProcessStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values;
      const componentProps = [...type];

      if (type) {
        setState(false);

        changeFinishEvent?.([
          {
            name: "projectProcess",
            key: uuid.v1(),
            x: 0,
            y: 0,
            w: 3,
            h: 11,
            componentProps: componentProps
          }
        ])
      }
    })
  }

  return (
    <Modal
      title="工程进度统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>甘特图</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            <Checkbox value="gantt">甘特图</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEngineerProcessModal;
