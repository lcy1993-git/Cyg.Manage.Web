import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React from 'react';
import { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface SaveImportLineStressSagProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const SaveImportLineStressSag: React.FC<SaveImportLineStressSagProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', requestSource, changeFinishEvent } = props;
  const [falseData, setFalseData] = useState<string>('');
  const [importTipsVisible, setImportTipsVisible] = useState<boolean>(false);
  // const [requestLoading, setRequestLoading] = useState(false);
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const [form] = Form.useForm();
  const onSave = () => {
    setUploadFileTrue();
  };
  const saveLineStreesSagEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;

        return uploadLineStressSag(
          file,
          { libId },
          requestSource,
          '/ResourceLib/SaveImportLineStressSag',
        );
      })
      .then((res) => {
        if (res && res.code === 6000) {
          setFalseData(res.message);

          setState(false);
          setImportTipsVisible(true);
          return Promise.resolve();
        }
        message.error(res.message);
        return Promise.reject();
      })
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
      });
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="导入应力弧垂表"
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => setState(false)}
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
              accept=".zip"
              uploadFileBtn
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileFn={saveLineStreesSagEvent}
            />
          </CyFormItem>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        width="650px"
        title="提示信息"
        visible={importTipsVisible}
        onCancel={() => setImportTipsVisible(false)}
      >
        <div style={{ width: '100%', overflow: 'auto', height: 'auto' }}>
          <pre>{falseData}</pre>
        </div>
      </Modal>
    </>
  );
};

export default SaveImportLineStressSag;
