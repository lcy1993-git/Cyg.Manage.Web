import React, { useRef } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import styles from './index.less';
import FileUpLoad from '@/components/file-upload-online';
import { Button } from 'antd';
const BasicData: React.FC = () => {
  return (
    <div className={styles.basicData}>
      <PageCommonWrap>
        <CommonTitle>静态文件</CommonTitle>
        <FileUpLoad action="/Upload/StaticFile"></FileUpLoad>
      </PageCommonWrap>
      <PageCommonWrap>
        <CommonTitle>权限</CommonTitle>
        <FileUpLoad action="/Upload/StaticFile"></FileUpLoad>
        <Button>导出权限</Button>
        <Button>选择文件</Button>
        <Button>开始导入</Button>
      </PageCommonWrap>
    </div>
  );
};

export default BasicData;
