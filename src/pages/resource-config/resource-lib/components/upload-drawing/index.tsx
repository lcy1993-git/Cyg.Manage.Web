import CyFormItem from '@/components/cy-form-item';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import { uploadDrawing } from '@/services/resource-config/resource-lib';
import { useBoolean, useControllableValue } from 'ahooks';
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
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const saveDrawingEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;

        setRequestLoading(true);
        return uploadDrawing(file, { libId, securityKey });
      })
      .then(
        () => {
          return Promise.resolve();
        },
        () => {
          return Promise.reject();
        },
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
        setRequestLoading(true);
      });
  };

  const onSave = () => {
    form.validateFields().then((value) => {
      if (requestLoading) {
        setState(false);
        return;
      }
      message.info('您还未上传文件，点击“开始上传”上传文件');
    });
  };

  return (
    <Modal
      maskClosable={false}
      title="导入图纸"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传图纸文件' }]}
        >
          <FileUpload
            accept=".zip"
            uploadFileBtn
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileFn={saveDrawingEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default UploadDrawing;
