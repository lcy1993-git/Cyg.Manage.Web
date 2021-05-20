import React, { useEffect, useState } from 'react';
import { Upload, UploadProps } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import FileUploadShowItem from '../file-upload-show-item';
import FileUploadProcess from '../file-upload-process';
/**
 *  组件功能设计需求：
 *  1. 公司需要的upload功能简单封装。
 *  2. 让使用的人可以用formItem直接获取到数据进行保存
 *  @param
 *  @param
 * */

const { Dragger } = Upload;

interface FileUploadProps extends UploadProps {
  onChange?: (value: any) => {};
  maxSize?: number;
  maxCount?: number;
  uploadFileBtn?: boolean; //是否file和表单捆绑上传
  trigger?: boolean; //在file和表单捆绑上传的情况下，需要在提交表单的触发进度条,true就没有开始上传按钮
  process?: boolean; //是否需要进度条
  uploadFileFn?: () => Promise<void>;
}

export type UploadStatus = 'hasNotStarted' | 'start' | 'success' | 'error' | 'delete';

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const {
    onChange,
    maxSize = 16,
    maxCount,
    uploadFileFn,
    trigger = false,
    process = true,
    uploadFileBtn = false,
    ...rest
  } = props;
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('hasNotStarted');
  const [fileSize, setFileSize] = useState<'large' | 'medium' | 'small'>('medium');
  const [fileList, setFileList] = useState<any[]>([]);

  const beforeUploadEvent = (file: any) => {
    // const isBeyoundSize = file.size / 1024 / 1024 / 1024 < maxSize;
    // if (!isBeyoundSize) {
    //   message.error(`${file.name}大小超出限制${maxSize}MB，请修改后重新上传`);
    //   return isBeyoundSize;
    // }

    // 如果maxCount 是1的时候，那么就要随时把上传的替换成最新的哪一个
    //判断大小控制process的速度

    if (maxCount && maxCount == 1) {
      const newArray: any[] = [];
      newArray.push(file);
      let size = newArray.reduce((pre, cur) => cur.size + pre, 0) / 1000000;

      if (size < 50) {
        setFileSize('small');
      } else if (size < 150 && size > 50) {
        setFileSize('medium');
      } else {
        setFileSize('large');
      }
      setFileList(newArray);
      onChange?.(newArray);
      return false;
    }

    const copyFileList = [...fileList];
    copyFileList.push(file);
    let size = fileList.reduce((pre, cur) => cur.size + pre, 0) / 1000000;

    if (size < 50) {
      setFileSize('small');
    } else if (size < 150 && size > 50) {
      setFileSize('medium');
    } else {
      setFileSize('large');
    }
    // 文件大小检验
    setFileList(copyFileList);
    onChange?.(copyFileList);

    return false;
  };

  useEffect(() => {
    if (trigger && fileList.length !== 0) {
      uploadItem();
    }
  }, [trigger, fileList.length]);
  const onFileChange = () => {
    setUploadStatus('hasNotStarted');
  };
  const params = {
    ...rest,
    beforeUpload: beforeUploadEvent,
    showUploadList: false,
    onChange: onFileChange,
  };

  const deleteUploadItem = (uid: string) => {
    setUploadStatus('delete');
    const copyFileList = [...fileList];
    const thisDataIndex = copyFileList.findIndex((item: any) => item.uid === uid);
    if (thisDataIndex > -1) {
      copyFileList.splice(thisDataIndex, 1);
      setFileList(copyFileList);
      onChange?.(copyFileList);
    }
  };

  const uploadItem = () => {
    setUploadStatus('start');
    uploadFileFn?.().then(
      () => {
        setUploadStatus('success');
      },
      (res) => {
        setUploadStatus('error');
      },
    );
  };

  const hasUploadFileShow = fileList.map((file) => {
    return (
      <FileUploadShowItem
        deleteEvent={deleteUploadItem}
        uploadEvent={uploadItem}
        uploadFileBtn={uploadStatus === 'success' ? false : uploadFileBtn}
        uid={file.uid}
        name={file.name}
        key={file.uid}
      />
    );
  });

  return (
    <div className={styles.fileUploadContent}>
      <Dragger {...params}>
        <div>
          <div className={styles.fileUploadTip}>
            <CloudUploadOutlined className={styles.fileUploadIcon} />
            <span>添加文件或拖放文件上传</span>
          </div>
        </div>
      </Dragger>

      <div className={styles.uploadProcess}>
        <div className={styles.hasUploadFile}>{hasUploadFileShow}</div>
        {process &&
        (uploadStatus === 'start' || uploadStatus === 'error' || uploadStatus === 'success') ? (
          <FileUploadProcess fileSize={fileSize} status={uploadStatus} />
        ) : null}
      </div>
    </div>
  );
};

export default FileUpload;
