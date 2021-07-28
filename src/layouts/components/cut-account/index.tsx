import CyFormItem from '@/components/cy-form-item';
import { userLoginRequest } from '@/services/login';
import { useGetUserInfo } from '@/utils/hooks';
import { flatten } from '@/utils/utils';
import { useControllableValue } from 'ahooks';
import { Form, Input, message, Modal } from 'antd';
import React, { Dispatch } from 'react';
import { SetStateAction } from 'react';

import { history } from 'umi';

interface EditPasswordProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  againLogin?: boolean
  finishEvent?: () => void
}

const CutAccount = (props: EditPasswordProps) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { againLogin = false,finishEvent } = props;
  const [form] = Form.useForm();

  const sureCutAccount = () => {
    form.validateFields().then(async (value) => {
      const { userName, pwd } = value;
      // TODO 快捷切换
      const resData = await userLoginRequest({ userName, pwd });

      // 如果这次登录的账号跟之前的不一样，那么就只到首页
      const lastAccount = useGetUserInfo();

      const isLastAccount = (lastAccount && lastAccount.userName === userName);

      const { accessToken, modules, user } = resData;

      const buttonModules = flatten(modules);
      const buttonArray = buttonModules
        .filter((item: any) => item.category === 3)
        .map((item: any) => item.authCode);

      localStorage.setItem('Authorization', accessToken);
      localStorage.setItem('functionModules', JSON.stringify(modules));
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray));

      if (!againLogin || !isLastAccount) {
        setState(false);
        message.success('账户快捷登录成功');
        history.push('/index');
        location.reload();
      }else {
        finishEvent?.();
        //history.go(-1);
        setState(false);
      }
    });
  };

  const onKeyDownLogin = (e: any) => {
    if (e.keyCode == 13) {
      sureCutAccount();
    }
  };

  const cancelEvent = () => {
    if(!againLogin) {
      setState(false);
    }else {
      history.push("/login")
    }
  }

  return (
    <Modal
      maskClosable={false}
      title="快捷登录"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      cancelText="取消"
      onCancel={() => cancelEvent()}
      onOk={() => sureCutAccount()}
    >
      <Form form={form} preserve={false} onKeyDown={(e) => onKeyDownLogin(e)}>
        <CyFormItem
          name="userName"
          label="用户名"
          required
          labelWidth={100}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </CyFormItem>
        <CyFormItem
          name="pwd"
          label="密码"
          required
          labelWidth={100}
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input type="password" placeholder="请输入" />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default CutAccount;
