import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../../utils';
import HasCheckItem from '../../has-check-item';

interface EditOtherStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
  configArray: any[];
}

const toDoComponentPropsArray = [
  { code: 'wait', name: '已结项' },
  { code: 'arrange', name: '待安排' },
  { code: 'other', name: '其他消息' },
];

const EditOtherStatisticModal: React.FC<EditOtherStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord, configArray } = props;
  const [form] = Form.useForm();

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

  const toDoComponentProps = useMemo(() => {
    const hasChooseTodoCodeArray = getHasChooseComponentsProps(configArray, 'toDo');
    const currentTodoProps = toDoComponentPropsArray.filter((item) =>
      currentRecord.componentProps?.includes(item.code),
    );
    const unChooseTodoProps = toDoComponentPropsArray.filter(
      (item) => !currentRecord.componentProps?.includes(item.code),
    );
    return {
      hasChooseTodoCodeArray,
      unChooseTodoProps,
      currentTodoProps,
    };
  }, [JSON.stringify(configArray)]);

  const toDoStatisticCheckbox = toDoComponentProps.currentTodoProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    );
  });

  const toDoStatisticHasCheck = toDoComponentProps.unChooseTodoProps.map((item) => {
    if (toDoComponentProps.hasChooseTodoCodeArray.includes(item.code)) {
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
            {toDoStatisticCheckbox}
            {toDoStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOtherStatisticModal;
