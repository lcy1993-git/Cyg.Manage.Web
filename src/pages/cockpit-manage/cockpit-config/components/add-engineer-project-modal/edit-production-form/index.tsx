import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditEngineerAndProductionModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditEngineerAndProductionModal: React.FC<EditEngineerAndProductionModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { production } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'personLoad',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: production,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ production: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
      title="配置-生产负荷信息"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>生产负荷</CommonTitle>
        <Form.Item name="production">
          <Checkbox.Group>
            <Checkbox value="person">生产负荷(员工)</Checkbox>
            <Checkbox value="department">生产负荷(部组)</Checkbox>
            <Checkbox value="company">生产负荷(公司)</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEngineerAndProductionModal;
