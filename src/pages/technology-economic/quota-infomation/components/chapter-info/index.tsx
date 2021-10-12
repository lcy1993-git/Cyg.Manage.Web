import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { EditOutlined, ExportOutlined } from '@ant-design/icons';
import styles from './index.less';
import WangEditor from '../wang-editor';
import {
  saveQuotaLibraryCatalogDescription,
  UploadChapterDescriptionFiles,
} from '@/services/technology-economic';
import FileUpload from '@/components/file-upload';
import { useBoolean } from 'ahooks';
import { baseUrl } from '@/services/common';
import ManualPreview from '@/pages/backstage-config/manual-management/components/manual-preview';
interface Props {
  data: string;
  id: string;
  update: () => void;
}

const ChapterInfo: React.FC<Props> = ({ data, id, update }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [html, setHtml] = useState<string>(data);
  const [file, setFile] = useState<any[]>([]);
  const [docx, setDocx] = useState<any[]>([]);
  const [
    triggerUploadFile,
    { toggle: toggleUploadFile, setTrue: setUploadFileTrue, setFalse: setUploadFileFalse },
  ] = useBoolean(false);

  const saveData = () => {
    saveQuotaLibraryCatalogDescription({ id, chapterDescription: html });
    setModalVisible(false);
    setHtml('');
    setTimeout(() => {
      update();
    }, 500);
  };

  const onChange = async (val: any) => {
    if (val.length !== 0) {
      setFile(val);
    } else {
      setFile([]);
    }
  };

  const downFile = (id: string) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      `${baseUrl.upload}/Download/GetFileById?fileId=${id}&token=${
        localStorage.getItem('Authorization') as string
      }`,
      true,
    ); // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob'; // 返回类型blob
    xhr.setRequestHeader('Authorization',   localStorage.getItem('Authorization') as string);
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        // @ts-ignore
        var res = e.target.response;
        // @ts-ignore
        setDocx([res]);
      }
    };
    xhr.send();
  };
  const uploadFile = async () => {
    await UploadChapterDescriptionFiles({
      files: file,
      quotaLibraryCatalogId : window.location.search.split('=')[1] ?? '',
    });
    setUploadModalVisible(false);
  };
  const showSuccess = (html:string)=>{
    setHtml(html)
  }
  useEffect(() => {
    setDocx([])
    if (data === '') return
    downFile(data);
  }, [data]);
  useEffect(()=>{
    console.log(html)
  },[html])
  return (
    <div className={styles.chapterInfoWrap}>
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => setUploadModalVisible(true)}>
          <ExportOutlined />
          导入说明
        </Button>
        <Button type="primary" className="mr7" onClick={() => setModalVisible(true)}>
          <EditOutlined />
          编辑
        </Button>
      </div>
      {docx.length === 0 ? <div/> : <ManualPreview file={docx} fileTitle={``} showDirectory={false} onSuccess={showSuccess}/>}
      <Modal
        visible={modalVisible}
        title="编辑-章节说明"
        width="80%"
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        onOk={saveData}
      >
        <WangEditor getHtml={setHtml} html={html}/>
      </Modal>
      <Modal
        visible={uploadModalVisible}
        title="导入-章节说明"
        width="30%"
        destroyOnClose={true}
        onCancel={() => setUploadModalVisible(false)}
        onOk={uploadFile}
      >
        <FileUpload
          accept=".zip,.docx,.doc"
          uploadFileBtn={false}
          trigger={triggerUploadFile}
          onChange={onChange}
          maxCount={1}
        />
      </Modal>
    </div>
  );
};

export default ChapterInfo;
