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
        (res) => {
          message.error(res.message);
          return Promise.reject();
        }
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
        setRequestLoading(false);
      });
  };

  const onSave = () => {};

  return (
    <Modal
      maskClosable={false}
      title="导入图纸"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => setState(false)} loading={requestLoading}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CyFormItem label="导入" name="file" required>
          <FileUpload
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
