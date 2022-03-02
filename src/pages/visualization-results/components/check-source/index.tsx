import { getUseFulMapList } from '@/services/visualization-results/visualization-results'
import { useClickAway } from 'ahooks'
import { message, Select } from 'antd'
import Map from 'ol/Map'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useHistory } from 'umi'
import { changBaseMap } from './changeBaseMap'
import styles from './index.less'

interface CheckSourceProps {
  type: string | number
  map: Map
  setSourceType: Dispatch<SetStateAction<string>>
}

const CheckSource: React.FC<CheckSourceProps> = ({
  type,
  map,
  setSourceType,
  street,
  setStreet,
  satellite,
  setSatellite,
}) => {
  const history = useHistory()

  const [options, setOptions] = useState<any>(null)

  const ref = useRef<HTMLDivElement>(null)

  const close = () => {
    setSourceType('')
  }

  const onSelect = (url: string) => {
    changBaseMap(type, url, map)
    const index = options.findIndex((i: any) => i.value === url)
    type === 1 ? setStreet(index) : setSatellite(index)
    close()
  }

  useClickAway((e) => {
    // @ts-ignore
    e.srcElement!.nodeName === 'CANVAS' && close()
  }, ref)

  useEffect(() => {
    if (type) {
      const server = localStorage.getItem('serverCode')
      if (!server || server === 'undefined') {
        history.push('/login')
      } else {
        getUseFulMapList({
          // serverCode: '171.223.214.154' || server,
          serverCode: server,
          layerType: type,
          enableStatus: 1,
          // availableStatus: 0,
        }).then((res) => {
          if (res.code === 200 && res.isSuccess) {
            const currentOptions = res.data.reduce((pre: any[], val: any, index: number) => {
              return [
                ...pre,
                {
                  label: `数据源${index + 1}`,
                  value: val.url.replace(
                    '{s}',
                    '{' + val.servers[0] + '-' + val.servers[val.servers.length - 1] + '}'
                  ),
                },
              ]
            }, [])
            setOptions(currentOptions)
          } else {
            message.error('获取地图资源失败，请重试')
            close()
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return !!type ? (
    <div ref={ref} className={styles.checkSourceWrap}>
      <div className={styles.title}>
        <span>切换地图源</span>
        {/* <CloseOutlined className={styles.close} onClick={close} /> */}
      </div>
      <hr></hr>
      {options && (
        <Select
          defaultValue={options[type === 1 ? street : satellite]?.label || '数据源1'}
          onSelect={onSelect}
          style={{ width: '100%' }}
          options={options}
          key={type + options[type === 1 ? street : satellite]?.label}
        ></Select>
      )}
    </div>
  ) : null
}

export default CheckSource
