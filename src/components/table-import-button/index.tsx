import React, { useState } from 'react';
import { Button, ButtonProps, Modal, Form, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import CyFormItem from '../cy-form-item';
import FileUpload from '../file-upload';
import { commonUpload } from '@/services/common';
import { checkHasUploadFile } from '@/utils/common-rule';
import {commonlyTableTemplate} from "@/services/technology-economic/project-list";

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
  template?: boolean
  downType?: number
}

const TableImportButton: React.FC<TableImportButtonProps> = (props) => {
  const {
    importUrl = '',
    accept,
    template,
    downType,
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
  const downLoad = async () => {
    const res = await commonlyTableTemplate({commonlyTableType:downType});
    let blob = new Blob([res], {
      type: `application/xlsx`,
    });
    let finallyFileName = `模板.xlsx`;
    //for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, finallyFileName);
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', finallyFileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }
    message.success('下载成功');
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
        <Button
          style={{display: template ? 'block' : 'none'}}
          className="mr5"
          type="primary"
          onClick={() => {
            downLoad();
          }}
        >
          下载模板
        </Button>
        <br/>
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
