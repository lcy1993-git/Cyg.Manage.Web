import React, { SetStateAction, useMemo, useState } from 'react';
import { Button, Divider, Form, message, Modal, Radio } from 'antd';

import { useControllableValue } from 'ahooks';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import { executeExternalArrange } from '@/services/project-management/all-project';
import styles from './index.less';
import EditExternalArrangeForm from '../edit-external-modal';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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

  const [form] = Form.useForm();
  const { stepData, projectId, refresh } = props;

  const executeArrangeEvent = async () => {
    await executeExternalArrange({
      projectId: projectId,
      parameter: { 是否结束: `${isPassExternalArrange}` },
    });
    message.success('外审已通过');
    setState(false);
    refresh?.();
  };

  const notBeginList = useMemo(() => {
    return stepData
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
  }, [stepData]);

  const modifyEvent = () => {
    setEditExternalArrangeModal(true);
  };

  return (
    <>
      <Modal
        title="外审列表"
        visible={state as boolean}
        maskClosable={false}
        width={850}
        onCancel={() => setState(false)}
        footer={[
          // <div className={styles.externalModal}>
          //   <Checkbox onChange={() => setIsPassArrangePeople(!false)}>不安排外审</Checkbox>
          //   <Button key="cancle" onClick={() => setState(false)}>
          //     取消
          //   </Button>

          <Button key="save" type="primary" onClick={() => executeArrangeEvent()}>
            提交
          </Button>,
          // </div>,
        ]}
      >
        {/* 当前外审人员列表 */}
        <div className={styles.peopleList}>
          {stepData?.map((el: any, idx: any) => (
            <div className={styles.single} key={el.id}>
              <div>外审 {idx + 1}</div>
              <div>{`${el.companyName}-${el.expectExecutorName}`}</div>
              <div>
                {el.status === 1 ? (
                  '未执行'
                ) : el.status === 10 ? (
                  <ClockCircleOutlined />
                ) : el.status === 20 && el.resultParameterDisplay[0] === '不通过' ? (
                  <CloseCircleOutlined style={{ color: 'red', fontSize: '22px' }} />
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

        {!stepData
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
      <EditExternalArrangeForm
        projectId={projectId}
        visible={editExternalArrangeModal}
        onChange={setEditExternalArrangeModal}
        notBeginUsers={notBeginList}
      />
    </>
  );
};

export default ExternalListModal;
