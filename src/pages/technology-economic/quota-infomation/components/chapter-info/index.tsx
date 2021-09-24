import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import WangEditor from '../wang-editor';
import {saveQuotaLibraryCatalogDescription} from '@/services/technology-economic';
interface Props {
  data: string;
  id: string
  update: ()=>void
}

const ChapterInfo: React.FC<Props> = ({data, id,update}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const contentWrapRef = useRef<HTMLDivElement>(null);

  contentWrapRef.current && (contentWrapRef.current!.innerHTML = data)

  const [html, setHtml] = useState<string>(data);

  // useEffect(() => {
  //   contentWrapRef.current!.innerHTML = "<p>12312312312</p>"
  // }, [html])
  const saveData = ()=>{
    saveQuotaLibraryCatalogDescription({id, chapterDescription: html})
    setModalVisible(false)
    setHtml('')
    setTimeout(()=>{
      update()
    },500)
  }
  return (
    <div className={styles.chapterInfoWrap}>
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => setModalVisible(true)}>
          <EditOutlined />
          编辑
        </Button>
      </div>
      <div className={styles.contentWrap} ref={contentWrapRef}>
      </div>
      <Modal
        visible={modalVisible}
        title="编辑-章节说明"
        width="80%"
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        onOk={saveData}
      >
        <WangEditor getHtml={setHtml} />
      </Modal>
    </div>
  )
}

export default ChapterInfo;
