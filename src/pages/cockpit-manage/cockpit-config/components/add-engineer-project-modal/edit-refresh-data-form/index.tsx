import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditRefreshDataFormProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditRefreshDataModal: React.FC<EditRefreshDataFormProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { data } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'projectRefreshData',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: data,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ data: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
      maskClosable={false}
      title="配置-实时数据"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>实时数据</CommonTitle>
        <Form.Item name="data">
          <Checkbox.Group>
            <Checkbox value="projectRefreshData">实时数据</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRefreshDataModal;
