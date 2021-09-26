import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import ReadonlyItem from '@/components/readonly-item';
import ReplyComponent from '@/components/reply-component';
import moment from 'moment';
import React from 'react';
import styles from './index.less';
import { HandleStatus } from '@/services/system-config/platform-feedback';
import { Input } from 'antd';
interface FeedBackFormProps {
  detailData: any;
}

const FeedBackForm: React.FC<FeedBackFormProps> = (props) => {
  const { detailData = {} } = props;

  const { replys = [] } = detailData;

  const replyElement = replys.map((item: any, index: number) => {
    return (
      <ReplyComponent
        className={styles.replyItem}
        time={item.createdOn}
        key={`reply_${index}`}
        name={item.userName}
      >
        {item.content}
      </ReplyComponent>
    );
  });

  return (
    <div className={styles.feedBackForm}>
      <div className={styles.feedBackInfo}>
        <div className="flex">
          <div className="flex1">
            <ReadonlyItem label="反馈用户" align="left">
              {detailData.companyName}
            </ReadonlyItem>
          </div>
          <div className="mr7">
            <span className="tipInfo">{detailData.phone ?? ''}</span>
          </div>
          <div>
            <span className="tipInfo">
              {detailData.createdOn
                ? moment(detailData.createdOn).format('YYYY-MM-DD hh:mm:ss')
                : ''}
            </span>
          </div>
        </div>
        <div>
          <ReadonlyItem label="反馈标题" align="left">
            {detailData.title ?? ''}
          </ReadonlyItem>
        </div>
        <div>
          <CyFormItem label="内容" align="left">
            <span style={{ fontWeight: 'bold' }}>{detailData.describe ?? ''}</span>
          </CyFormItem>
        </div>
      </div>
      {replys && <div className={styles.handleInfo}>{replyElement}</div>}
      <div className={styles.handleForm}>
        <CyFormItem
          label="回复状态"
          labelWidth={72}
          name="processStatus"
          initialValue="2"
          align="right"
        >
          <EnumSelect enumList={HandleStatus} />
        </CyFormItem>
        <div style={{ marginTop: '-14px' }}>
          <CyFormItem
            label="处理意见"
            labelWidth={72}
            align="right"
            required
            name="content"
            rules={[
              {
                required: true,
                message: '处理意见不能为空',
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </CyFormItem>
        </div>
      </div>
    </div>
  );
};

export default FeedBackForm;
