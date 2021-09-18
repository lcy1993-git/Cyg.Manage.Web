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

import { useControllableValue } from 'ahooks';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import {
  getExternalArrangeStep,
  confirmOuterAudit,
} from '@/services/project-management/all-project';
import styles from './index.less';
import EditExternalArrangeForm from '../edit-external-modal';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { delay } from '@/utils/utils';
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
  const [isPassExternalArrange, setIsPassExternalArrange] = useState<string>('');
  const [addPersonState, setAddPersonState] = useState<boolean>(false);

  const [requestLoading, setRequestLoading] = useState(false);

  const [newStepData, setNewStepData] = useState<any[]>([]);

  const [form] = Form.useForm();
  const { stepData, projectId, refresh } = props;

  const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
    manual: true,
  });

  const executeArrangeEvent = async () => {
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

  const modifyEvent = () => {
    setEditExternalArrangeModal(true);
  };

  const finishEditEvent = async () => {
    try {
      setRequestLoading(true);
      await delay(1000);
      const res = await getExternalStep(projectId);
      setNewStepData(res);
    } catch (msg) {
      console.error(msg);
    } finally {
      setRequestLoading(false);
    }
  };

  const deleteAllotUser = async (userId: string) => {
    await removeAllotUser({ projectId: projectId, userAllotId: userId });
    message.success('已移除');
    getExternalStep(projectId);
  };

  return (
    <>
      {/* <Steps><Step key={item.title} title={item.title} /></Steps> */}
      <Modal
        title="外审结果"
        visible={state as boolean}
        maskClosable={false}
        width={850}
        onCancel={() => setState(false)}
        footer={
          !newStepData
            ?.map((item: any) => {
              if (item.status === 20) {
                return true;
              }
              return false;
            })
            .includes(false)
            ? [
                <Button
                  disabled={!isPassExternalArrange}
                  key="save"
                  type="primary"
                  onClick={() => executeArrangeEvent()}
                >
                  提交
                </Button>,
              ]
            : [
                <>
                  {addPersonState ? (
                    <>
                      <Form style={{ width: '100%' }} form={form}>
                        <SelectAddListForm
                          isAdd={true}
                          // initPeople={arrangePeople}
                          // projectName={proName}
                          // onChange={(people) => setArrangePeople(people)}
                          // notArrangeShow={isArrangePeople}
                          // onSetPassArrangeStatus={(flag) => setIsPassArrangePeople(flag)}
                        />
                      </Form>
                    </>
                  ) : (
                    <span className={styles.addClickTitle} onClick={() => setAddPersonState(true)}>
                      添加外审人员
                    </span>
                  )}
                  <Button key="save" type="primary" onClick={() => setState(false)}>
                    确认评审结果
                  </Button>
                </>,
              ]
        }
      >
        {/* 当前外审人员列表 */}
        <Spin spinning={requestLoading} tip="数据重新请求中...">
          <div className={styles.peopleList}>
            {newStepData?.map((el: any, idx: any) => (
              <div className={styles.single} key={el.id}>
                <div>外审 {idx + 1}</div>
                <div className={styles.exName}>{`${el.userNameText}`}</div>
                <div>
                  <Button>评审结果</Button>
                  {/* {el.status === 1 ? (
                    <MinusCircleOutlined style={{ fontSize: '22px' }} />
                  ) : el.status === 10 ? (
                    <ClockCircleOutlined style={{ fontSize: '22px' }} />
                  ) : el.status === 20 && el.resultParameterDisplay[0] === '不通过' ? (
                    <CloseCircleOutlined style={{ color: '#d81e06', fontSize: '22px' }} />
                  ) : (
                    <CheckCircleOutlined style={{ color: '#0e7b3b', fontSize: '22px' }} />
                  )} */}
                </div>
                {/* <div className={styles.status}>{el.statusDescription}</div> */}
                <div style={{ marginRight: '12px' }}>
                  <Tooltip title="删除">
                    <Popconfirm
                      title="删除该人员后将不再保存该人员的评审结果记录，请确认?"
                      onConfirm={() => deleteAllotUser(el.id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <DeleteOutlined className={styles.deleteIcon} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>
            ))}

            {/* <Button type="primary" onClick={() => modifyEvent()}>
              修改外审
            </Button> */}
          </div>
        </Spin>
        {/* 
        {!newStepData
          ?.map((item: any) => {
            if (item.status === 20) {
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
                <Radio value="0">外审不通过</Radio>
                <Radio value="1">外审通过</Radio>
              </Radio.Group>
            </div>
          </Form>
        )} */}
      </Modal>
      {/* {editExternalArrangeModal && (
        <EditExternalArrangeForm
          projectId={projectId}
          visible={editExternalArrangeModal}
          onChange={setEditExternalArrangeModal}
          closeModalEvent={finishEditEvent}
        />
      )} */}
    </>
  );
};

export default ExternalListModal;
