import React from 'react';
import { Input, Select, Col, Row, Button, message } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { downLoadTemplate } from '@/services/technology-economic/project-list';

const { Option } = Select;
interface ResponsData {}

const ImportDirectory: React.FC<ResponsData> = () => {
  const downLoad = async () => {
    const res = await downLoadTemplate({});
    let blob = new Blob([res], {
      type: `application/xlsx`,
    });
    let finallyFileName = `模板`;
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
  return (
    <>
      <CyFormItem label="下载模板" labelWidth={100} required>
        <Button
          className="mr7"
          type="primary"
          onClick={() => {
            downLoad();
          }}
        >
          下载模板
        </Button>
      </CyFormItem>

      <CyFormItem label="上传文件" name="file" required>
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  );
};

export default ImportDirectory;
