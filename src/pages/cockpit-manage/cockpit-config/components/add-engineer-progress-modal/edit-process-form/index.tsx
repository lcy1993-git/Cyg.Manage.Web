import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditEngineerProcessStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditEngineerProcessModal: React.FC<EditEngineerProcessStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'projectProgress',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: type,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ type: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
      title="工程进度统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
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

export default EditEngineerProcessModal;
