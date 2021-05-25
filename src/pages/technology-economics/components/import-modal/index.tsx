import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { newUploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface SaveImportLibProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const SaveImportLib: React.FC<SaveImportLibProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId = '', requestSource, changeFinishEvent } = props;
  const [requestLoading, setRequestLoading] = useState(false);
  // const [falseData, setFalseData] = useState<string>('');
  // const [importTipsVisible, setImportTipsVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const saveImportLibEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;

        setRequestLoading(true);
        return newUploadLineStressSag(file, { libId }, requestSource, '/ResourceLib/SaveImport');
      })

      .then((res) => {
        if (res && res.code === 6000) {
          message.success(res.message)
          // setFalseData(res.message);
         
          setState(false);
          // setImportTipsVisible(true);
          return Promise.resolve();
        }
        message.error(res.message);
        return Promise.reject();
      })
      .finally(() => {
        changeFinishEvent?.();
        setUploadFileFalse();
        setRequestLoading(false);
      });
  };

  const onSave = () => {
    setUploadFileTrue();
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="导入"
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={requestLoading}
            onClick={() => setState(false)}
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
              trigger={triggerUploadFile}
              maxCount={1}
              uploadFileBtn
              uploadFileFn={saveImportLibEvent}
            />
          </CyFormItem>
        </Form>
      </Modal>
      {/* <Modal
        maskClosable={false}
        footer=""
        width="650px"
        title="提示信息"
        visible={importTipsVisible}
        onCancel={() => setImportTipsVisible(false)}
      >
        <div style={{ width: '100%', overflow: 'auto', height: '450px' }}>
          <pre>{falseData}</pre>
        </div>
      </Modal> */}
    </>
  );
};

export default SaveImportLib;