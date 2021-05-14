import React, { SetStateAction, useMemo, useState } from 'react';
import { Button, Form, message, Modal } from 'antd';

import { useControllableValue, useRequest } from 'ahooks';
import SelectAddListForm from '../select-add-list-form';
import uuid from 'node-uuid';
import { Dispatch } from 'react';
import { UserInfo } from '@/services/project-management/select-add-list-form';
import { Checkbox } from 'antd';
import { allotOuterAudit } from '@/services/project-management/all-project';
import styles from './index.less';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
  visible: boolean;
  arrangeUsers?: any;
  projectId: string;
}

const ExternalArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [arrangePeople, setArrangePeople] = useState<UserInfo[]>([]); //添加的外审人员列表
  const [isPassArrangePeople, setIsPassArrangePeople] = useState<boolean>(false); //不安排外审status

  const [form] = Form.useForm();
  const { arrangeUsers, projectId } = props;

  // const { data: exArrangeUsers = [] } = useRequest(() => getAllotUsers(projectId, 6));

  // const modalCloseEvent = () => {
  //   setState(false);
  //   form.resetFields();
  // };
  const hasExArrangeList = useMemo(() => {
    if (arrangeUsers) {
      return arrangeUsers?.map((item: any) => {
        return {
          value: item.userId,
          text: item.userNameText,
        };
      });
    }
    return;
  }, [arrangeUsers]);

  const handleExternalMen = useMemo(() => {
    if (hasExArrangeList) {
      return hasExArrangeList.map((item: any) => {
        return item.value;
      });
    }
    return;
  }, [arrangePeople]);

  const saveExternalArrange = async () => {
    await allotOuterAudit({
      projectId: projectId,
      userIds: handleExternalMen,
      notArrangeAudit: false,
      auditResult: false,
    });
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
        <div className={styles.externalModal}>
          <Checkbox onChange={() => setIsPassArrangePeople(!false)}>不安排外审</Checkbox>
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>

          <Button key="save" type="primary" onClick={() => saveExternalArrange()}>
            保存
          </Button>
        </div>,
      ]}
    >
      <Form style={{ width: '100%' }} form={form}>
        <SelectAddListForm
          personList={hasExArrangeList}
          projectName="testName"
          onAddPeople={(people) => setArrangePeople(people)}
          notArrangeShow={isPassArrangePeople}
          onSetPassArrangeStatus={(flag) => setIsPassArrangePeople(flag)}
        />
      </Form>
    </Modal>
  );
};

export default ExternalArrangeForm;
