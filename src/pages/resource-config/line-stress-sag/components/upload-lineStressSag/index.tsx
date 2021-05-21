import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface UploadLineStreeSagProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource?: 'project' | 'resource' | 'upload';
}

const UploadLineStressSag: React.FC<UploadLineStreeSagProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', securityKey = '', requestSource = 'upload', changeFinishEvent } = props;
  const [form] = Form.useForm();
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        return uploadLineStressSag(
          file,
          { libId, securityKey },
          requestSource,
          '/Upload/LineStressSag',
        );
      })
      .then(
        () => {
          message.success('导入成功');
          return Promise.resolve();
        },
        () => {
          return Promise.reject('');
        },
      )
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
      });
  };

  return (
    <Modal
      maskClosable={false}
      title="导入应力弧垂表-图纸"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => setState(false)}>
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
            uploadFileBtn
            uploadFileFn={saveLineStreesSagEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default UploadLineStressSag;
