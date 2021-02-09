import ReadonlyItem from '@/components/readonly-item';
import React from 'react';
import styles from "./index.less";

interface FeedBackFormProps {
  detailData: any
}

const FeedBackForm: React.FC<FeedBackFormProps> = (props) => {
  const { detailData } = props;

  return (
    <div style={styles.feedBackForm}>
      <div className={styles.feedBackInfo}>
        <div className="flex">
          <div className="flex1">
            <ReadonlyItem label="反馈用户" align="left">

            </ReadonlyItem>
          </div>
          <div>
            <span className="tipInfo">

            </span>
          </div>
          <div>
            <span className="tipInfo">

            </span>
          </div>
        </div>
        <div>
          <ReadonlyItem label="反馈标题" align="left">

          </ReadonlyItem>
        </div>
        <div>
          <ReadonlyItem label="内容" align="left">

          </ReadonlyItem>
        </div>
      </div>
      <div className={styles.handleInfo}>
      
      </div>
      <div className={styles.handleForm}>

      </div>
    </div>
  );
};

export default FeedBackForm;
