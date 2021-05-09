import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadBulkProject } from '@/services/project-management/all-project';
import BulkImportProject from '../bulk-import-project';

interface UploadAddProjectProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  defaultSelectType?: string;
}

const UploadAddProjectModal: React.FC<UploadAddProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [bulkImportModalVisible, setBulkImportModalVisible] = useState<boolean>(false);
  const [excelModalData, setExcelModalData] = useState<any>();
  const [requestLoading, setRequestLoading] = useState(false);

  const [form] = Form.useForm();
  const [batchAddForm] = Form.useForm();

  const closeModalEvent = () => {
    setState(false);
  };

  //下载excel批量立项模板
  const downloadModalFileEvent = () => {};

  //传入上传后获取到的List
  const saveBatchAddListEvent = () => {
    form.validateFields().then(async (values) => {
      const { file } = values;
      if (file == undefined) {
        message.warning('您还未上传批量立项模板文件');
        return;
      }
      setRequestLoading(true);
      const res = await uploadBulkProject(file, 'project', '/Porject/ResolveImportData');
      setExcelModalData(res);
      message.success('导入成功');
      setState(false);
      setBulkImportModalVisible(true);
      setRequestLoading(false);
    });
  };

  //批量上传
  const saveBatchAddProjectEvent = () => {
    batchAddForm.validateFields().then(async (values) => {
    //   console.log(values);

      try {
        setRequestLoading(true);
      } catch (msg) {
        console.log(msg);
      } finally {
        setRequestLoading(false);
      }
    });
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="批量立项"
        width={720}
        visible={state as boolean}
        footer={[
          <Button
            loading={requestLoading}
            key="open"
            type="primary"
            onClick={() => saveBatchAddListEvent()}
          >
            确认
          </Button>,
        ]}
        onCancel={() => closeModalEvent()}
        // afterClose={() => {
        //   setBulkImportModalVisible(true);
        // }}
      >
        <Form form={form}>
          <CyFormItem
            label="您可以通过下载excel模板，在模板中填写相关工程/项目信息，并且上传填写后的模板的形式进行批量创建项目；"
            labelWidth={720}
            required
          ></CyFormItem>
          <CyFormItem label="下载模板" labelWidth={100} required>
            <Button
              type="primary"
              style={{ width: '100px' }}
              onClick={() => downloadModalFileEvent()}
            >
              <a href={'/template/project.xlsx'} download="批量立项模板文件.xlsx">
                点击下载
              </a>
            </Button>
          </CyFormItem>
          <CyFormItem
            labelWidth={100}
            label="上传文件"
            name="file"
            valuePropName="fileList"
            required
          >
            <FileUpload maxCount={1} />
          </CyFormItem>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        width="98%"
        bodyStyle={{ height: 700 }}
        centered
        title="立项批量导入"
        visible={bulkImportModalVisible}
        okText="保存"
        onOk={() => saveBatchAddProjectEvent()}
        onCancel={() => setBulkImportModalVisible(false)}
      >
        <BulkImportProject batchAddForm={batchAddForm} excelModalData={excelModalData} />
      </Modal>
    </>
  );
};

export default UploadAddProjectModal;
