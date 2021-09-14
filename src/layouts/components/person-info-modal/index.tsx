import { editUserInfo, getUserInfo } from '@/services/user/user-info';
import { useControllableValue, useRequest } from 'ahooks';
import { Input, message } from 'antd';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './index.less';
import { useEffect } from 'react';
import PhoneInfo from './components/phone-info';
import PersonInfoRow from './components/person-info-row';
import { Button } from 'antd';
// import EmailInfo from './components/email-info';
import { useRef } from 'react';

interface PersonInfoModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const PersonInfoModal: React.FC<PersonInfoModalProps> = (props) => {
  const { userType = '' } = JSON.parse(localStorage.getItem('userInfo') ?? '');

  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [closeState, setCloseState] = useState<boolean>(false);

  const nameRef = useRef<Input>(null);
  const emailRef = useRef<Input>(null);

  const { data: userInfo, run: request } = useRequest(() => getUserInfo(), {
    manual: true,
  });

  const run = () => {
    request();
    setCloseState(!closeState);
  };

  useEffect(() => {
    request();
  }, []);

  return (
    <Modal
      maskClosable={false}
      title="个人信息"
      bodyStyle={{ padding: '0px 20px' }}
      destroyOnClose
      width={750}
      visible={state as boolean}
      // visible={true}
      okText="确定"
      cancelText="取消"
      onCancel={() => setState(false)}
      footer={false}
    >
      <div className={styles.companyInfoWrap}>
        <div className={styles.companyInfoRow}>
          <div className={styles.title}>用户名</div>
          <div className={styles.content}>{userInfo?.userName}</div>
        </div>
        <div className={styles.companyInfoRow}>
          <div className={styles.title}>公司</div>
          <div className={styles.content}>{userInfo?.companyName}</div>
        </div>
        <div className={styles.companyInfoRow}>
          <div className={styles.title}>角色</div>
          <div className={styles.content}>{userInfo?.roleName}</div>
        </div>
      </div>
      <PersonInfoRow
        name={userInfo?.phone}
        title="手机"
        expandState={closeState}
        editNode={<PhoneInfo phone={userInfo?.phone} refresh={run} />}
      />
      <PersonInfoRow
        name={userInfo?.email}
        title="邮箱"
        expandState={closeState}
        editNode={
          <div className={styles.nodeWrap}>
            <div className={styles.input}>
              <Input ref={emailRef} style={{ width: '90%' }} placeholder="请填写您的邮箱"></Input>
            </div>
            <div className={styles.button}>
              <Button
                type="primary"
                onClick={() => {
                  const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if (!regEmail.test(emailRef.current!.input.value)) {
                    message.error('邮箱格式有误');
                    return;
                  } else if (emailRef.current!.input.value === userInfo?.email) {
                    message.error('更换的邮箱号不能与原邮箱号相同');
                    return;
                  }
                  editUserInfo({ ...userInfo, email: emailRef.current!.input.value }).then(() => {
                    run();
                    message.success('邮箱更新成功');
                  });
                }}
              >
                保存
              </Button>
            </div>
          </div>
        }
      ></PersonInfoRow>

      <PersonInfoRow
        name={userInfo?.name}
        title="姓名"
        expandState={closeState}
        editNode={
          userType === 2 ? (
            false
          ) : (
            <div className={styles.nodeWrap}>
              <div className={styles.input}>
                <Input
                  ref={nameRef}
                  style={{ width: '90%' }}
                  placeholder="请填写您的真实姓名"
                ></Input>
              </div>
              <div className={styles.button}>
                <Button
                  type="primary"
                  onClick={() => {
                    editUserInfo({ ...userInfo, name: nameRef.current!.input.value }).then(() => {
                      run();
                      message.success('真实姓名更新成功');
                    });
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          )
        }
      ></PersonInfoRow>
    </Modal>
  );
};

export default PersonInfoModal;
