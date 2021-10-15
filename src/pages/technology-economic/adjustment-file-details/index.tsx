import { useEffect, useState } from 'react';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import styles from './index.less';
import { getEnabledAdjustmentFiles } from '@/services/technology-economic/spread-coefficient';
import { baseUrl } from '@/services/common';
import FileDwgView from '@/components/api-file-view/componnents/file-dwg-view';
interface ListData {
  id: string;
  name: string;
  [key: string]: string;
}
const AdjustmentFileDetails: React.FC = () => {
  const [listData, setListData] = useState<ListData[]>([]);
  const [activeValue, setActiveValue] = useState<ListData>({ id: '', name: '', path: '' });
  const [path, setPath] = useState('');
  const [api, setApi] = useState({});
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const result: any = await getEnabledAdjustmentFiles();
    setListData(result);
    result && result[0].path && getApi(result[0].path);
    setActiveValue(result[0]);
    setPath(result[0].path);
  };
  const listDataElement = listData.map((item: any, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.id === activeValue.id ? styles.listActive : ''
        }`}
        key={item.id}
        onClick={() => {
          item.path && getApi(item.path);
          setActiveValue(item);
          setPath(item.path);
        }}
      >
        {item.name}
      </div>
    );
  });
  const getApi = (id: string) => {
    const api = {
      url: `${
        baseUrl.upload
      }/Download/GetFileById?fileId=${id}&securityKey=${'1202531026526199123'}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    };
    setApi(api);
  };
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
            <div className={styles.body}>
              {path && <FileDwgView params={api} hasAuthorization={true} />}
            </div>
          </div>
        </div>
        {/* </Spin> */}
      </div>
    </WrapperComponent>
  );
};

export default AdjustmentFileDetails;
