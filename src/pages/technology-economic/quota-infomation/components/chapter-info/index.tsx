import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import WangEditor from '../wang-editor';

const ChapterInfo = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const contentWrapRef = useRef<HTMLDivElement>(null);

  contentWrapRef.current && (contentWrapRef.current!.innerHTML = "<p>12312312312</p>")

  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    contentWrapRef.current!.innerHTML = "<p>12312312312</p>"
  }, [1])

  useEffect(() => {
    console.log(html);
    contentWrapRef.current!.innerHTML = "<p>12312312312</p>"
  }, [html])
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
        onCancel={() => setModalVisible(false)}
        onOk={()=> console.log(html)}
      >
        <WangEditor getHtml={setHtml} />
      </Modal>
    </div>
  )
}

export default ChapterInfo;