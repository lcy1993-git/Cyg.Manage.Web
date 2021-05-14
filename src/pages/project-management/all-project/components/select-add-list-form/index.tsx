import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { Divider, Dropdown, Form, Input, Menu, message, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import {
  queryOuterAuditUserByPhoneAndUsername,
  UserInfo,
} from '@/services/project-management/select-add-list-form';
export interface SelectAddListFormProps {
  personList?: UserInfo[];
}
import styles from './index.less';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';

const SelectAddListForm: FC<SelectAddListFormProps> = (props) => {
  const { personList } = props;
  const debounceTimeout = 800;
  const [fetching, setFetching] = useState<boolean>(false);
  const [people, setPeople] = useState<UserInfo[]>(personList ?? []);
  const [options, setOptions] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);

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

  return (
    <div className={styles.selectForm}>
      <CyFormItem label="账号" name='outerAuditUsers'>
        <Dropdown overlay={OptionList}>
          <Input
            placeholder="请输入账号/手机号"
            onChange={(e) => debounceFetcher(e.target.value)}
          />
        </Dropdown>
      </CyFormItem>

      <div className={styles.title}>外审人员列表</div>
      <People />
    </div>
  );
};

export default SelectAddListForm;
