import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './index.less';

interface PersonInfoRowProps {
  editNode?: false | React.ReactElement;
  name: string | undefined;
  title: string;
  expandState: boolean;
}

const PersonInfoRow: React.FC<PersonInfoRowProps> = ({
  editNode = false,
  name,
  title,
  expandState
}) => {

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    setExpand(false)
  }, [expandState])

  return (
    <div className={styles.personInfoRowWrap}>
        <div className={styles.headerRow}>
          <div className={styles.rowTitle}>{title}</div>
          <div className={styles.rowContent}>{name}</div>
          {
            editNode && (
              <div className={styles.expandIcon} onClick={() => setExpand(!expand)}>
                <div>{ expand ? "取消" : "编辑" }</div>
                <div className={styles.icon}>
                {
                  expand ? <UpOutlined /> : <DownOutlined />
                }
                </div>
              </div>
            )
          }
          
        </div>
      {
        editNode && expand && (
          <div className={styles.editNodeWrap}>
            {editNode}
          </div>
        )
      }
    </div>
  );
}

export default PersonInfoRow;