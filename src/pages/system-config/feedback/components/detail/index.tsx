import CyFormItem from '@/components/cy-form-item';
import ReadonlyItem from '@/components/readonly-item';
import ReplyComponent from '@/components/reply-component';
import { Input } from 'antd';
import moment from 'moment';
import React from 'react';

import styles from './index.less';

interface FeedbackDetailProps {
  detailInfo: any;
}

const FeedbackDetail: React.FC<FeedbackDetailProps> = (props) => {
  const { detailInfo = {} } = props;

  const { replys } = detailInfo;

  const replyElement = replys.map((item: any, index: number) => {
    return (
      <ReplyComponent
        className={styles.replyItem}
        key={`reply_${index}`}
        time={item.createdOn ? moment(item.createdOn).format('YYYY-MM-DD hh:mm:ss') : ''}
        name={item.userName}
      >
        {item.content}
      </ReplyComponent>
    );
  });

  return (
    <div className={styles.feedbackDetail}>
      <div className={styles.feedbackDetailInfo}>
        <div className="flex">
          <div className="flex1">
            <ReadonlyItem labelWidth={52} label="反馈标题">
              {detailInfo.title}
            </ReadonlyItem>
          </div>
          <div>
            <span className="tipInfo">
              {detailInfo.createdOn
                ? moment(detailInfo.createdOn).format('YYYY-MM-DD hh:mm:ss')
                : ''}
            </span>
          </div>
        </div>

        <CyFormItem labelWidth={72} label="反馈描述">
          <span style={{ fontWeight: 'bold' }}>{detailInfo.describe ?? ''}</span>
        </CyFormItem>
      </div>
      {replys.length > 0 && <div className={styles.feedbackDetailReplyInfo}>{replyElement}</div>}

      <div className={styles.replyContent}>
        <CyFormItem label="回复" labelWidth={55} name="content" align="right">
          <Input.TextArea rows={4} />
        </CyFormItem>
      </div>
    </div>
  );
};

export default FeedbackDetail;
