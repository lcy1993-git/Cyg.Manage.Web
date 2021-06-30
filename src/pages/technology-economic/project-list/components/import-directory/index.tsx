import React from 'react';
import { Input, Select, Col, Row, Button } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';

const { Option } = Select;
interface ResponsData {}

const ImportDirectory: React.FC<ResponsData> = () => {
  return (
    <>
      {/* <CyFormItem label="版本" name="version">
        <Button
          className="mr7"
          type="primary"
          onClick={() => {
            // TODO
          }}
        >
          下载模板
        </Button>
      </CyFormItem> */}
      <CyFormItem label="上传文件" name="file" required>
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  );
};

export default ImportDirectory;
