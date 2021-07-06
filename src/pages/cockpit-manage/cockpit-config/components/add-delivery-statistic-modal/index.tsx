import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../utils';
import HasCheckItem from '../has-check-item';

interface AddDeliveryStatistic {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: (componentProps: any) => void;
  configArray: any[];
}

const deliveryComponentPropsArray = [
  { code: 'person', name: '项目交付数量(员工)' },
  { code: 'department', name: '项目交付数量(部组)' },
  { code: 'company', name: '项目交付数量(公司)' },
];

const AddDeliveryStatisticModal: React.FC<AddDeliveryStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, configArray } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      console.log(values);
      
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
      form.resetFields();
    });
  };

  const deliveryCompoentProps = useMemo(() => {
    const hasChooseDeliveryComponentCodeArray = getHasChooseComponentsProps(
      configArray,
      'deliveryManage',
    );
    const unChooseDeliveryComponentProps = deliveryComponentPropsArray.filter(
      (item) => !hasChooseDeliveryComponentCodeArray?.includes(item.code),
    );
    const hasChooseDeliveryComponentProps = deliveryComponentPropsArray.filter((item) =>
      hasChooseDeliveryComponentCodeArray?.includes(item.code),
    );
    return {
      unChooseDeliveryComponentProps,
      hasChooseDeliveryComponentProps,
    };
  }, [JSON.stringify(configArray)]);

  const deliveryStatisticCheckbox = deliveryCompoentProps.unChooseDeliveryComponentProps.map(
    (item) => {
      return (
        <Checkbox key={item.code} value={item.code}>
          {item.name}
        </Checkbox>
      );
    },
  );

  const deliveryStatisticHasCheck = deliveryCompoentProps.hasChooseDeliveryComponentProps.map(
    (item) => {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
    },
  );

  return (
    <Modal
      maskClosable={false}
      title="交付统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>交付统计</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            {deliveryStatisticCheckbox}
            {deliveryStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDeliveryStatisticModal;
