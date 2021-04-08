import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditEngineerAndModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditEngineerAndMapModal: React.FC<EditEngineerAndModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { area } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'mapComponent',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: area,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ area: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
      maskClosable={false}
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
            <Checkbox value="province">项目数量（地图）</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEngineerAndMapModal;
