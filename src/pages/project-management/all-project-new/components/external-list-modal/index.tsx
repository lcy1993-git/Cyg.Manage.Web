import React, { SetStateAction, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  message,
  Modal,
  Popconfirm,
  Radio,
  Spin,
  Steps,
  Tooltip,
} from 'antd';

import { useControllableValue, useUpdateEffect } from 'ahooks';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import {
  getExternalArrangeStep,
  addAllotUser,
  confirmOuterAudit,
} from '@/services/project-management/all-project';
import styles from './index.less';
import { DeleteOutlined, EnvironmentOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { removeAllotUser } from '@/services/project-management/all-project';
import SelectAddListForm from '../select-add-list-form';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
  visible: boolean;
  projectId: string;
  stepData?: any;
  refresh?: () => void;
}

const { Step } = Steps;

const ExternalListModal: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false);
  const [isPassExternalArrange, setIsPassExternalArrange] = useState<boolean>(false);
  const [backTo, setBackTo] = useState<number>(4);
  const [addPersonState, setAddPersonState] = useState<boolean>(false);
  const [addPeople, setAddPeople] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const [requestLoading, setRequestLoading] = useState(false);

  const [newStepData, setNewStepData] = useState<any[]>([]);

  const [form] = Form.useForm();
  const { projectId, refresh } = props;

  const { data: stepData, run } = useRequest(() => getExternalArrangeStep(projectId));
  const { run: addUser } = useRequest(
    () => addAllotUser({ projectId: projectId, userId: addPeople[0]?.value }),
    {
      manual: true,
      onSuccess: () => {
        run();
      },
    },
  );

  const checkResultEvent = async () => {
    setCurrent(current + 1);
    // await confirmOuterAudit({
    //   projectId: projectId,
    //   parameter: { 是否结束: `${isPassExternalArrange === '1' ? true : false}` },
    // });
    // message.success('外审已通过');
    // setState(false);
    // refresh?.();
  };

  useEffect(() => {
    setNewStepData(stepData);
  }, [stepData]);

  useUpdateEffect(() => {
    addUser();
  }, [addPeople]);

  const modifyEvent = () => {
    setEditExternalArrangeModal(true);
  };

  // const finishEditEvent = async () => {
  //   try {
  //     setRequestLoading(true);
  //     await delay(1000);
  //     const res = await getExternalStep(projectId);
  //     setNewStepData(res);
  //   } catch (msg) {
  //     console.error(msg);
  //   } finally {
  //     setRequestLoading(false);
  //   }
  // };

  const deleteAllotUser = async (userId: string) => {
    await removeAllotUser({ projectId: projectId, userAllotId: userId });
    message.success('已移除');
    run();
    refresh?.();
    if (!stepData) {
      setState(false);
    }
  };

  const deleteConfirm = (id: string) => {
    Modal.confirm({
      title: '删除外审人员',
      icon: <ExclamationCircleOutlined />,
      content:
        stepData.length > 1
          ? '删除该人员后将不再保存该人员的评审结果记录，请确认?'
          : '删除最后一个审核人之后项目将退回至[待安排外审]阶段，确认删除该人员',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteAllotUser(id),
    });
  };

  const prevEvent = () => {
    setCurrent(current - 1);
  };

  const confirmResultEvent = async () => {
    if (isPassExternalArrange) {
      await confirmOuterAudit({ projectId: projectId, auditPass: true });
      setState(false);
      message.success('操作成功');
      refresh?.();
      return;
    }
    setCurrent(current + 1);
  };

  const reviewCheckEvent = () => {
    console.log('word预览');
  };

  const backToEvent = async () => {
    await confirmOuterAudit({ projectId: projectId, auditPass: false, returnToState: backTo });
    setState(false);
    message.success('外审已退回');
    refresh?.();
  };

  return (
    <>
      <Modal
        title="外审结果"
        visible={state as boolean}
        maskClosable={false}
        width={850}
        onCancel={() => setState(false)}
        footer={
          !newStepData
            ?.map((item: any) => {
              if (item.status === 3) {
                return true;
              }
              return false;
            })
            .includes(false) && current === 0
            ? [
                <>
                  {addPersonState ? (
                    <Form style={{ width: '100%' }} form={form}>
                      <SelectAddListForm
                        isAdd={true}
                        // projectName={proName}
                        onChange={(people) => setAddPeople(people)}
                      />
                    </Form>
                  ) : (
                    <span className={styles.addClickTitle} onClick={() => setAddPersonState(true)}>
                      添加外审人员
                    </span>
                  )}
                  <Button key="save" type="primary" onClick={() => checkResultEvent()}>
                    确认评审结果
                  </Button>
                </>,
              ]
            : current === 1
            ? [
                <>
                  <Button style={{ margin: '0 8px' }} onClick={() => prevEvent()}>
                    上一步
                  </Button>
                  <Button key="save" type="primary" onClick={() => confirmResultEvent()}>
                    确认
                  </Button>
                </>,
              ]
            : current === 2
            ? [
                <>
                  <Button style={{ margin: '0 8px' }} onClick={() => prevEvent()}>
                    上一步
                  </Button>
                  <Button key="save" type="primary" onClick={() => backToEvent()}>
                    确认
                  </Button>
                </>,
              ]
            : [
                <>
                  {addPersonState ? (
                    <Form style={{ width: '100%' }} form={form}>
                      <SelectAddListForm
                        isAdd={true}
                        // projectName={proName}
                        onChange={(people) => setAddPeople(people)}
                      />
                    </Form>
                  ) : (
                    <span className={styles.addClickTitle} onClick={() => setAddPersonState(true)}>
                      添加外审人员
                    </span>
                  )}
                  <Button
                    onClick={() => {
                      message.info('当前存在未提交评审结果的外审人员，无法执行此操作');
                    }}
                    key="save"
                    type="default"
                  >
                    确认评审结果
                  </Button>
                </>,
              ]
        }
      >
        <Steps current={current}>
          <Step title="结果查看" icon={<EnvironmentOutlined />} />
          {current > 0 && <Step title="结果确认" icon={<EnvironmentOutlined />} />}
          {current > 1 && <Step title="外审退回" icon={<EnvironmentOutlined />} />}
        </Steps>
        {/* 当前外审人员列表 */}
        {current === 0 && (
          <Spin spinning={requestLoading} tip="数据重新请求中...">
            <div className={styles.peopleList}>
              {newStepData?.map((el: any, idx: any) => (
                <div className={styles.single} key={el.id}>
                  <div>外审 {idx + 1}</div>
                  <div className={styles.exName}>{`${el.userNameText}`}</div>
                  <div>
                    {el.status === 3 ? (
                      <Button
                        style={{ backgroundColor: '#0e7b3b', color: '#fff' }}
                        onClick={() => reviewCheckEvent()}
                      >
                        评审结果
                      </Button>
                    ) : (
                      <Button disabled>评审结果</Button>
                    )}
                  </div>
                  <div style={{ marginRight: '12px' }}>
                    <Tooltip title="删除">
                      <DeleteOutlined
                        className={styles.deleteIcon}
                        onClick={() => deleteConfirm(el.id)}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Spin>
        )}
        {current === 1 &&
          !newStepData
            ?.map((item: any) => {
              if (item.status === 3) {
                return true;
              }
              return false;
            })
            .includes(false) && (
            <Form style={{ width: '100%' }} form={form}>
              <Divider />
              <div className={styles.notArrange}>
                <p style={{ textAlign: 'center' }}>外审结果确认</p>
                <Radio.Group
                  onChange={(e) => setIsPassExternalArrange(e.target.value)}
                  value={isPassExternalArrange}
                >
                  <Radio value={false}>外审不通过</Radio>
                  <Radio value={true}>外审通过</Radio>
                </Radio.Group>
              </div>
            </Form>
          )}

        {current === 2 && (
          <Form style={{ width: '100%' }} form={form}>
            <Divider />
            <div className={styles.notArrange}>
              <p style={{ textAlign: 'center' }}>外审退回</p>
              <Radio.Group onChange={(e) => setBackTo(e.target.value)} value={backTo}>
                <Radio value={4}>设计中</Radio>
                <Radio value={11}>造价中</Radio>
              </Radio.Group>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ExternalListModal;
