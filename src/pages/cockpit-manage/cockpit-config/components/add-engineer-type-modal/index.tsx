import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../utils';
import HasCheckItem from '../has-check-item';

interface AddEngineerTypeStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  configArray: any[];
}

const typeComponentPropsArray = [
  { code: 'classify', name: '项目分类' },
  { code: 'category', name: '项目类别' },
  { code: 'stage', name: '项目阶段' },
  { code: 'buildType', name: '项目类型' },
  { code: 'level', name: '电压等级' },
];

const caseComponentPropsArray = [
  { code: 'status', name: '项目状态' },
  { code: 'nature', name: '项目性质' },
];

const AddEngineerTypeModal: React.FC<AddEngineerTypeStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, configArray } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { type, condition } = values;
      const chooseComponent = [];
      if (type && type.length > 0) {
        chooseComponent.push({
          name: 'projectType',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: type,
        });
      }
      if (condition && condition.length > 0) {
        chooseComponent.push({
          name: 'projectSchedule',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: condition,
        });
      }
      setState(false);
      form.resetFields();

      changeFinishEvent?.(chooseComponent);
    });
  };

  const typeCompoentProps = useMemo(() => {
    const hasChooseMapComponentCodeArray = getHasChooseComponentsProps(configArray, 'projectType');
    const unChooseMapComponentProps = typeComponentPropsArray.filter(
      (item) => !hasChooseMapComponentCodeArray?.includes(item.code),
    );
    const hasChooseMapComponentProps = typeComponentPropsArray.filter((item) =>
      hasChooseMapComponentCodeArray?.includes(item.code),
    );
    return {
      hasChooseMapComponentProps,
      unChooseMapComponentProps,
    };
  }, [JSON.stringify(configArray)]);

  const caseComponentProps = useMemo(() => {
    const hasChooseProductionCodeArray = getHasChooseComponentsProps(configArray, 'projectSchedule');
    const unChooseProductionProps = caseComponentPropsArray.filter(
      (item) => !hasChooseProductionCodeArray.includes(item.code),
    );
    const hasChooseProductionProps = caseComponentPropsArray.filter((item) =>
      hasChooseProductionCodeArray.includes(item.code),
    );
    return {
      hasChooseProductionProps,
      unChooseProductionProps,
    };
  }, [JSON.stringify(configArray)]);

  const typeStatisticCheckbox = typeCompoentProps.unChooseMapComponentProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    );
  });

  const caseStatisticCheckbox = caseComponentProps.unChooseProductionProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    );
  });

  const typeStatisticHasCheck = typeCompoentProps.hasChooseMapComponentProps.map((item) => {
    return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
  });

  const caseStatisticHasCheck = caseComponentProps.hasChooseProductionProps.map((item) => {
    return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
  });

  return (
    <Modal
      maskClosable={false}
      title="工程类型统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>项目类型</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            {typeStatisticCheckbox}

            {typeStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>项目情况</CommonTitle>
        <Form.Item name="condition">
          <Checkbox.Group>
            {caseStatisticCheckbox}

            {caseStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEngineerTypeModal;
