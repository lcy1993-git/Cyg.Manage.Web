import React from 'react';
import { Menu, Button, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { commonExport } from '@/services/common';

interface TableExportButtonProps {
  selectIds?: string[];
  exportUrl: string;
  extraParams?: object;
  fileName?: string;
}

const TableExportButton: React.FC<TableExportButtonProps> = (props) => {
  const { selectIds = [], exportUrl = '', extraParams, fileName = '表格' } = props;

  const exportChoosedRow = async () => {
    if (selectIds && selectIds.length === 0) {
      message.error('请选择需要导出的行');
      return;
    }
    const res = await commonExport(exportUrl, extraParams, selectIds);
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

  const exportAllRow = async () => {
    const res = await commonExport(exportUrl, extraParams, []);
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

  const importButoonMenu = (
    <Menu>
      <Menu.Item onClick={() => exportChoosedRow()}>导出所选</Menu.Item>
      <Menu.Item onClick={() => exportAllRow()}>导出所有</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={importButoonMenu}>
      <Button>
        导出 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default TableExportButton;
