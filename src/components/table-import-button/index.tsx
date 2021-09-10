import React, { useState } from 'react';
import { Button, ButtonProps, Modal, Form, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import CyFormItem from '../cy-form-item';
import FileUpload from '../file-upload';
import { commonUpload } from '@/services/common';
import { checkHasUploadFile } from '@/utils/common-rule';

interface TableImportButtonProps extends ButtonProps {
  importUrl: string;
  extraParams?: object;
  modalTitle?: string;
  accept?: string;
  name?: string;
  labelTitle?: string;
  buttonTitle?: string;
  requestSource?: 'project' | 'resource' | 'upload' | 'tecEco1' | 'tecEco';
  postType?: 'body' | 'query';
  setSuccessful?: (e: boolean) => void;
}

const TableImportButton: React.FC<TableImportButtonProps> = (props) => {
  const {
    importUrl = '',
    accept,
    modalTitle = '导入',
    labelTitle = '导入',
    name = 'file',
    buttonTitle = '导入',
    extraParams,
    requestSource = 'project',
    postType = 'body',
    setSuccessful,
    ...rest
  } = props;

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [form] = Form.useForm();

  const cancelImport = () => {
    form.resetFields();
    setImportModalVisible(false);
  };

  const sureImport = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      await commonUpload(importUrl, file, name, requestSource, extraParams);
      message.success('导入成功');
      setSuccessful && setSuccessful(true);
      setImportModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Button
        {...rest}
        onClick={() => {
          setImportModalVisible(true);
        }}
      >
        <ExportOutlined />
        <span>{buttonTitle}</span>
      </Button>
      <Modal
        maskClosable={false}
        title={modalTitle}
        visible={importModalVisible}
        cancelText="取消"
        okText="确认"
        onOk={() => sureImport()}
        onCancel={() => cancelImport()}
        destroyOnClose
      >
        <Form form={form} preserve={false}>
          <CyFormItem
            label={labelTitle}
            name="file"
            required
            rules={[{ validator: checkHasUploadFile }]}
          >
            <FileUpload accept={accept} maxCount={1} />
          </CyFormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default TableImportButton;
