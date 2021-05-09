import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import FileUploadOnline from '@/components/file-upload-online';

interface UploadAddProjectProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  defaultSelectType?: string;
}

const UploadAddProjectModal: React.FC<UploadAddProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [excelModalData, setExcelModalData] = useState<any>();
  const [requestLoading, setRequestLoading] = useState(false);

  //   const { engineerId, areaId, company, changeFinishEvent, companyName } = props;

  const closeModalEvent = () => {
    setState(false);
  };

  const saveBatchAddProjectEvent = () => {};

  const downloadModalFileEvent = () => {
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="批量立项"
        width={720}
        visible={state as boolean}
        footer={[
          <Button key="open" type="primary" onClick={() => saveBatchAddProjectEvent()}>
            确认
          </Button>,
        ]}
        onCancel={() => closeModalEvent()}
      >
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
            下载
          </Button>
        </CyFormItem>
        <CyFormItem labelWidth={100} label="上传文件" required>
          <FileUploadOnline action="" maxCount={1} />
        </CyFormItem>
      </Modal>
    </>
  );
};

export default UploadAddProjectModal;
