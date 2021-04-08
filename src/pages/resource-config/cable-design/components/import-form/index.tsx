import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useControllableValue } from 'ahooks';
import React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Form, message, Modal, Button } from 'antd';

interface ImportChartProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const ImportCableModal: React.FC<ImportChartProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId, requestSource, changeFinishEvent } = props;
  const [form] = Form.useForm();

  const saveImportCableEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      await uploadLineStressSag(file, { libId }, requestSource, '/CableWell/SaveImport');
      message.success('导入成功');
      setState(false);
      changeFinishEvent?.();
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="680px"
      title="导入(电缆井+电缆通道)"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => saveImportCableEvent()}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}

    >
      <Form form={form} preserve={false}>
        <CyFormItem labelWidth={80} label="导入" name="file" required>
          <FileUpload maxCount={1} />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportCableModal;
