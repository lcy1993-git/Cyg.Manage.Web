import React, { FC, useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { Divider, Dropdown, Input, message, Radio, Spin } from 'antd';

import {
  queryOuterAuditUserByPhoneAndUsername,
  UserInfo,
} from '@/services/project-management/select-add-list-form';
const { Search } = Input;
export interface SelectAddListFormProps {
  personList?: UserInfo[];
  projectName?: string;
  onAddPeople: (userInfo: UserInfo[]) => void; //获取添加的外审人员list
  notArrangeShow?: boolean; //checkbox的标志用来是否显示不安排外审的内容
  onSetPassArrangeStatus?: (flag: boolean) => void; //获取外审通不通过状态的callback
}
import styles from './index.less';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';

const SelectAddListForm: FC<SelectAddListFormProps> = (props) => {
  const {
    personList = [],
    onAddPeople,
    notArrangeShow = false,
    onSetPassArrangeStatus,
    projectName,
  } = props;
  const [keyword, setKeyword] = useState<string>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [notArrangePeopleStatus, setNotArrangePeopleStatus] = useState<boolean>(false);
  const [people, setPeople] = useState<UserInfo[]>(personList);
  const [options, setOptions] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);

  /**
   * 获取外审人员
   */

  const onSearch = () => {
    setOptions([]);
    if (keyword) {
      setFetching(true);
      setDropDownVisible(true);
      queryOuterAuditUserByPhoneAndUsername(keyword).then((userInfo) => {
        if (userInfo) {
          const option = {
            ...userInfo,
          };

          setOptions([option]);
        } else {
          setDropDownVisible(false);
          message.warn('账号不存在！请重新输入');
        }
        setFetching(false);
      });
    }
  };

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
      <CyFormItem label="账号" name="outerAuditUsers">
        <Dropdown overlay={OptionList} >
          <Search
            placeholder="请输入项目名称"
            enterButton
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => onSearch()}
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
