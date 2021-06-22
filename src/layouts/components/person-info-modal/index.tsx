import { editUserInfo, getUserInfo } from '@/services/user/user-info';
import { useControllableValue, useRequest } from 'ahooks';
import { Form, Input, message } from 'antd';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import styles from './index.less';
import { useEffect } from 'react';
import ChangePhoneModal from '../person-changephone-modal/inedx';
import Rule from './person-info-rule';

interface PersonInfoModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

/**
 * 判断用户是否已经为绑定手机状态
 * @绑定手机 type = 0
 * @修改手机 type = 1
 */
type Type = 0 | 1 | undefined;
interface typeObject {
  title: string;
  type: Type;
}

const PersonInfoModal: React.FC<PersonInfoModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [changePhoneVisibel, setChangePhoneVisibel] = useState<boolean>(false);

  const { data: userInfo, run: getUserInfoEvent } = useRequest(() => getUserInfo(), {
    manual: true,
    onSuccess: () => {
      form.setFieldsValue({
        ...userInfo,
      });
    },
  });

  const [form] = Form.useForm();

  // 修改手机或绑定手机类型
  const typeObject: typeObject = useMemo(() => {
    if (userInfo?.phone) {
      return {
        title: '换绑',
        type: 1,
      };
    }
    return {
      title: '绑定',
      type: 0,
    };
  }, [JSON.stringify(userInfo)]);

  const closeModalEvent = () => {
    setState(false);
    form.resetFields();
  };

  const openModalEvent = () => {
    form.validateFields().then(async (value) => {
      await editUserInfo(value);
      message.success('用户信息修改成功');
      setState(false);
    });
  };

  useEffect(() => {
    if (state) {
      getUserInfoEvent();
    }
  }, [state]);

  const handleChangePhone = () => {
    setChangePhoneVisibel(true);
  };

  const closeChangePhoneModal = () => {
    setChangePhoneVisibel(false);
  };

  return (
    <Modal
      maskClosable={false}
      title="个人信息"
      bodyStyle={{ padding: '0px 20px' }}
      destroyOnClose
      width={750}
      visible={state as boolean}
      okText="确定"
      cancelText="取消"
      onCancel={() => closeModalEvent()}
      onOk={() => openModalEvent()}
    >
      {changePhoneVisibel && (
        <ChangePhoneModal
          visble={changePhoneVisibel}
          closeChangePhoneModal={closeChangePhoneModal}
          reload={getUserInfoEvent}
          type={typeObject.type}
          typeTitle={typeObject.title}
        />
      )}
      <Form form={form} preserve={false}>
        <div className={styles.personInfoItem}>
          <div className={styles.personInfoItemLabel}>用户名</div>
          <div className={styles.personInfoItemContent}>{userInfo?.userName}</div>
        </div>
        <div className={styles.personInfoItem}>
          <div className={styles.personInfoItemLabel}>公司</div>
          <div className={styles.personInfoItemContent}>{userInfo?.companyName}</div>
        </div>
        <div className={styles.personInfoItem}>
          <div className={styles.personInfoItemLabel}>角色</div>
          <div className={styles.personInfoItemContent}>{userInfo?.roleName}</div>
        </div>
        <div className={styles.personInfoItem}>
          <div className={styles.personInfoItemLabel}>手机</div>
          <div className={styles.personInfoItemContent}>{userInfo?.phone}</div>
          <div className={styles.personInfoItemButton} onClick={handleChangePhone}>
            {typeObject.title}
          </div>
        </div>
        <div className={styles.personEditItem}>
          <div className={styles.personEditItemLabel}>邮箱</div>
          <div className={styles.personEditItemContent}>
            <Form.Item name="email" rules={Rule.email}>
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className={styles.personEditItem}>
          <div className={styles.personEditItemLabel}>昵称</div>
          <div className={styles.personEditItemContent}>
            <Form.Item name="nickName" rules={Rule.nickName}>
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className={styles.personEditItem}>
          <div className={styles.personEditItemLabel}>真实姓名</div>
          <div className={styles.personEditItemContent}>
            <Form.Item name="name" rules={Rule.name}>
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PersonInfoModal;
