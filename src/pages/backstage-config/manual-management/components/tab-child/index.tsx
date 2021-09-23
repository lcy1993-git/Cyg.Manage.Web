import FileUpload from '@/components/file-upload';
import React, {useRef, useState} from 'react';

import styles from './index.less'
import Modal from 'antd/lib/modal';
import ManualPreview from "@/pages/backstage-config/manual-management/components/manual-preview";
import GeneralTable from "@/components/general-table";
import {message, Spin} from 'antd';
import {getLatestInstructions, instructionsCreate, uploadCreate } from '@/services/system-config/manual-management';
import {useMount} from "ahooks";
import {baseUrl} from "@/services/common";

interface Props {
  id: number
}

const ManualUpload: React.FC<Props> = (props) => {
  const {id} = props
  const tableRef = React.useRef<HTMLDivElement>(null);
  const childRef = useRef()
  const [file, setFile] = useState([])
  const [lastFile, setLastFile] = useState<{ fileName: string, fileId: string,}>({ fileId:'',fileName:''})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpinning, setSpinning] = useState(false);
  const upLoadFn = async () => {

  };
  const handleOk = async () => {
    setIsModalVisible(false)
    // @ts-ignore
    tableRef.current.refresh()
  }
  const columns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '公司编号',
      width: 150,
    },
    {
      dataIndex: 'provinceName',
      index: 'provinceName',
      title: '区域',
      width: 150,
    },
    {
      dataIndex: 'companyName',
      index: 'companyName',
      title: '所属公司',
      width: 200,
    },
    {
      dataIndex: 'countyCompany',
      index: 'countyCompany',
      title: '所属县公司',
      width: 200,
    },
    {
      dataIndex: 'powerSupply',
      index: 'powerSupply',
      title: '供电所/班组',
      width: 200,
    },
  ];
  const onChange = async (val:any)=>{
    if (val.length !== 0){
      setSpinning(true)
      setFile(val)
      const res = await uploadCreate({
        category: id, file:val
      })
      await instructionsCreate({
        category:id,
        fileId:res.value,
        fileName:res.text
      })
      setSpinning(false)
      message.success('上传成功!')
      setIsModalVisible(true);
      getLastFile()
    } else {
      setFile([])
    }
  }
  const downFile =  ()=>{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${baseUrl.upload}/Download/GetFileById?fileId=${lastFile.fileId}`, true,);    // 也可以使用POST方式，根据接口
    xhr.responseType = "blob";  // 返回类型blob
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
        setFile([res])
        setSpinning(false)
        setIsModalVisible(true)
      }
    }
    xhr.send()
  }
  const getLastFile = async ()=>{
    const res = await getLatestInstructions(id)
    if (res) {
      setLastFile({
        fileName:res.fileName,
        fileId:res.fileId
      })
    }
  }
  const showLast = ()=>{
    setSpinning(true)
    downFile()
  }
  useMount(()=>{
    getLastFile()
  })
  return (
    <Spin tip="加载中... " spinning={isSpinning}>
      <div className={styles.content}>
        <div className={styles.title}>说明书管理</div>
        <h4 className={styles.current}>当前说明书 :<span className={styles.currnetName} onClick={showLast}>{lastFile.fileName}</span></h4>
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
            "category": id,
          }}
          needCommonButton={true}
          requestSource={'project'}
          columns={columns}
          url="/Instructions/GetPagedList"
          tableTitle="历史记录"
          type="radio"
        />
        <Modal
          title="说明书预览"
          visible={isModalVisible}
          okText={'确定'}
          cancelText={'取消'}
          onOk={handleOk}
          width={'90%'}
          destroyOnClose
          onCancel={() => setIsModalVisible(false)}>
          <ManualPreview file={file} />
        </Modal>
      </div>
    </Spin>
  );
};

export default ManualUpload;
