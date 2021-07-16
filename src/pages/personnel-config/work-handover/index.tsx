import React, { useState } from 'react';
import qs from 'qs';
import { Button, Tabs, Modal, message } from 'antd';
import styles from './index.less';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { handoverCompanyGroup, handoverEngineer } from '@/services/personnel-config/work-handover';
import { useMount, useUnmount } from 'ahooks';
import { useLayoutStore } from '@/layouts/context';
import Description from './components/description';
import GroupIdentity from './components/identity';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProjectManage from './components/manage';
import MissionTab from './components/mission';

const { TabPane } = Tabs;

const WorkHandover: React.FC = () => {
  const userId = qs.parse(window.location.href.split('?')[1]).id as string;
  const name = qs.parse(window.location.href.split('?')[1]).name as string;
  const userName = qs.parse(window.location.href.split('?')[1]).userName as string;
  const [clickTabKey, setClickTabKey] = useState<string>('manage');
  //部组交接
  const [receiverId, setReceiverId] = useState<string | undefined>(undefined);
  const [receiverName, setReceiverName] = useState<string>('');
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [isFresh, setIsFresh] = useState<boolean>(false);
  const [engineerIds, setEngineerIds] = useState<string[]>([]);

  const [engineerData, setEngineerData] = useState<any[]>([]);

  const { setWorkHandoverFlag } = useLayoutStore();

  useMount(() => {
    setWorkHandoverFlag?.(true);
  });

  useUnmount(() => {
    setWorkHandoverFlag?.(false);
    //   window.localStorage.setItem('manageId', '');
  });

  //获取项目数量
  const projectLen =
    engineerData
      ?.map((item) => {
        return item.projects;
      })
      .flat().length ?? 0;

  //部组交接
  const identityConfirm = () => {
    Modal.confirm({
      title: '部组身份交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中部组管理员身份交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handIdentityEvent,
    });
  };

  const handIdentityEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员');
      return;
    }
    if (groupIds.length === 0) {
      message.warning('请选择需要交接的条目');
      return;
    }

    await handoverCompanyGroup({
      companyGroupIds: groupIds,
      userId: userId,
      receiveUserId: receiverId,
    });
    setIsFresh(true);
    setReceiverId(undefined);
    message.success('操作成功');
  };

  //项目管理交接

  const manageConfirm = () => {
    Modal.confirm({
      title: '项目管理交接',
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中工程项目交接至"${receiverName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: handManageEvent,
    });
  };

  const handManageEvent = async () => {
    if (!receiverId) {
      message.warning('您还未选择接收人员');
      return;
    }
    if (engineerIds.length === 0) {
      message.warning('请选择需要交接的条目');
      return;
    }

    await handoverEngineer({
      engineerIds: engineerIds,
      userId: userId,
      receiveUserId: receiverId,
    });
    setIsFresh(true);
    setReceiverId(undefined);
    message.success('交接成功');
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.handover}>
        <div className={styles.moduleTitle}>
          <CommonTitle>工作交接-{name != 'null' ? name : userName}</CommonTitle>
        </div>
        <div className={styles.moduleHead}>
          <div className={styles.tabTitle}>待交接的方案</div>
          <div className={styles.moduleTabs}>
            <Tabs
              type="card"
              onChange={(key) => {
                setClickTabKey(key);
                setReceiverId(undefined);
              }}
            >
              <TabPane tab="项目管理" key={'manage'}>
                <ProjectManage
                  userId={userId}
                  recevierId={receiverId}
                  isFresh={isFresh}
                  setIsFresh={setIsFresh}
                  getReceiverId={setReceiverId}
                  setReceiverName={setReceiverName}
                  setEngineerIds={setEngineerIds}
                  getEngineerData={setEngineerData}
                />
              </TabPane>
              <TabPane tab="作业任务" key={'mission'}>
                <MissionTab />
              </TabPane>
              <TabPane tab="部组身份" key={'identity'}>
                <GroupIdentity
                  userId={userId}
                  getReceiverId={setReceiverId}
                  getGroupIds={setGroupIds}
                  isFresh={isFresh}
                  setIsFresh={setIsFresh}
                  receiverId={receiverId}
                  setReceiverName={setReceiverName}
                />
              </TabPane>
              <TabPane tab="其他" key="others">
                <Description />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.account}>
          <span>总共</span>
          <span className={styles.numberAccount}>
            {engineerData?.length ? engineerData.length : 0}
          </span>
          <span>个工程，</span>
          <span className={styles.numberAccount}>{projectLen}</span>个项目
        </div>
        <div className={styles.actionBtn}>
          <Button type="primary">
            {clickTabKey === 'manage' ? (
              <span
                onClick={
                  engineerData && engineerData.length > 0
                    ? manageConfirm
                    : () => {
                        message.info('暂无可交接的条目');
                      }
                }
              >
                交接
              </span>
            ) : clickTabKey === 'mission' ? (
              <span>交接</span>
            ) : clickTabKey === 'identity' ? (
              <span onClick={identityConfirm}>交接</span>
            ) : (
              <span>交接完成</span>
            )}
          </Button>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default WorkHandover;
