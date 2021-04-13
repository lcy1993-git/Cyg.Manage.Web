import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../../utils';
import HasCheckItem from '../../has-check-item';

interface EditEngineerAndProductionModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
  configArray: any[];
}

const productionComponentPropsArray = [
  { code: 'person', name: '生产负荷(员工)' },
  { code: 'department', name: '生产负荷(部组)' },
  { code: 'company', name: '生产负荷(公司)' },
];

const EditEngineerAndProductionModal: React.FC<EditEngineerAndProductionModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord, configArray } = props;
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

  const productionComponentProps = useMemo(() => {
    const hasChooseProductionCodeArray = getHasChooseComponentsProps(configArray, 'personLoad');
    const currentProductionProps = productionComponentPropsArray.filter((item) =>
      currentRecord.componentProps.includes(item.code),
    );
    const unChooseProductionProps = productionComponentPropsArray.filter(
      (item) => !currentRecord.componentProps.includes(item.code),
    );
    return {
      hasChooseProductionCodeArray,
      unChooseProductionProps,
      currentProductionProps,
    };
  }, [JSON.stringify(configArray)]);

  const productionStatisticCheckbox = productionComponentProps.currentProductionProps.map(
    (item) => {
      return (
        <Checkbox key={item.code} value={item.code}>
          {item.name}
        </Checkbox>
      );
    },
  );

  const productionStatisticHasCheck = productionComponentProps.unChooseProductionProps.map(
    (item) => {
      if (productionComponentProps.hasChooseProductionCodeArray.includes(item.code)) {
        return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
      } else {
        return <Checkbox value={item.code} key={item.code}>{item.name}</Checkbox>;
      }
    },
  );

  return (
    <Modal
      maskClosable={false}
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
            {productionStatisticCheckbox}
            {productionStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEngineerAndProductionModal;
