import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface EditEngineerAndModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
}

const EditEngineerAndMapModal: React.FC<EditEngineerAndModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { area } = values;
      const chooseComponent = [];
      if (area && area.length > 0) {
        chooseComponent.push({
          name: 'mapComponent',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: area,
        });
      }

      setState(false);

      changeFinishEvent?.(chooseComponent);
    });
  };

  return (
    <Modal
      title="配置-地图信息"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>地图</CommonTitle>
        <Form.Item name="area">
          <Checkbox.Group>
            <Checkbox value="province">省</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEngineerAndMapModal;
