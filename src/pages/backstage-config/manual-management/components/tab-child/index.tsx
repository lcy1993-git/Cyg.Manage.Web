import FileUpload from '@/components/file-upload';
import React, {useState} from 'react';

import styles from './index.less'
import {uploadCompanyFile} from "@/services/operation-config/company-file";
import {createEngineerFile} from "@/services/project-management/all-project";
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import ManualPreview from "@/pages/backstage-config/manual-management/components/manual-preview";

interface Props {
  id: string
}

const ManualUpload: React.FC<Props> = (props) => {
  const {id} = props
  const [current, setCurrent] = useState<string>('测试说明书12345667899')
  const [fileList, setFileList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const upLoadFn = async () => {
    const fileId = await uploadCompanyFile(
      fileList,
      {},
      '/Upload/CompanyFile',
    );
    console.log('123')
    createEngineerFile({
      fileId,
      category: 1,
      id
    }).then(() => {
      console.log('sss')
    }).finally(() => {
      console.log('bbb')
    });
  };
  const show = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {

  }
  return (
    <div className={styles.content}>
      <div className={styles.title}>说明书管理</div>
      <h4 className={styles.current}>当前说明书 :<span className={styles.currnetName}>{current}</span></h4>
      <div className={styles.update}>
        更新说明书&nbsp;:&nbsp;
        <div className={styles.updateChild}>
          <FileUpload
            trigger={true}
            uploadFileFn={upLoadFn}
            maxCount={1}
            accept=".docx"/>
          <Button type='primary' onClick={show}>显示</Button>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}>
        <ManualPreview/>
      </Modal>
    </div>
  );
};

export default ManualUpload;
