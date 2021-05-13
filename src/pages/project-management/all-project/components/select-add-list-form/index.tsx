import React, { FC, useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { Divider, Form, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import {
  queryOuterAuditUserByPhoneAndUsername,
  UserInfo,
} from '@/services/project-management/select-add-list-form';
export interface SelectAddListFormProps {}
import styles from './index.less';
import { useRequest } from 'ahooks';
import { SelectValue } from 'antd/lib/select';
const SelectAddListForm: FC<SelectAddListFormProps> = (props) => {
  const debounceTimeout = 800;
  const [keyword, setkeyword] = useState<SelectValue>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      setOptions([]);
      setFetching(true);

      queryOuterAuditUserByPhoneAndUsername(value).then((userInfo) => {
        if (userInfo) {
          const option = <Select.Option value={12} children={123} />;
          setOptions([option]);
        }

        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [queryOuterAuditUserByPhoneAndUsername]);

  return (
    <div>
      <Select
        className={styles.selectForm}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        showSearch
        onSearch={debounceFetcher}
        options={options}
        placeholder="请输入账号/手机号"
      />

      <div className={styles.title}>外审人员列表</div>
    </div>
  );
};

export default SelectAddListForm;
