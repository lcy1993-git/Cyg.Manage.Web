import { getDataByUrl } from '@/services/common'
import { useBoolean, useRequest } from 'ahooks'
import { Select } from 'antd'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import UrlSelect from '../url-select'
import styles from './index.less'
interface CascaderProps {
  onChange?: (spec?: string) => void
  libId: string
  requestSource?: 'project' | 'common' | 'resource'
  urlHead?: string
  value?: any
  type?: 'name' | 'spec'
  setSelectName?: Dispatch<SetStateAction<string>>
  selectName?: string
}

const CascaderUrlSelect: FC<CascaderProps> = React.memo((props) => {
  const {
    onChange,
    libId,
    requestSource = 'resource',
    urlHead = '',
    value,
    type = '',
    selectName,
    setSelectName,
  } = props

  const [id, setId] = useState<string>()
  const [name, setName] = useState<string>()
  // const { data: nameReponseData, run: fetchSpecRequest } = useRequest(
  //   (selectName) =>
  //     getDataByUrl(
  //       `/${urlHead}/GetListByName`,
  //       { libId, selectName },
  //       requestSource,
  //       'post',
  //       'body',
  //       libId,
  //     ),
  //   {
  //     // manual: true,
  //     refreshDeps: [selectName],
  //     onSuccess: () => {},
  //   },
  // );

  const placeholder =
    urlHead === 'Material'
      ? '请选择物料'
      : urlHead === 'Component'
      ? '请选择组件'
      : '请选择物料/组件'

  const fetchUrl =
    urlHead === 'Material'
      ? `/Material/GetMaterialNameList?libId=${libId}`
      : `/Component/GetNameList?libId=${libId}`
  const fetchFn = () => getDataByUrl(fetchUrl, {}, requestSource, 'post', 'body', '')
  /**
   * 根据上面名字获取spec的id
   */
  const { data: specReponseData } = useRequest(fetchFn, {
    // ready: !urlHead,
    refreshDeps: [urlHead],
  })

  const onSpecChange = (value: string) => {
    if (value) {
      setId(value)
    } else {
      setId(undefined)
    }
  }

  const onNameChange = (v: string) => {
    console.log(v)

    if (v) {
      setId(undefined)
      setName(v)
      setSelectName?.(v)
      // fetchSpecRequest(v);
    } else {
      setName(undefined)
    }
  }

  useEffect(() => {
    onChange?.(id)
  }, [id])

  // useEffect(() => {
  //   if (value && value !== id) {
  //     setName(value.name);
  //     // fetchSpecRequest(value.name);
  //     setId(value.id);
  //   }
  // }, [value]);
  return (
    <div className={styles.cascader}>
      <Select
        placeholder={`${placeholder}名称`}
        allowClear
        // bordered={false}
        value={name}
        onChange={(value) => onNameChange(value as string)}
      >
        {urlHead &&
          specReponseData?.map((v: string) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
      </Select>
    </div>
  )
})

export default CascaderUrlSelect
