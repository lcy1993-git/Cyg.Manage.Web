import React, { SetStateAction, useState } from 'react';
import { Button, Form, message, Modal } from 'antd';

import { useControllableValue, useRequest } from 'ahooks';
import SelectAddListForm from '../select-add-list-form';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
import { UserInfo } from '@/services/project-management/select-add-list-form';
import { modifyExternalArrange, getAllotUsers } from '@/services/project-management/all-project';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  visible: boolean;
  projectId: string;
  // notBeginUsers: any;
  closeModalEvent?: () => void;
}

const EditExternalArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [arrangePeople, setArrangePeople] = useState<UserInfo[]>([]); //添加的外审人员列表
  const [initPeople, setInitPeople] = useState<any[]>([]);

  // const [isPassArrangePeople, setIsPassArrangePeople] = useState<boolean>(false); //不安排外审status
  // const [addUserIds, setAddUserIds] = useState<string[]>([]);
  // const [delUserIds, setDelUserIds] = useState<string[]>([]);

  const [form] = Form.useForm();
  const { projectId, closeModalEvent } = props;

  //获取新增外审
  function getAddUsers(preArray: any, nexArray: any) {
    return nexArray
      .map((item: any) => {
        if (!preArray.includes(item)) {
          return item.value;
        }
        return;
      })
      .filter(Boolean);
  }

  //获取删除外审
  function getDelUsers(preArray: any, nexArray: any) {
    if (preArray.length === 0) {
      return [];
    }

    return preArray
      .filter((item: any) => !nexArray.includes(item))
      .map((item: any) => {
        return item.value;
      });
  }

  const saveExternalArrange = async () => {
    await modifyExternalArrange({
      projectId: projectId,
      addUserIds: getAddUsers(initPeople, arrangePeople),
      delUserIds: getDelUsers(initPeople, arrangePeople),
    });
    message.success('外审修改成功');
    closeModalEvent?.();
    setState(false);
  };

  const { data: AllotUsers } = useRequest(() => getAllotUsers(projectId, 6), {
    onSuccess: () => {
      const handleData = AllotUsers?.map((item: any) => {
        if (item.canDel) {
          return {
            value: item.userId,
            text: item.userNameText,
          };
        }
        return;
      }).filter(Boolean);
      setInitPeople(handleData ?? []);
    },
  });

  return (
    <Modal
      title="修改外审"
      visible={state as boolean}
      maskClosable={false}
      width={700}
      onCancel={() => setState(false)}
      destroyOnClose
      footer={[
        <div key="edit">
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>

          <Button key="save" type="primary" onClick={() => saveExternalArrange()}>
            提交
          </Button>
        </div>,
      ]}
    >
      <Form style={{ width: '100%' }} form={form}>
        <SelectAddListForm
          initPeople={initPeople}
          onChange={(people) => setArrangePeople(people)}
        />
      </Form>
    </Modal>
  );
};

export default EditExternalArrangeForm;
