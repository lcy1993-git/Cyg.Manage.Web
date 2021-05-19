import { useControllableValue, useRequest } from 'ahooks';
import { Modal, Spin } from 'antd';
import TableStatus from '@/components/table-status';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { getNewsItemDetail } from '@/services/news-config/info-manage';
import styles from './index.less';
import ReadonlyItem from '@/components/readonly-item';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';

interface CheckInfoModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  newsId: string;
}

const mapColor = {
  无: 'gray',
  管理端: 'greenOne',
  勘察端: 'greenTwo',
  评审端: 'greenThree',
  技经端: 'greenFour',
  设计端: 'greenFive',
};

const CheckInfoModal: React.FC<CheckInfoModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { newsId } = props;

  const { data: newsInfo, run, loading } = useRequest(() => getNewsItemDetail(newsId), {
    ready: !!newsId,
    refreshDeps: [newsId],
  });

  console.log(newsInfo);

  useEffect(() => {
    if (state) {
      run();
    }
  }, [state]);

  const userShowInfo = newsInfo?.users.map((item) => {
    return (
      <CyTag key={uuid.v1()} className="mr7 mb7">
        {item.text}
      </CyTag>
    );
  });

  const clientCategorysInfo = newsInfo?.clientCategorys.map((item) => {
    return (
      <TableStatus color={mapColor[item.text] ?? 'gray'} key={uuid.v1()} className="mr7 mb7">
        {item.text}
      </TableStatus>
    );
  });

  console.log(newsInfo);

  return (
    <Modal
      maskClosable={false}
      title="查看消息"
      centered
      width="80%"
      bodyStyle={{ height: 750, overflowY: 'auto' }}
      visible={state as boolean}
      destroyOnClose
      footer={null}
      onCancel={() => setState(false)}
    >
      <Spin spinning={loading} tip="正在加载...">
        <ReadonlyItem labelWidth={40} align="left" label="标题">{newsInfo?.title}</ReadonlyItem>
        <ReadonlyItem labelWidth={40} align="left" label="状态">
          {newsInfo?.isEnable ? (
            <span className={styles.open}>启用</span>
          ) : (
            <span className={styles.close}>禁用</span>
          )}
        </ReadonlyItem>
        <ReadonlyItem labelWidth={40} align="left" label="对象">
          <div className={styles.object}>
            <div className={styles.name}>{userShowInfo}</div>
            <div className={styles.readInfo}>
              共<span>{newsInfo?.receiveQty ?? 0}</span>人收到/
              <span className={styles.readPerson}>{newsInfo?.readQty ?? 0}</span>人已读
            </div>
          </div>
        </ReadonlyItem>
        <ReadonlyItem labelWidth={40} align="left" label="端口">{clientCategorysInfo}</ReadonlyItem>
        <div style={{ width: '100%' }}>
          <ReadonlyItem labelWidth={40} align="left" label="内容">
            {newsInfo?.content && (
              <div dangerouslySetInnerHTML={{ __html: newsInfo?.content! }}></div>
            )}
          </ReadonlyItem>
        </div>
      </Spin>
    </Modal>
  );
};

export default CheckInfoModal;
