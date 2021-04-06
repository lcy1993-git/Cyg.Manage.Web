import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface EditDeliveryStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditDeliveryStatisticModal: React.FC<EditDeliveryStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { delivery } = values;
      setState(false);
      changeFinishEvent?.({
        name: 'deliveryManage',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: delivery,
      });
    });
  };

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ delivery: currentRecord.componentProps });
    }
  }, [JSON.stringify(currentRecord.componentProps)]);

  return (
    <Modal
      title="配置-交付统计"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>交付统计</CommonTitle>
        <Form.Item name="delivery">
          <Checkbox.Group>
            <Checkbox value="person">项目交付数量/设计费(员工)</Checkbox>
            <Checkbox value="department">项目交付数量/设计费(部组)</Checkbox>
            <Checkbox value="company">项目交付数量/设计费(公司)</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDeliveryStatisticModal;
