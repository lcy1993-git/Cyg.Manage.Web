import { CloudUploadOutlined, DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import React from 'react';
import styles from './index.less';

export type UploadStatusType = 'error' | 'normal';

interface FileUploadShowItemProps {
  name: string;
  uid: string;
  deleteEvent: (uid: string) => void;
  uploadEvent: () => void;
  status?: 'error' | 'normal';
  compositional: boolean;
}

const FileUploadShowItem: React.FC<FileUploadShowItemProps> = (props) => {
  const { name, uid, deleteEvent, uploadEvent, compositional, status = 'normal' } = props;

  const deleteFunction = () => {
    deleteEvent?.(uid);
  };

  const uploadFunction = () => {
    uploadEvent?.();
  };

  const statusClassName = status === 'normal' ? '' : styles.error;

  return (
    <>
      <div className={`${styles.hasUploadFileShowItem} ${statusClassName}`}>
        <div className={styles.hasUploadFileShowItemNameContent}>
          <LinkOutlined className={styles.hasUploadFileShowItemNameIcon} />
          <span className={styles.hasUploadFileShowItemName}>{name}</span>
        </div>
        <div className={styles.hasUploadFileShowItemControl}>
          {/* TODO 重命名功能 */}
          {/* <span className={styles.renameButton}>
                    <span className={styles.controlButtonIcon}>
                        <EditOutlined />
                    </span>
                    <span>
                        重命名
                    </span>
                </span> */}

          {compositional ? (
            <span className={styles.uploadButton} onClick={() => uploadFunction()}>
              <span className={styles.controlButtonIcon}>
                <CloudUploadOutlined />
              </span>
              <span>开始上传</span>
            </span>
          ) : null}

          <span className={styles.deleteButton} onClick={() => deleteFunction()}>
            <span className={styles.controlButtonIcon}>
              <DeleteOutlined />
            </span>
            <span>删除</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default FileUploadShowItem;
