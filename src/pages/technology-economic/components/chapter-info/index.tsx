import { useState } from 'react';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';

const ChapterInfo = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  return (
    <div className={styles.chapterInfoWrap}>
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => setModalVisible(true)}>
          <EditOutlined />
          编辑
        </Button>
      </div>
      <div className={styles.contentWrap}>
        contentWrap
      </div>
      <Modal
        visible={modalVisible}
        title="编辑-章节说明"
        width="80%"
        onCancel={() => setModalVisible(false)}
      >
        
      </Modal>
    </div>
  )
}

export default ChapterInfo;