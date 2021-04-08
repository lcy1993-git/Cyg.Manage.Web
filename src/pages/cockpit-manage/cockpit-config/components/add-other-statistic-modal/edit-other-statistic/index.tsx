import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditOtherStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditOtherStatisticModal: React.FC<EditOtherStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();
  console.log(currentRecord);

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { others } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'toDo',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: others,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ others: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
    maskClosable={false}
      title="配置-其他统计"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>通知栏</CommonTitle>
        <Form.Item name="others">
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

export default EditOtherStatisticModal;
