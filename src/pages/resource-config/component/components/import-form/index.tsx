import CyFormItem from '@/components/cy-form-item';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
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
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const saveImportComponentEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        return uploadLineStressSag(file, { libId }, requestSource, '/Component/SaveImport');
      })
      .then(
        () => {
          message.success('导入成功');

          return Promise.resolve();
        },
        (res) => {
          const { code, isSuccess, message: msg } = res;
          if (message) {
            message.warn(msg);
          }
          return Promise.reject('导入失败');
        },
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
      });
  };

  const onSave = () => {
    setUploadFileTrue();
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
        <Button key="save" type="primary" onClick={() => onSave()}>
          保存
        </Button>,
      ]}
      onCancel={() => setState(false)}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CyFormItem label="导入" name="file" required>
          <FileUpload
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileFn={saveImportComponentEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default SaveImportComponent;
