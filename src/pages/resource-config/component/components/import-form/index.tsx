import CyFormItem from '@/components/cy-form-item';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface SaveImportComponentProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const SaveImportComponent: React.FC<SaveImportComponentProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', requestSource, changeFinishEvent } = props;
  const [form] = Form.useForm();

  const [fileId, setFileId] = useState<string>();

  const uploadFile = async (setStatus: (uploadStatus: UploadStatus) => void) => {
    await uploadLineStressSag(
      form.getFieldValue('file'),
      { libId },
      requestSource,
      '/Component/SaveImport',
    ).then(
      () => {
        setStatus('success');
        setFileId(fileId);
      },
      () => {
        message.warn('文件上传失败');
        setStatus('error');
      },
    );
  };

  const saveImportComponentEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      await uploadLineStressSag(file, { libId }, requestSource, '/Component/SaveImport');
      message.success('导入成功');
      setState(false);
      changeFinishEvent?.();
    });
  };

  return (
    <Modal
      maskClosable={false}
      title="导入组件"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => saveImportComponentEvent()}>
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

export default SaveImportComponent;
