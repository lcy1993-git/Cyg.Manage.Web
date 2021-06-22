import { Button, Modal } from 'antd';

import styles from './index.less';
interface Props {
  id: string;
  visible: boolean;
  onChange: (arg0: boolean) => void;
}

const ImfomationModal: React.FC<Props> = ({id, visible, onChange}) => {
  const listData = [
    {text: "1"},
    {text: "2"},
    {text: "3"},
    {text: "4"},
    {text: "5"},
  ]
  const listDataElement = listData.map((item) => {
    return (
    <div className={styles.item} key={item.text}>{item.text}</div> 
    )
  })

  return (
    <Modal
      title="费率详情"
      visible={visible}
      width="90%"
      onCancel={() => onChange(false)}
    >
      <div className={styles.imfomationModalWrap}>
        <div className={styles.containerLeft}>
          <div className={styles.title}>
            目录
          </div>
          <div className={styles.listElement}>
            {listDataElement}
          </div>

        </div>
        <div className={styles.containerRight}>
          <div className={styles.importButton}>
            <Button type="primary">导入费率</Button>
          </div>
          <div className={styles.body}>
            <div className={styles.contentTitle}>123Title</div>
            <div className={styles.content}></div>
            <div className={styles.discription}>
              
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ImfomationModal;