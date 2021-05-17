import React, { SetStateAction, useState } from 'react';
import { Button, Divider, Form, message, Modal, Radio } from 'antd';

import { useControllableValue } from 'ahooks';
// import uuid from 'node-uuid';
import { Dispatch } from 'react';
// import { UserInfo } from '@/services/project-management/select-add-list-form';
// import { Checkbox } from 'antd';
import { executeExternalArrange } from '@/services/project-management/all-project';
import styles from './index.less';

interface GetGroupUserProps {
  onChange?: Dispatch<SetStateAction<boolean>>;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
  visible: boolean;
  projectId: string;
  stepData?: any;
}

const ExternalListModal: React.FC<GetGroupUserProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  // const [userName, setUserName] = useState<string>('');
  // const [reviewStatus, setReviewStatus] = useState<number>(0);
  //   const [status, setUserName] = useState<string>('');

  // const [arrangePeople, setArrangePeople] = useState<UserInfo[]>([]); //添加的外审人员列表
  const [isPassExternalArrange, setIsPassExternalArrange] = useState<boolean>(false);

  const [form] = Form.useForm();
  const { stepData, projectId } = props;

  console.log(stepData);

  // const modalCloseEvent = () => {
  //   setState(false);
  //   form.resetFields();
  // };
  //   const hasExArrangeList = useMemo(() => {
  //     if (arrangeUsers) {
  //       return arrangeUsers?.map((item: any) => {
  //         return {
  //           value: item.userId,
  //           text: item.userNameText,
  //         };
  //       });
  //     }
  //     return;
  //   }, [arrangeUsers]);

  //   const handleExternalMen = useMemo(() => {
  //     if (hasExArrangeList) {
  //       return hasExArrangeList.map((item: any) => {
  //         return item.value;
  //       });
  //     }
  //     return;
  //   }, [arrangePeople]);

  const executeArrangeEvent = async () => {
    await executeExternalArrange({
      projectId: projectId,
      parameter: { 是否结束: `${isPassExternalArrange}` },
    });
    message.error('外审通过测试');
  };

  return (
    <Modal
      title="外审列表"
      visible={state as boolean}
      maskClosable={false}
      width={750}
      onCancel={() => setState(false)}
      destroyOnClose
      // onCancel={() => modalCloseEvent()}
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
        {stepData.map((el: any, idx: any) => (
          <div className={styles.single} key={el.id}>
            <div>外审 {idx + 1}</div>
            <div>{el.expectExecutorNickName}</div>
            <div className={styles.status}>{el.statusDescription}</div>
          </div>
        ))}

        <Button type="primary">修改外审</Button>
      </div>

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
    </Modal>
  );
};

export default ExternalListModal;
