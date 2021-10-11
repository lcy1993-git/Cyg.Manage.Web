import {
  createEngineerFile,
  delEngineerFile,
  GetEngineerFileGetList,
} from '@/services/project-management/all-project';
import { downLoadFileItem } from '@/services/operation-config/company-file';
import { useControllableValue, useMount } from 'ahooks';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { Button, Table } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRequest } from 'ahooks';

import FileUpload from '@/components/file-upload';

import styles from './index.less';
import { uploadCompanyFile } from '@/services/operation-config/company-file';
import moment from 'moment';

interface EditEngineerProps {
  engineerId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
}

const ApprovalProjectModal: React.FC<EditEngineerProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [fileList, setFileList] = useState([]);

  const { engineerId } = props;
  const { data = [], run } = useRequest<any[]>(() => GetEngineerFileGetList(engineerId), {
    manual: true,
  });

  const { data: keyData } = useRequest(() => getUploadUrl());

  const securityKey = keyData?.uploadCompanyFileApiSecurity;

  useMount(() => {
    run();
  });

  const handlerUpload = async (fileId: string, fileName: string) => {
    const res = await downLoadFileItem({ fileId, securityKey });
    const suffix = fileName?.substring(fileName.lastIndexOf('.') + 1);

    const blob = new Blob([res], {
      type: `application/${suffix}`,
    });
    // for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // for Non-IE
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }
    message.success('下载成功');
  };

  const handlerDel = async (id: string) => {
    delEngineerFile(id).then(() => {
      message.success('删除成功');
      run();
    });
  };

  const columns = [
    {
      title: '文档标题',
      index: 'fileName',
      dataIndex: 'fileName',
      ellipsis: true,
    },
    {
      title: '创建人',
      index: 'createdByName',
      dataIndex: 'createdByName',
      ellipsis: true,
    },
    {
      title: '创建时间',
      index: 'createdOn',
      dataIndex: 'createdOn',
      render(v: string) {
        return moment(v).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      render(t, record: any) {
        const { id, fileId, fileName } = record;
        return (
          <div className={styles.buttonArea}>
            <Button type="link" onClick={() => handlerUpload(fileId, fileName)}>
              下载
            </Button>
            <Button type="link" onClick={() => handlerDel(id)}>
              删除
            </Button>
          </div>
        );
      },
      width: 100,
    },
  ];

  const upLoadFn = async () => {
    const fileId = await uploadCompanyFile(fileList, { securityKey }, '/Upload/CompanyFile');
    createEngineerFile({
      fileId,
      category: 1,
      engineerId,
    }).then(() => run());
  };

  return (
    <Modal
      maskClosable={false}
      title="批复文件"
      width={750}
      visible={state as boolean}
      destroyOnClose={true}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          关闭
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <div className={styles.fileUploadWrap}>
        <div className={styles.improtText}>导 入</div>
        <div className={styles.fileUpload}>
          <FileUpload
            uploadFileBtn
            uploadFileFn={upLoadFn}
            maxCount={1}
            fileList={fileList}
            onChange={setFileList}
          />
        </div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </Modal>
  );
};

export default ApprovalProjectModal;
