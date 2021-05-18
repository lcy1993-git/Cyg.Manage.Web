import material from '@/pages/resource-config/material';
import { useBoolean, useRequest } from 'ahooks';
import React, { FC, useEffect, useState } from 'react';
import UrlSelect from '../url-select';
import styles from './index.less';
interface CascaderProps {
  onChange?: (spec: string) => void;
  libId: string;
  requestSource: 'project' | 'common' | 'resource' | 'material' | 'component';
  urlHead: string;
}

const CascaderUrlSelect: FC<CascaderProps> = (props) => {
  const { onChange, libId, requestSource, urlHead } = props;
  const [active, setActive] = useState<boolean>(true);
  const [spec, setSpec] = useState<string>();
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [trigger, { toggle, setTrue }] = useBoolean(false);

  const onNameChange = (v: { label: string; value: string }) => {
    if (v) {
      setName(v.label);
      setId(v.value);
      setActive(false);
      setSpec(undefined);
      toggle();
    } else {
      setName(undefined);
      setId(undefined);
    }
  };

  const onSpecChange = (v: string) => {
    setSpec(v);
  };

  useEffect(() => {
    onChange?.(spec);
  }, [spec, name]);
  return (
    <div className={styles.cascader}>
      <UrlSelect
        requestSource={requestSource}
        url={`/${urlHead}/GetList`}
        valueKey={`id`}
        titleKey={`${requestSource}Name`}
        labelInValue
        className={styles.selectItem}
        onChange={(value) => onNameChange(value as { label: string; value: string })}
        requestType="post"
        postType="query"
        placeholder={`${requestSource === 'material' ? '物料1' : '组件1'}`}
        libId={libId}
      />
      <UrlSelect
        requestSource={requestSource}
        url={`/${urlHead}/GetListByName`}
        manual={active}
        trigger={trigger}
        value={spec}
        extraParams={{ libId, name }}
        className={styles.selectItem}
        valueKey={`id`}
        titleKey={`${requestSource === 'material' ? 'spec' : 'componentSpec'}`}
        onChange={(value) => onSpecChange(value as string)}
        requestType="post"
        postType="body"
        placeholder={`${requestSource === 'material' ? '物料2' : '组件2'}`}
      />
    </div>
  );
};

export default CascaderUrlSelect;
