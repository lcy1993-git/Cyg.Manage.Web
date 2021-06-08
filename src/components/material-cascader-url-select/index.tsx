import { getDataByUrl } from '@/services/common';
import { useBoolean, useRequest } from 'ahooks';
import { Select } from 'antd';
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

  const [id, setId] = useState<string>();
  const { data: nameReponseData, run: fetchSpecRequest } = useRequest(
    (name) =>
      getDataByUrl(
        `/${urlHead}/GetListByName`,
        { libId, name },
        requestSource,
        'post',
        'body',
        libId,
      ),
    {
      manual: true,
      onSuccess: () => {},
    },
  );

  const placeholder = urlHead === 'Material' ? '请选择物料' : '请选择组件';
  const key = urlHead === 'Material' ? 'materialId' : 'componentId';
  const speckey = urlHead === 'Material' ? 'spec' : 'componentSpec';
  const fetchUrl =
    urlHead === 'Material'
      ? `/Material/GetMaterialNameList?libId=${libId}`
      : `/Component/GetNameList?libId=${libId}`;
  const fetchFn = () => getDataByUrl(fetchUrl, {}, requestSource, 'post', 'body', '');
  /**
   * 根据上面名字获取spec的id
   */
  const { data: specReponseData } = useRequest(fetchFn);

  const onSpecChange = (v: { label: string; value: string }) => {
    if (v) {
      setId(v.value);
    } else {
      setId(undefined);
    }
  };

  const onNameChange = (v: string) => {
    if (v) {
      fetchSpecRequest(v);
    }
  };

  useEffect(() => {
    onChange?.(id);
  }, [id]);
  return (
    <div className={styles.cascader}>
      <Select
        placeholder={`${placeholder}名称`}
        allowClear
        onChange={(value) => onNameChange(value as string)}
        className={styles.selectItem}
      >
        {specReponseData?.map((v: string) => (
          <Select.Option key={v} value={v}>
            {v}
          </Select.Option>
        ))}
      </Select>
      <UrlSelect
        defaultData={nameReponseData}
        valueKey={key}
        titleKey={speckey}
        labelInValue
        allowClear
        placeholder={`${placeholder}型号`}
        className={styles.selectItem}
        onChange={(value) => onSpecChange(value as { label: string; value: string })}
        libId={libId}
      />

      {/* <UrlSelect
        defaultData={specReponseData}
        allowClear
        placeholder={`${placeholder}型号`}
        // valueKey={`${urlHead.toLocaleLowerCase()}Id`}
        // titleKey={`${specTitleKey}`}
      /> */}
    </div>
  );
});

export default CascaderUrlSelect;
