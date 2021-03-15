import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface SaveImportElectricalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const SaveImportElectrical: React.FC<SaveImportElectricalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', requestSource, changeFinishEvent } = props;
  const [form] = Form.useForm();

  const saveImportElectricalEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      await uploadLineStressSag(file, { libId }, requestSource, '/ElectricalEquipment/SaveImport');
      message.success('导入成功');
      setState(false);
      changeFinishEvent?.();
    });
  };

  return (
    <Modal
      title="导入电气设备"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => saveImportElectricalEvent()}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CyFormItem label="导入" name="file" required>
          <FileUpload maxCount={1} />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default SaveImportElectrical;
