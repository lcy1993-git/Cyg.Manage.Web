import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
// import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';

interface EditProjectTypeStatistic {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: (componentProps: any) => void;
  currentRecord: any;
}

const EditProjectTypeModal: React.FC<EditProjectTypeStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, currentRecord } = props;
  const [form] = Form.useForm();
  console.log(currentRecord);

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values;

      setState(false);

      changeFinishEvent?.({
        name: 'projectType',
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
    maskClosable={false}
      title="配置-项目类型"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>项目类型</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            <Checkbox value="classify">项目分类</Checkbox>
            <Checkbox value="category">项目类别</Checkbox>
            <Checkbox value="stage">项目阶段</Checkbox>
            <Checkbox value="buildType">建设类型</Checkbox>
            <Checkbox value="level">电压等级</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectTypeModal;
