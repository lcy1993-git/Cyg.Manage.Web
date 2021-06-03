import CommonTitle from '@/components/common-title';
import _ from 'lodash';
import { useControllableValue } from 'ahooks';
import { Modal, Checkbox, Form } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { getHasChooseComponentsProps } from '../../utils';
import HasCheckItem from '../has-check-item';

interface AddEngineerAndProjectModalProps {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: (componentProps: any) => void;
  configArray: any[];
}

const mapComponentPropsArray = [{ code: 'province', name: '项目数量（地图）' }];

const productionComponentPropsArray = [
  { code: 'person', name: '生产负荷(员工)' },
  { code: 'department', name: '生产负荷(部组)' },
  { code: 'company', name: '生产负荷(公司)' },
];

const dynamicDataStatisticPropsArray = [{ code: 'projectRefreshData', name: '项目实时动态' }];

const AddEngineerAndProjectModal: React.FC<AddEngineerAndProjectModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { changeFinishEvent, configArray } = props;
  const [form] = Form.useForm();

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { area, production, dynamicData } = values;
      let chooseComponent = [];
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

      if (dynamicData && dynamicData.length > 0) {
        const temp = dynamicData.map((v: string) => ({
          name: v,
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: dynamicData,
        }));
        console.log(temp);

        chooseComponent = _.union(chooseComponent, temp);
      }

      setState(false);
      form.resetFields();
      changeFinishEvent?.(chooseComponent);
    });
  };

  const mapCompoentProps = useMemo(() => {
    const hasChooseMapComponentCodeArray = getHasChooseComponentsProps(configArray, 'mapComponent');
    const unChooseMapComponentProps = mapComponentPropsArray.filter(
      (item) => !hasChooseMapComponentCodeArray?.includes(item.code),
    );
    const hasChooseMapComponentProps = mapComponentPropsArray.filter((item) =>
      hasChooseMapComponentCodeArray?.includes(item.code),
    );
    return {
      hasChooseMapComponentProps,
      unChooseMapComponentProps,
    };
  }, [JSON.stringify(configArray)]);

  const productionComponentProps = useMemo(() => {
    const hasChooseProductionCodeArray = getHasChooseComponentsProps(configArray, 'personLoad');
    const unChooseProductionProps = productionComponentPropsArray.filter(
      (item) => !hasChooseProductionCodeArray?.includes(item.code),
    );
    const hasChooseProductionProps = productionComponentPropsArray.filter((item) =>
      hasChooseProductionCodeArray?.includes(item.code),
    );
    return {
      hasChooseProductionProps,
      unChooseProductionProps,
    };
  }, [JSON.stringify(configArray)]);

  const dynamicDataStatisticCheckboxPropsArray = useMemo(() => {
    const hasChooseArray = getHasChooseComponentsProps(configArray, 'projectRefreshData');

    const unChoose = dynamicDataStatisticPropsArray.filter(
      (item) => !hasChooseArray?.includes(item.code),
    );
    const hasChose = dynamicDataStatisticPropsArray.filter((item) =>
      hasChooseArray?.includes(item.code),
    );

    return {
      hasChose,
      unChoose,
    };
  }, [JSON.stringify(configArray)]);

  const mapStatisticCheckbox = mapCompoentProps.unChooseMapComponentProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    );
  });

  const productionStatisticCheckbox = productionComponentProps.unChooseProductionProps.map(
    (item) => {
      return (
        <Checkbox key={item.code} value={item.code}>
          {item.name}
        </Checkbox>
      );
    },
  );

  const mapStatisticHasCheck = mapCompoentProps.hasChooseMapComponentProps.map((item) => {
    return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
  });

  const productionStatisticHasCheck = productionComponentProps.hasChooseProductionProps.map(
    (item) => {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
    },
  );

  const dynamicDataStatisticHasCheck = dynamicDataStatisticCheckboxPropsArray.hasChose.map(
    (item) => {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>;
    },
  );

  const dynamicDataStatisticCheckbox = dynamicDataStatisticCheckboxPropsArray.unChoose.map(
    (item) => {
      return (
        <Checkbox key={item.code} value={item.code}>
          {item.name}
        </Checkbox>
      );
    },
  );

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
            {mapStatisticCheckbox}

            {mapStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>生产负荷</CommonTitle>
        <Form.Item name="production">
          <Checkbox.Group>
            {productionStatisticCheckbox}

            {productionStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>实时数据</CommonTitle>
        <Form.Item name="dynamicData">
          <Checkbox.Group>
            {dynamicDataStatisticCheckbox}

            {dynamicDataStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEngineerAndProjectModal;
