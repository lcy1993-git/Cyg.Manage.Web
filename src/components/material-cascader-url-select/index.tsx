import { getDataByUrl } from '@/services/common';
import { useBoolean, useRequest } from 'ahooks';
import React, { FC, useEffect, useState } from 'react';
import UrlSelect from '../url-select';
import styles from './index.less';
interface CascaderProps {
  onChange?: (spec?: string) => void;
  libId: string;
  requestSource?: 'project' | 'common' | 'resource';
  urlHead: string;
}

const CascaderUrlSelect: FC<CascaderProps> = React.memo((props) => {
  const { onChange, libId, requestSource = 'resource', urlHead } = props;
  const [spec, setSpec] = useState<string>();

  const { data: nameReponseData } = useRequest(
    () => getDataByUrl(`/${urlHead}/GetList`, {}, requestSource, 'post', 'params', libId),
    { refreshDeps: [urlHead, libId, requestSource] },
  );
   const specTitleKey = urlHead.toLocaleLowerCase() === 'material' ? 'spec' : 'componentSpec';
  /**
   * 根据上面名字获取spec的id
   */
  const { data: specReponseData, run: fetchSpecRequest } = useRequest(
    (name) =>
      getDataByUrl(
        `/${urlHead}/GetListByName`,
        { libId, name },
        requestSource,
        'post',
        'body',
        libId,
      ),
    { manual: true },
  );

  const onNameChange = (v: { label: string; value: string }) => {
    
    
    if (v) {
      setSpec(undefined);
      fetchSpecRequest(v.label);
    }
  };

  const onSpecChange = (v: string) => {
    console.log(123);
    setSpec(v);
  };

  useEffect(() => {
    onChange?.(spec);
  }, [spec]);
  return (
    <div className={styles.cascader}>
      <UrlSelect
        defaultData={nameReponseData}
        valueKey={`id`}
        titleKey={`${urlHead.toLocaleLowerCase()}Name`}
        labelInValue
        allowClear
        className={styles.selectItem}
        onChange={(value) => onNameChange(value as { label: string; value: string })}
        libId={libId}
      />
      <UrlSelect
        defaultData={specReponseData}
        allowClear
        className={styles.selectItem}
        valueKey={`${urlHead.toLocaleLowerCase()}Id`}
        titleKey={`${specTitleKey}`}
        onChange={(value) => onSpecChange(value as string)}
      />
    </div>
  );
});

export default CascaderUrlSelect;
