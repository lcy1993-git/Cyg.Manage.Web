import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { Divider, Dropdown, Form, Input, Menu, message, Radio, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import {
  queryOuterAuditUserByPhoneAndUsername,
  UserInfo,
} from '@/services/project-management/select-add-list-form';
export interface SelectAddListFormProps {
  personList?: UserInfo[];
  /**
   * sketch是没有不安排外审的，第一种和第三种种
   * confirm有不安排外审的，第二种
   *
   */
  projectName?: string;
  onAddPeople: (userInfo: UserInfo[]) => void; //获取添加的外审人员list
  notArrangeShow?: boolean; //checkbox的标志用来是否显示不安排外审的内容
  onSetPassArrangeStatus?: (flag: boolean) => void; //获取外审通不通过状态的callback
}
import styles from './index.less';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';

const SelectAddListForm: FC<SelectAddListFormProps> = (props) => {
  const {
    personList,
    onAddPeople,
    notArrangeShow = false,
    onSetPassArrangeStatus,
    type,
    projectName,
  } = props;
  const debounceTimeout = 800;
  const [fetching, setFetching] = useState<boolean>(false);
  const [notArrangePeopleStatus, setNotArrangePeopleStatus] = useState<boolean>(false);
  const [people, setPeople] = useState<UserInfo[]>(personList ?? []);
  const [options, setOptions] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);

  /**
   * 获取外审人员
   */
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      if (value) {
        setOptions([]);
        setFetching(true);
        queryOuterAuditUserByPhoneAndUsername(value).then((userInfo) => {
          if (userInfo) {
            const option = {
              ...userInfo,
            };

            setOptions([option]);
          } else {
            message.warn('账号不存在！请重新输入');
          }

          setFetching(false);
        });
      }
    };

    return debounce(loadOptions, debounceTimeout);
  }, [queryOuterAuditUserByPhoneAndUsername]);

  const OptionList = () => {
    return (
      <div className={styles.optionList}>
        {fetching ? (
          <Spin size="small" />
        ) : options.length ? (
          options.map((option) => {
            return (
              <div className={styles.optionItem} key={option.value}>
                <div>{option.text}</div>{' '}
                <div className={styles.icon}>
                  <UserAddOutlined
                    onClick={() => {
                      onAddPeople([...people.filter((v) => v.value !== option.value), option]);
                      setPeople([...people.filter((v) => v.value !== option.value), option]);
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div>无任何内容</div>
        )}
      </div>
    );
  };

  const People = () => {
    return (
      <div className={styles.people}>
        {people.map((p, idx) => (
          <div className={styles.person} key={p.value}>
            <div>外审 {idx + 1}</div>
            <div>{p.text}</div>
            <div className={styles.icon}>
              <CloseCircleOutlined
                onClick={() => {
                  setPeople([...people.filter((v) => v.value !== p.value)]);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const onSetNotArrangePeopleStatus = (notArrangeStatus: boolean) => {
    onSetPassArrangeStatus?.(notArrangeStatus);
    setNotArrangePeopleStatus(notArrangeStatus);
  };

  return (
    <div className={styles.selectForm}>
      <CyFormItem label="账号">
        <Dropdown overlay={OptionList}>
          <Input
            placeholder="请输入账号/手机号"
            onChange={(e) => debounceFetcher(e.target.value)}
          />
        </Dropdown>
      </CyFormItem>
      <div className={styles.title}>外审人员列表</div>
      <People />

      {notArrangeShow && projectName ? (
        <>
          <Divider />
          <div className={styles.notArrange}>
            <p style={{ textAlign: 'center' }}>请确认项目：{projectName}是否通过外审</p>
            <Radio.Group
              onChange={(e) => onSetNotArrangePeopleStatus(e.target.value)}
              value={notArrangePeopleStatus}
            >
              <Radio value={false}>外审不通过</Radio>
              <Radio value={true}>外审通过</Radio>
            </Radio.Group>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SelectAddListForm;
