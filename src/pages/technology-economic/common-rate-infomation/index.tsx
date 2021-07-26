import { useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal, message, Spin } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import CommonRateTable from './components/common-rate-table';
import { downloadTemplate, downloadDemolitionTemplate, importRateTable } from '@/services/technology-economic/common-rate';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { getTypeByText } from '../utils';
import styles from './index.less';
import FileUpload from '@/components/file-upload';

interface ListData {
  value: string;
  text: string;
}

interface Params {
  id: string;
  isDemolition: boolean;
}

const CommonRateInfomation: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({ value: "", text: "" });

  const [importVisibel, setImportVisibel] = useState<boolean>(false);

  const [fileList, setFileList] = useState<File[]>([])

  const params = window.location.search.split("?")[1].split("&").reduce((pre, val) => {
    const unit = val.split("=");
    if(unit[0] === "isDemolition") {
      pre[unit[0]] = Boolean(unit[1]);
    }else{
      pre[unit[0]] = unit[1];
    }

    return pre;
  }, {})
  
  const { data: listData = [], run: listDataRun, loading: preLoading } = useRequest<ListData[]>(getRateTypeList,
    {
      manual: true,
      onSuccess: (res) => {
        setActiveValue(res[0])
      }
    }
  )
  useMount(() => {
    if((params as Params).id){
      listDataRun((params as Params).id)
    }else{
      message.error("当前费率详情的rateFileId的值为空")
    }
  })

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const listDataElement = listData.map((item, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${item.value === activeValue.value ? styles.listActive : ""}`}
        key={item.value}
        onClick={() => setActiveValue(item)}
      >
        {item.text}
      </div>
    )
  })

  const onOK = () => {
    if (fileList.length === 0) {
      message.error('当前未上传文件');
    }else{
      importRateTable((params as Params).id, fileList[0]).then(() => {
        message.success('上传成功');
        setImportVisibel(false);
      });
    }
  }

  const downLoad = async () => {
    let res;
    
    if((params as Params).isDemolition) {
      res = await downloadDemolitionTemplate()
    }else{
      res = await downloadTemplate() 

    }
    let blob = new Blob([res], {
      type: 'application/xlsx',
    });
    let finalyFileName = '费率表导入模版.xlsx';
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
  }

  return (
    <WrapperComponent>
      <div className={styles.imfomationModalWrap}>
        <div className={styles.topContainer}>
          <div className={styles.topContainerTitle}>
            <CommonTitle>费率详情</CommonTitle>
          </div>
          <div className={styles.importButton}>
            {
              !buttonJurisdictionArray?.includes('quotainfo-import') &&
              <Button type="primary" onClick={() => setImportVisibel(true)}>导入费率</Button>
            }
          </div>
        </div>
        <Spin spinning={preLoading}>
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>
              目录
            </div>
            <div className={styles.listElement}>
              {listDataElement}
            </div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>
              <CommonRateTable id={activeValue.value} type={getTypeByText(activeValue.text)} />
            </div>
          </div>
        </div>
        </Spin>
      </div>
      <Modal
        title="导入费率"
        onOk={onOK}
        onCancel={() => setImportVisibel(false)}
        visible={importVisibel}
      >
        <div className={styles.modalWrap}>
          <div className={styles.row}>
            <span className={styles.label}>文件模板</span>
            <Button type="primary" onClick={downLoad}>下载模板</Button>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>上传文件</span>
            <FileUpload
              uploadFileBtn
              maxCount={1}
              accept=".xlsx"
              trigger={true}
              process={true}
              onChange={(e) => setFileList(e)}
              className={styles.file}
              uploadFileFn={async () => { }}
            />
          </div>
        </div>
      </Modal>
    </WrapperComponent>
  )
}

export default CommonRateInfomation;