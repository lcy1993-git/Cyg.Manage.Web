import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import FileUpload from '@/components/file-upload';
import { uploadBulkProject } from '@/services/project-management/all-project';
import BatchEditEngineerInfoTable from '../bulk-import-project/index';
import CyTip from '@/components/cy-tip';

interface UploadAddProjectProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  defaultSelectType?: string;
  refreshEvent?: () => void;
}

const UploadAddProjectModal: React.FC<UploadAddProjectProps> = (props) => {
  const { refreshEvent } = props;
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [bulkImportModalVisible, setBulkImportModalVisible] = useState<boolean>(false);
  const [excelModalData, setExcelModalData] = useState<any>();
  const [requestLoading, setRequestLoading] = useState(false);

  const [form] = Form.useForm();

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

      // if (file[0].name.indexOf('.xlsx') == -1) {
      //   message.warning('请上传正确的Excel模板文件');
      //   setRequestLoading(false);
      //   return;
      // }
      const res = await uploadBulkProject(file, 'project', '/Porject/ResolveImportData');
      if (res.code === 5000) {
        message.error(res.message);
        setRequestLoading(false);
        return;
      }
      setExcelModalData(res);
      message.success('导入成功');
      setState(false);
      setBulkImportModalVisible(true);
      setRequestLoading(false);
      form.resetFields();
    });
  };

  useEffect(() => {
    if (state) {
      form.resetFields();
    }
  }, [state]);

  return (
    <>
      <Modal
        maskClosable={false}
        title="批量立项"
        width={720}
        visible={state as boolean}
        bodyStyle={{
          padding: 0,
        }}
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
      >
        <Form form={form}>
          <CyTip>
            您可以通过下载excel模版，在模板中填写立项相关工程/项目信息，并且上传填写后的模板的形式进行批量创建项目
          </CyTip>
          <div style={{ padding: '20px' }}>
            <CyFormItem label="下载模板" labelWidth={100}>
              <Button
                type="primary"
                style={{ width: '100px' }}
                onClick={() => downloadModalFileEvent()}
              >
                <a href={'/template/proTemp.xlsx'} download="批量立项模板文件.xlsx">
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
              <FileUpload maxCount={1} accept=".xlsx" />
            </CyFormItem>
          </div>
        </Form>
      </Modal>

      <BatchEditEngineerInfoTable
        onChange={setBulkImportModalVisible}
        visible={bulkImportModalVisible}
        excelModalData={excelModalData?.content}
        refreshEvent={refreshEvent}
      />
    </>
  );
};

export default UploadAddProjectModal;
