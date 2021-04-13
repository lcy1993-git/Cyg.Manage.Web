import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../../utils';
import HasCheckItem from '../../has-check-item';

interface EditDeliveryStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
  configArray:any[];
}

const deliveryComponentPropsArray = [
  { code: 'person', name: '项目交付数量/设计费(员工)' },
  { code: 'department', name: '项目交付数量/设计费(部组)' },
  { code: 'company', name: '项目交付数量/设计费(公司)' },
];

const EditDeliveryStatisticModal: React.FC<EditDeliveryStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord,configArray } = props;
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

  const deliveryComponentProps = useMemo(() => {
    const hasChooseDeliveryCodeArray = getHasChooseComponentsProps(configArray, 'deliveryManage');
    const currentDeliveryProps = deliveryComponentPropsArray.filter((item) =>
      currentRecord.componentProps.includes(item.code),
    );
    const unChooseDeliveryProps = deliveryComponentPropsArray.filter(
      (item) => !currentRecord.componentProps.includes(item.code),
    );
    return {
      hasChooseDeliveryCodeArray,
      unChooseDeliveryProps,
      currentDeliveryProps,
    };
  }, [JSON.stringify(configArray)]);

  const deliveryStatisticCheckbox = deliveryComponentProps.currentDeliveryProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    );
  });

  const deliveryStatisticHasCheck = deliveryComponentProps.unChooseDeliveryProps.map((item) => {
    if (deliveryComponentProps.hasChooseDeliveryCodeArray.includes(item.code)) {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
    } else {
      return (
        <Checkbox value={item.code} key={item.code}>
          {item.name}
        </Checkbox>
      );
    }
  });

  return (
    <Modal
    maskClosable={false}
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
            {deliveryStatisticCheckbox}
            {deliveryStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDeliveryStatisticModal;
