import FileUpload from '@/components/file-upload';
import React, {useState} from 'react';

import styles from './index.less'
import {uploadCompanyFile} from "@/services/operation-config/company-file";
import {createEngineerFile} from "@/services/project-management/all-project";
import Modal from 'antd/lib/modal';
import ManualPreview from "@/pages/backstage-config/manual-management/components/manual-preview";
import GeneralTable from "@/components/general-table";

interface Props {
  id: number
}

const ManualUpload: React.FC<Props> = (props) => {
  const {id} = props
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string>('测试说明书12345667899')
  const [fileList, setFileList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const upLoadFn = async () => {
    const fileId = await uploadCompanyFile(
      fileList,
      {},
      '/Upload/CompanyFile',
    );
    console.log('123')
    createEngineerFile({
      fileId,
      category: 1,
      id
    }).then(() => {
      console.log('sss')
    }).finally(() => {
      console.log('bbb')
    });
  };
  const show = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }
  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };
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
  return (
      <div className={styles.content}>
        <div className={styles.title}>说明书管理</div>
        <h4 className={styles.current}>当前说明书 :<span className={styles.currnetName} onClick={()=>setIsModalVisible(true)}>{current}</span></h4>
        <div className={styles.update}>
          更新说明书&nbsp;:&nbsp;
          <div className={styles.updateChild}>
            <FileUpload
              trigger={true}
              uploadFileFn={upLoadFn}
              maxCount={1}
              accept=".docx"/>
          </div>
        </div>
        <GeneralTable
          ref={tableRef}
          needCommonButton={true}
          columns={columns}
          url="/ElectricityCompany/GetPagedList"
          tableTitle="说明书预览"
          type="radio"
        />
        <Modal
          title="说明书预览"
          visible={isModalVisible}
          okText={'确认'}
          cancelText={'取消'}
          onOk={handleOk}
          width={'90%'}
          onCancel={() => setIsModalVisible(false)}>
          <ManualPreview/>
        </Modal>
      </div>
  );
};

export default ManualUpload;
