import { message, Progress } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import { UploadStatus } from '../file-upload';
import _ from 'lodash';
export interface FileUploadProcessProps {
  status: UploadStatus;
  fileSize: 'small' | 'medium' | 'large';
}
const FileUploadProcess: FC<FileUploadProcessProps> = (props) => {
  const { status, fileSize } = props;
  const [percent, setPercent] = useState<number>(0);
  const [interval, setInterval] = useState<number | undefined>(500);

  useEffect(() => {
    if (status === 'start') {
      setInterval(500);
    }
  }, [status]);

  const medium = () => {
    if (percent <= 50) {
      setPercent(percent + _.random(8, 15));
    } else if (percent >= 50 && percent < 70) {
      setPercent(percent + _.random(8, 12));
    } else if (percent <= 95 && percent >= 70) {
      setPercent(percent + _.random(5, 10));
    } else if (percent >= 85) {
      setPercent(99);
    }
  };

  const small = () => {
    setPercent(80);
  };

  const large = () => {
    if (percent <= 50) {
      setPercent(percent + _.random(0, 10));
    } else if (percent >= 50 && percent < 70) {
      setPercent(percent + _.random(0, 15));
    } else if (percent <= 95 && percent >= 70) {
      setPercent(percent + _.random(0, 5));
    } else if (percent >= 95) {
      setPercent(99);
    }
  };

  useInterval(
    () => {
      if (status === 'success') {
        setInterval(0);
        setPercent(100);
      } else if (status === 'error') {
        setInterval(undefined);
        message.warn('上传失败');
        setPercent(0);
      } else {
        if (fileSize === 'large') {
          large();
        } else if (fileSize === 'small') {
          small();
        } else {
          medium();
        }
      }
    },
    interval,
    { immediate: true },
  );

  return (
    <Progress
      strokeColor={{
        from: '#108ee9',
        to: '#87d068',
      }}
      percent={percent}
      size="small"
      status={status === 'success' ? 'success' : 'exception'}
    />
  );
};

export default FileUploadProcess;
