import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface EditDeliveryStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  editData: any[];
}

const EditDeliveryStatisticModal: React.FC<EditDeliveryStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, editData } = props;
  const [form] = Form.useForm();


  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values;
      const componentProps = [...type];
      setState(false);
      changeFinishEvent?.([
        {
          name: 'deliveryManage',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: componentProps,
        },
      ]);
    });
  };

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
        <Form.Item name="type">
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
