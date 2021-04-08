import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
// import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditProjectCaseStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditProjectCaseModal: React.FC<EditProjectCaseStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();
  console.log(currentRecord);
  

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { condition } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'projectSchedule',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: condition,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ condition: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
    maskClosable={false}
      title="配置-项目情况"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
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
