import FileUpload from '@/components/file-upload';
import React, { useState } from 'react';

import styles from './index.less';
import Modal from 'antd/lib/modal';
import ManualPreview from '@/pages/backstage-config/manual-management/components/manual-preview';
import GeneralTable from '@/components/general-table';
import {Button, message, Space, Spin } from 'antd';
import {
  getLatestInstructions,
  instructionsCreate,
  uploadCreate,
} from '@/services/system-config/manual-management';
import { useMount } from 'ahooks';
import { baseUrl } from '@/services/common';
import moment from "moment";

interface Props {
  id: number;
  tabList:{text:string,value:number}[]
}

const ManualUpload: React.FC<Props> = (props) => {
  const { id,tabList } = props;
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<any>([]);
  const [lastFile, setLastFile] = useState<{ fileName: string; fileId: string }>({
    fileId: '',
    fileName: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpinning, setSpinning] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const upLoadFn = async () => {};
  const handleOk = async () => {
    setIsModalVisible(false);
    setSpinning(true);
    const res = await uploadCreate({
      category: id,
      file: file,
    });
    await instructionsCreate({
      category: id,
      fileId: res.value,
      fileName: res.text,
    });
    setSpinning(false);
    message.success('上传成功!');
    getLastFile();
    // @ts-ignore
    tableRef.current.refresh();
  };
  const columns = [
    {
      dataIndex: 'fileName',
      index: 'fileName',
      title: '文件名称',
    },
    {
      dataIndex: 'createdByUserName',
      index: 'createdByUserName',
      title: '操作人员',
      width: 150,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '操作时间',
      width: 150,
      render(v: string) {
        return moment(v).format('YYYY-MM-DD HH:MM:SS')
      }
    },
  ];
  const onChange = async (val: any) => {
    if (val.length !== 0) {
      setFile(val);
      setShowFooter(true)
      setIsModalVisible(true)
    } else {
      setFile([]);
    }
  };
  const downFile = () => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${baseUrl.upload}/Download/GetFileById?fileId=${lastFile.fileId}`, true); // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob'; // 返回类型blob
    xhr.setRequestHeader('Authorization', localStorage.getItem('Authorization') as string);
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        // @ts-ignore
        var res = e.target.response;
        // @ts-ignore
        setFile([res]);
        setSpinning(false);
        setIsModalVisible(true);
      }
    };
    xhr.send();
  };
  const getLastFile = async () => {
    const res = await getLatestInstructions(id);
    if (res) {
      setLastFile({
        fileName: res.fileName,
        fileId: res.fileId,
      });
    }
  };
  const showLast = () => {
    setFile([])
    setShowFooter(false)
    setSpinning(true);
    downFile();
  };
  useMount(() => {
    getLastFile();
  });
  return (
    <Spin tip="waiting... " spinning={isSpinning}>
      <div className={styles.content}>
        <div className={styles.title}>说明书管理</div>
        <h4 className={styles.current}>
          当前说明书 :
          <span className={styles.currnetName} onClick={showLast}>
            {lastFile.fileName}
          </span>
        </h4>
        <div className={styles.update}>
          更新说明书&nbsp;:&nbsp;
          <div className={styles.updateChild}>
            <FileUpload
              hideFileList
              trigger={false}
              onChange={onChange}
              uploadFileFn={upLoadFn}
              maxCount={1}
              accept=".docx"
            />
          </div>
        </div>
        <GeneralTable
          ref={tableRef}
          extractParams={{
            category: id,
          }}
          needCommonButton={false}
          requestSource={'project'}
          columns={columns}
          url="/Instructions/GetPagedList"
          tableTitle="历史记录"
          notShowSelect
        />
        <Modal
          title="说明书预览"
          visible={isModalVisible}
          width={'90%'}
          footer={null}
          destroyOnClose
          onCancel={() => setIsModalVisible(false)}
        >
          <ManualPreview file={file} fileTitle={`${tabList.find(item=>item.value==id)?.text ?? ''}说明书`}/>
          <div style={{display:showFooter ? 'flex' : 'none',justifyContent:'right',marginTop:'15px'}}>
            <Space>
              <Button onClick={()=>setIsModalVisible(false)}>取消</Button>
              <Button type={'primary'} onClick={handleOk}>确定</Button>
            </Space>
          </div>
        </Modal>
      </div>
    </Spin>
  );
};

export default ManualUpload;
