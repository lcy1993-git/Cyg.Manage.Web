import React, { SetStateAction, useMemo, useState } from 'react';
import { Button, Divider, Form, message, Modal, Radio } from 'antd';

import { useControllableValue } from 'ahooks';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import {
  executeExternalArrange,
  getExternalArrangeStep,
} from '@/services/project-management/all-project';
import styles from './index.less';
import EditExternalArrangeForm from '../edit-external-modal';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

import { useRequest } from 'ahooks';
import { useEffect } from 'react';

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

const ExternalListModal: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false);
  const [isPassExternalArrange, setIsPassExternalArrange] = useState<boolean>(false);

  const [newStepData, setNewStepData] = useState<any[]>([]);

  const [form] = Form.useForm();
  const { stepData, projectId, refresh } = props;

  const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
    manual: true,
  });

  const executeArrangeEvent = async () => {
    await executeExternalArrange({
      projectId: projectId,
      parameter: { 是否结束: `${isPassExternalArrange}` },
    });

    message.success('外审已通过');
    setState(false);
    refresh?.();
  };

  useEffect(() => {
    setNewStepData(stepData);
  }, [stepData]);

  const notBeginList = useMemo(() => {
    return newStepData
      ?.map((item: any) => {
        if (item.status === 1) {
          return {
            value: item.expectExecutor,
            text: `${item.companyName}-${item.expectExecutorName}`,
          };
        }
        return;
      })
      .filter(Boolean);
  }, [newStepData]);

  const modifyEvent = () => {
    setEditExternalArrangeModal(true);
  };

  const finishEditEvent = async () => {
    const res = await getExternalStep(projectId);
    setNewStepData(res);
  };

  return (
    <>
      <Modal
        title="外审列表"
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
                <Button key="save" type="primary" onClick={() => executeArrangeEvent()}>
                  提交
                </Button>,
                // </div>,
              ]
            : [
                <Button key="save" type="primary" onClick={() => setState(false)}>
                  确认
                </Button>,
                // </div>,
              ]
        }
      >
        {/* 当前外审人员列表 */}
        <div className={styles.peopleList}>
          {newStepData?.map((el: any, idx: any) => (
            <div className={styles.single} key={el.id}>
              <div>外审 {idx + 1}</div>
              <div className={styles.exName}>{`${el.companyName}-${el.expectExecutorName}`}</div>
              <div>
                {el.status === 1 ? (
                  <MinusCircleOutlined style={{ fontSize: '22px' }} />
                ) : el.status === 10 ? (
                  <ClockCircleOutlined style={{ fontSize: '22px' }} />
                ) : el.status === 20 && el.resultParameterDisplay[0] === '不通过' ? (
                  <CloseCircleOutlined style={{ color: '#d81e06', fontSize: '22px' }} />
                ) : (
                  <CheckCircleOutlined style={{ color: '#0e7b3b', fontSize: '22px' }} />
                )}
              </div>
              <div className={styles.status}>{el.statusDescription}</div>
            </div>
          ))}

          <Button type="primary" onClick={() => modifyEvent()}>
            修改外审
          </Button>
        </div>

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
                //   value={notArrangePeopleStatus}
              >
                <Radio value={false}>外审不通过</Radio>
                <Radio value={true}>外审通过</Radio>
              </Radio.Group>
            </div>
          </Form>
        )}
      </Modal>
      {editExternalArrangeModal && (
        <EditExternalArrangeForm
          projectId={projectId}
          visible={editExternalArrangeModal}
          onChange={setEditExternalArrangeModal}
          notBeginUsers={notBeginList}
          closeModalEvent={finishEditEvent}
        />
      )}
    </>
  );
};

export default ExternalListModal;
