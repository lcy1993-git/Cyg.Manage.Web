import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { newUploadLineStressSag } from '@/services/resource-config/drawing';
import { useControllableValue } from 'ahooks';
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
  const [falseData, setFalseData] = useState<string>('');
  const [importTipsVisible, setImportTipsVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const saveImportLibEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      try {
        setRequestLoading(true);
        const resData = await newUploadLineStressSag(
          file,
          { libId },
          requestSource,
          '/ResourceLib/SaveImport',
        );
        if (resData && resData.isSuccess === false) {
          setFalseData(resData.message);
          setImportTipsVisible(true);
        } else if (resData && resData.isSuccess === true) {
          message.success('导入成功');
          setState(false);
          changeFinishEvent?.();
        } else {
          message.error(resData?.message);
        }
      } catch (msg) {
        message.error(msg);
      } finally {
        setRequestLoading(false);
      }
    });
  };

  return (
    <Modal
      title="导入资源库"
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={requestLoading}
          onClick={() => saveImportLibEvent()}
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
      <Modal
        footer=""
        width="650px"
        title="提示信息"
        visible={importTipsVisible}
        onCancel={() => setImportTipsVisible(false)}
      >
        <div style={{ width: '100%', overflow: 'auto', height: '450px' }}>
          <pre>{falseData}</pre>
        </div>
      </Modal>
    </Modal>
  );
};

export default SaveImportLib;
