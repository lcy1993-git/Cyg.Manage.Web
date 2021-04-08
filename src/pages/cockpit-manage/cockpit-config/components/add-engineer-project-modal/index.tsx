import CommonTitle from '@/components/common-title';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction } from 'react';

interface AddEngineerAndProjectModalProps {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: (componentProps: any) => void;
  areaId?: string;
  areaLevel?: string;
}

const AddEngineerAndProjectModal: React.FC<AddEngineerAndProjectModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { area, production } = values;
      const chooseComponent = [];
      if (area && area.length > 0) {
        chooseComponent.push({
          name: 'mapComponent',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: area,
        });
      }
      if (production && production.length > 0) {
        chooseComponent.push({
          name: 'personLoad',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: production,
        });
      }
      setState(false);
      form.resetFields();
      changeFinishEvent?.(chooseComponent);
    });
  };

  return (
    <Modal
      maskClosable={false}
      title="工程项目统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>地图</CommonTitle>
        <Form.Item name="area">
          <Checkbox.Group>
            <Checkbox value="province">项目数量（地图）</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>生产负荷</CommonTitle>
        <Form.Item name="production">
          <Checkbox.Group>
            <Checkbox value="person">生产负荷(员工)</Checkbox>
            <Checkbox value="department">生产负荷(部组)</Checkbox>
            <Checkbox value="company">生产负荷(公司)</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEngineerAndProjectModal;
