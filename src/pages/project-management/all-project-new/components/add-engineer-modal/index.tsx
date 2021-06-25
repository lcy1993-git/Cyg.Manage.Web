import React, { useState, Dispatch, SetStateAction } from 'react';
import { useControllableValue } from 'ahooks';
import { Modal, Button } from 'antd';
import { Form } from 'antd';
import CreateEngineer from '../create-engineer';
import { addEngineer } from '@/services/project-management/all-project';
import { message } from 'antd';

interface AddEngineerModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
}

const AddEngineerModal: React.FC<AddEngineerModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const {finishEvent} = props;

  const [form] = Form.useForm();

  const sureAddEngineerEvent = () => {
    form.validateFields().then(async (values) => {
      try {
        setSaveLoading(true);
        const {
          projects,
          name,
          province,
          libId,
          inventoryOverviewId,
          warehouseId,
          compiler,
          compileTime,
          organization,
          startTime,
          endTime,
          company,
          plannedYear,
          importance,
          grade,
        } = values;

        const [provinceNumber, city, area] = province;

        await addEngineer({
          projects,
          engineer: {
            name,
            province: !isNaN(provinceNumber) ? provinceNumber : '',
            city: !isNaN(city) ? city : '',
            area: !isNaN(area) ? area : '',
            libId,
            inventoryOverviewId,
            warehouseId,
            compiler,
            compileTime,
            organization,
            startTime,
            endTime,
            company,
            plannedYear,
            importance,
            grade,
          },
        });

        message.success('立项成功');
        setState(false);
        finishEvent?.();
      } catch (msg) {
        console.error(msg);
      } finally {
        setSaveLoading(false);
      }
    });
  };

  return (
    <Modal
      maskClosable={false}
      centered
      visible={state}
      bodyStyle={{ height: 800, overflowY: 'auto' }}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saveLoading}
          onClick={() => sureAddEngineerEvent()}
        >
          保存
        </Button>,
      ]}
      width={820}
      onCancel={() => setState(false)}
      title="项目立项"
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CreateEngineer form={form} />
      </Form>
    </Modal>
  );
};

export default AddEngineerModal;
