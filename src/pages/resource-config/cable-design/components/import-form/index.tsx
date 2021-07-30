import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadLineStressSag } from '@/services/resource-config/drawing';
import { useBoolean, useControllableValue } from 'ahooks';
import React, { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Form, message, Modal, Button } from 'antd';

interface ImportChartProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  libId?: string;
  securityKey?: string;
  requestSource: 'project' | 'resource' | 'upload';
}

const ImportCableModal: React.FC<ImportChartProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { libId, requestSource, changeFinishEvent } = props;
  const [isImportFlag, setIsImportFlag] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);
  const saveImportCableEvent = () => {
    return form
      .validateFields()
      .then((values) => {
        const { file } = values;
        return uploadLineStressSag(file, { libId }, requestSource, '/CableWell/SaveImport');
      })
      .then(
        (res) => {
          setIsImportFlag(true);
          message.success('导入成功');

          return Promise.resolve();
        },
        (res) => {
          const { code, isSuccess, message: msg } = res;
          if (msg) {
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
    form.validateFields().then((value) => {
      if (isImportFlag) {
        setState(false);
        return;
      }
      message.info('您还未上传文件，点击“开始上传”上传文件');
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="680px"
      title="导入(电缆井+电缆通道)"
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
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          labelWidth={80}
          label="导入"
          name="file"
          required
          rules={[{ required: true, message: '请上传电缆设计文件' }]}
        >
          <FileUpload
            trigger={triggerUploadFile}
            maxCount={1}
            uploadFileBtn
            uploadFileFn={saveImportCableEvent}
          />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default ImportCableModal;
