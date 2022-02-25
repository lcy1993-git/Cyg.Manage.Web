import { getUseFulMapList } from '@/services/visualization-results/visualization-results'
import { CloseOutlined } from '@ant-design/icons'
import { message, Select } from 'antd'
import Map from 'ol/Map'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useHistory } from 'umi'
import { changBaseMap } from './changeBaseMap'
import styles from './index.less'

interface CheckSourceProps {
  type: string | number
  map: Map
  setSourceType: Dispatch<SetStateAction<string>>
}

const CheckSource: React.FC<CheckSourceProps> = ({ type, map, setSourceType }) => {
  const history = useHistory()

  const [options, setOptions] = useState([])

  useEffect(() => {
    if (type) {
      const server = localStorage.getItem('serverCode')
      if (!server || server === 'undefined') {
        history.push('/login')
      } else {
        getUseFulMapList({
          serverCode: server,
          layerType: type,
          enableStatus: 1,
          availableStatus: 0,
        }).then((res) => {
          if (res.code === 200 && res.isSuccess) {
            const currentOptions = res.data.reduce((pre: any[], val: any) => {
              return [
                ...pre,
                {
                  text: val.anotherName,
                  value: val.url,
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

  const close = () => {
    setSourceType('')
  }

  const onSelect = (url: string) => {
    changBaseMap(type, url, map)
  }

  return !!type ? (
    <div className={styles.checkSourceWrap}>
      <div className={styles.title}>
        <span>切换地图源</span>
        <CloseOutlined className={styles.close} onClick={close} />
      </div>
      <hr></hr>
      <Select onSelect={onSelect} style={{ width: '100%' }} options={options}></Select>
    </div>
  ) : null
}

export default CheckSource
