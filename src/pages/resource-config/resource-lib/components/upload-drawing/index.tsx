import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadDrawing } from '@/services/resource-config/resource-lib';
import { useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface UploadDrawingProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
}

const UploadDrawing: React.FC<UploadDrawingProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', securityKey = '', changeFinishEvent } = props;

  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const saveDrawingEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      try {
        setRequestLoading(true);
        await uploadDrawing(file, { libId, securityKey });
        message.success('导入成功');
        setState(false);
        changeFinishEvent?.();
      } catch (msg) {
        console.error(msg);
      } finally {
        setRequestLoading(false);
      }
    });
  };

  return (
    <Modal
      title="导入图纸"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => saveDrawingEvent()}
          loading={requestLoading}
        >
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

export default UploadDrawing;
