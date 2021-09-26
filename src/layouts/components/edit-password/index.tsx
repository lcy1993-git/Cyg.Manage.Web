import CyFormItem from '@/components/cy-form-item';
import { editPassword } from '@/services/user/user-info';
import { useControllableValue } from 'ahooks';
import { Form, Input, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { history } from 'umi';

interface EditPasswordProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const EditPassword = (props: EditPasswordProps) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [form] = Form.useForm();

  const sureEditPassword = () => {
    form.validateFields().then(async (value) => {
      const { pwd, newPwd } = value;
      await editPassword({ pwd, newPwd });

      setState(false);
      message.info('密码已经修改,请重新登录');

      history.push('/again-login');
      localStorage.setItem('Authorization', '');
    });
  };

  return (
    <Modal
      maskClosable={false}
      title="修改密码"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      cancelText="取消"
      onCancel={() => setState(false)}
      onOk={() => sureEditPassword()}
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          name="pwd"
          label="原密码"
          required
          labelWidth={100}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
          ]}
        >
          <Input type="password" placeholder="请输入" onPaste={(e) => e.preventDefault()} />
        </CyFormItem>
        <CyFormItem
          name="newPwd"
          label="新密码"
          required
          labelWidth={100}
          hasFeedback
          rules={[
            { required: true, message: '密码不能为空' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
              message: '密码必须由(8-20)位数字和大小写字母组成',
            },
          ]}
        >
          <Input type="password" placeholder="请输入" onPaste={(e) => e.preventDefault()} />
        </CyFormItem>
        <CyFormItem
          name="confirmPassword"
          label="确认密码"
          required
          labelWidth={100}
          hasFeedback
          dependencies={['newPwd']}
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPwd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码输入不一致，请确认');
              },
            }),
          ]}
        >
          <Input type="password" placeholder="请输入" onPaste={(e) => e.preventDefault()} />
        </CyFormItem>
      </Form>
    </Modal>
  );
};

export default EditPassword;
