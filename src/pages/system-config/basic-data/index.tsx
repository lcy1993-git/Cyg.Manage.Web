import React, { useState } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import styles from './index.less';
import FileUpLoad from '@/components/file-upload';
import { Button, Form, message } from 'antd';
import { ExportOutlined, UploadOutlined } from '@ant-design/icons';
import { commonUpload } from '@/services/common';
const BasicData: React.FC = () => {
  const [assestsForm] = Form.useForm();
  const [jurisdictionForm] = Form.useForm();
  const [assestsUploadLoading, setAssestsUploadLoading] = useState<boolean>(false)

  const uploadAssests = () => {
    assestsForm.validateFields().then(async (values) => {
      const { assestsFile } = values;

      await commonUpload("/Upload/StaticFile", assestsFile, "file", "upload");
      message.success('上传成功');
      assestsForm.resetFields();
    })
  }

  const uploadJurisdictionFile = () => {
    //TODO  不知道上传的接口和导出的接口
  }

  return (
    <PageCommonWrap>
      <div className={styles.basicPage}>
        <div className={styles.assestsUpload}>
          <CommonTitle>静态文件</CommonTitle>
          <Form form={assestsForm}>
            <Form.Item name="assestsFile" rules={[{ required: true, message: "请至少上传一个文件" }]}>
              <FileUpLoad />
            </Form.Item>
          </Form>
          <div className={styles.basicPageButtonContent}>
            <Button type="primary" onClick={() => uploadAssests()}>
              <UploadOutlined />
             开始上传
           </Button>
          </div>
        </div>
        <div className={styles.jurisdictionUpload}>
          <CommonTitle>权限</CommonTitle>
          <Form form={jurisdictionForm}>
            <Form.Item noStyle name="jurisdictionFile" rules={[{ required: true, message: "请至少上传一个文件" }]}>
              <FileUpLoad maxCount={1} />
            </Form.Item>
          </Form>
          <div className={styles.basicPageButtonContent}>
            <Button className="mr7">
              <ExportOutlined />
              导出权限
            </Button>
            <Button type="primary">
              <UploadOutlined />
              开始上传
           </Button>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default BasicData;
