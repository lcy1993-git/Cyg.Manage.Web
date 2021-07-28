import { useEffect, useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal, message, Spin, Popconfirm, Form } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import styles from './index.less';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
// import RightComponent from './components/right-component';
import ImportTemplateForm from './components/import-template/inex';
import RightComponent from './components/RightComponent';
import { getEnabledAdjustmentFiles } from '@/services/technology-economic/spread-coefficient';

interface ListData {
  id: string;
  name: string;
  [key: string]: string;
}

const AdjustmentFileDetails: React.FC = () => {
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false);

  const [fileList, setFileList] = useState<File[]>([]);
  const [listData, setListData] = useState<ListData[]>([]);
  const [activeValue, setActiveValue] = useState<ListData>({ id: '', name: '' });
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const result: any = await getEnabledAdjustmentFiles();
    setListData(result);
    setActiveValue(result[0]);
  };
  // const {
  //   data: listData = [],
  //   run: listDataRun,
  //   loading: preLoading,
  // } = useRequest<ListData[]>(getRateTypeList, {
  //   manual: true,
  //   onSuccess: (res) => {
  //     setActiveValue(res[0]);
  //   },
  // });

  // useMount(() => {
  //   listDataRun();
  // });
  // const listData = [
  //   { value: '1', text: '定额【2021】4号价差调整文件' },
  //   { value: '2', text: '定额【2021】4号价差调整文件' },
  //   { value: '3', text: '定额【2021】4号价差调整文件' },
  //   { value: '4', text: '定额【2021】4号价差调整文件' },
  // ];

  const listDataElement = listData.map((item, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.id === activeValue.id ? styles.listActive : ''
        }`}
        key={item.id}
        onClick={() => setActiveValue(item)}
      >
        {item.name}
      </div>
    );
  });

  return (
    <WrapperComponent>
      <div className={styles.allDiv}>
        <div className={styles.topDiv}>
          <div className={styles.topDivTitle}>
            <CommonTitle>调整文件详情</CommonTitle>
          </div>
        </div>
        {/* <Spin spinning={preLoading}> */}
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>目录</div>
            <div className={styles.listElement}>{listDataElement}</div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>{/* <RightComponent /> */}</div>
          </div>
        </div>
        {/* </Spin> */}
      </div>
    </WrapperComponent>
  );
};

export default AdjustmentFileDetails;
