import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface SaveImportMaterialProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const SaveImportMaterial: React.FC<SaveImportMaterialProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', requestSource, changeFinishEvent } = props;
  // const [requestLoading, setRequestLoading] = useState(false);
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const [form] = Form.useForm();
  const map = new Map();
  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        return uploadLineStressSag(file, { libId }, requestSource, '/Material/Import');
      })
      .then(
        () => {
          message.success('导入成功');
          setTimeout(() => {
            setState(false);
          }, 1000);
          return Promise.resolve();
        },
        () => {
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
      title="导入物料"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => onSave()}
          // loading={requestLoading}
        >
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
            uploadFileFn={saveLineStreesSagEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default SaveImportMaterial;
