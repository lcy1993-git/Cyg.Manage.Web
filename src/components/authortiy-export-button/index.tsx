import React from 'react';
import { Button, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { exportAuthority } from '@/services/common';

interface TableExportButtonProps {
  exportUrl: string;
  extraParams?: object;
  fileName?: string;
  labelName?: string;
  type?: 'post' | 'get';
}

const ExportAuthorityButton: React.FC<TableExportButtonProps> = (props) => {
  const {
    exportUrl = '',
    extraParams,
    fileName = '系统权限',
    labelName = '导出权限',
    type = 'post',
  } = props;

  const authorityExportEvent = async () => {
    const res = await exportAuthority(exportUrl, extraParams, type);
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });
    let finalyFileName = `${fileName}.xlsx`;
    // for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', finalyFileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
    message.success('导出成功');
  };

  return (
    <Button className="mr7" onClick={() => authorityExportEvent()}>
      <ExportOutlined />
      {labelName}
    </Button>
  );
};

export default ExportAuthorityButton;
