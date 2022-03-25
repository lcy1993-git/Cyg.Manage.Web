import {
  getCustomMapList,
  getMapList,
} from '@/services/visualization-results/visualization-results'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'

export const useCurrentRef = <T>(value: any): T => {
  const ref = React.useRef<T>(value)
  return ref.current
}

export const useVecUrl = () => {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    getCustomMapList({ isEnable: 1 })
      .then((res: any) => {
        let vecUrl = ''
        if (res && res.length > 0) {
          const data = res[0]
          vecUrl = data.url.replace(
            '{s}',
            '{' + data.hostId[0] + '-' + data.hostId[data.hostId.length - 1] + '}'
          )
          setUrl(vecUrl)
          window.localStorage.setItem('vecUrl', vecUrl)
        } else {
          getMapList({ sourceType: 0, layerType: 0, enableStatus: 1, availableStatus: 0 })
            .then((res) => {
              if (res.code === 200 && res.isSuccess) {
                let vecUrl = '',
                  streetUrl = ''
                res.data.forEach((item: any) => {
                  if (item.layerType === 1) {
                    // vecUrl = item.url.replace('{s}', '{' + item.servers.split(',')[0] + '-' + item.servers.split(',')[item.servers.split(',').length - 1] + '}');
                    vecUrl = item.url.replace(
                      '{s}',
                      '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}'
                    )
                  } else if (item.layerType === 2) {
                    streetUrl = item.url.replace(
                      '{s}',
                      '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}'
                    )
                  }
                })
                setUrl(vecUrl)
                window.localStorage.setItem('vecUrl', vecUrl)
                window.localStorage.setItem('streetUrl', streetUrl)
              } else {
                message.error('获取地图资源失败，请重试')
              }
            })
            .catch((err) => {})
        }
      })
      .catch((err) => {})
    // getMapList({ sourceType: 0, layerType: 0, enableStatus: 1, availableStatus: 0 }).then((res) => {
    //   if (res.code === 200 && res.isSuccess) {
    //     let vecUrl = '',
    //       streetUrl = ''
    //     res.data.forEach((item: any) => {
    //       if (item.layerType === 1) {
    //         // vecUrl = item.url.replace('{s}', '{' + item.servers.split(',')[0] + '-' + item.servers.split(',')[item.servers.split(',').length - 1] + '}');
    //         vecUrl = item.url.replace(
    //           '{s}',
    //           '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}'
    //         )
    //       } else if (item.layerType === 2) {
    //         streetUrl = item.url.replace(
    //           '{s}',
    //           '{' + item.servers[0] + '-' + item.servers[item.servers.length - 1] + '}'
    //         )
    //       }
    //     })
    //     setUrl(vecUrl)
    //     window.localStorage.setItem('vecUrl', vecUrl)
    //     window.localStorage.setItem('streetUrl', streetUrl)
    //   } else {
    //     message.error('获取地图资源失败，请重试')
    //   }
    // })
  }, [])
  return [url]
}
