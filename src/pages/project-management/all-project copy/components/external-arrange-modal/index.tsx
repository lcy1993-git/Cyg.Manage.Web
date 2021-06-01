import React, { SetStateAction, useMemo, useState } from 'react';
import { Button, Form, message, Modal } from 'antd';

import { useControllableValue, useRequest } from 'ahooks';
import SelectAddListForm from '../select-add-list-form';
import { Dispatch } from 'react';
import { UserInfo } from '@/services/project-management/select-add-list-form';
import { Checkbox } from 'antd';
import { allotOuterAudit, getAllotUsers } from '@/services/project-management/all-project';
import styles from './index.less';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
  visible: boolean;
  projectId: string;
  search?: () => void;
  proName?: string;
}

const ExternalArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [arrangePeople, setArrangePeople] = useState<UserInfo[]>([]); //添加的外审人员列表
  const [isPassArrangePeople, setIsPassArrangePeople] = useState<boolean>(false); //不安排外审status
  const [isArrangePeople, setIsArrangePeople] = useState<boolean>(false); //不安排外审status

  const [form] = Form.useForm();
  const { projectId, search, proName } = props;

  const { data } = useRequest(() => getAllotUsers(projectId, 6), {
    onSuccess: () => {
      const handleData = data?.map((item: any) => {
        return {
          value: item.userId,
          text: item.userNameText,
        };
      });
      setArrangePeople(handleData ?? []);
    },
  });

  const handleExternalMen = useMemo(() => {
    return arrangePeople?.map((item: any) => {
      return item.value;
    });
  }, [arrangePeople]);

  const saveExternalArrange = async () => {
    await allotOuterAudit({
      projectId: projectId,
      userIds: handleExternalMen,
      notArrangeAudit: isArrangePeople,
      auditResult: isPassArrangePeople,
    });
    message.success('外审安排成功');
    setState(false);
    search?.();
  };

  return (
    <Modal
      title="外审安排"
      visible={state as boolean}
      maskClosable={false}
      width={750}
      onCancel={() => setState(false)}
      destroyOnClose
      // onCancel={() => modalCloseEvent()}
      footer={[
        <div className={styles.externalModal} key="outSider">
          {arrangePeople && arrangePeople.length > 0 ? (
            <Checkbox
              disabled
              onChange={() => {
                setIsArrangePeople(!isArrangePeople);
              }}
            >
              不安排外审
            </Checkbox>
          ) : (
            <Checkbox
              onChange={() => {
                setIsArrangePeople(!isArrangePeople);
              }}
            >
              不安排外审
            </Checkbox>
          )}

          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>
          {(arrangePeople && arrangePeople.length > 0) || isArrangePeople ? (
            <Button key="save" type="primary" onClick={() => saveExternalArrange()}>
              提交
            </Button>
          ) : (
            <Button disabled key="save" type="primary" onClick={() => saveExternalArrange()}>
              提交
            </Button>
          )}
        </div>,
      ]}
    >
      <Form style={{ width: '100%' }} form={form}>
        <SelectAddListForm
          initPeople={arrangePeople}
          projectName={proName}
          onChange={(people) => setArrangePeople(people)}
          notArrangeShow={isArrangePeople}
          onSetPassArrangeStatus={(flag) => setIsPassArrangePeople(flag)}
        />
      </Form>
    </Modal>
  );
};

export default ExternalArrangeForm;
