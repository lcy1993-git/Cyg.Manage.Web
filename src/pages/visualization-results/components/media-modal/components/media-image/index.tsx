import InputPercentNumber from '@/components/input-percent-number'
import { baseUrl } from '@/services/common'
import { handleGetUrl, uploadAuditLog } from '@/utils/utils'
import { DownloadOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, Modal } from 'antd'
import classNames from 'classnames'
import uuid from 'node-uuid'
import React, { useEffect, useRef, useState } from 'react'
import type { MediaData } from '../../getComponentsByData'
import styles from './index.less'

interface MediaImageProps {
  data: MediaData
  index: number
  preFullClick: () => void
  nextFullClick: () => void
  content: any[]
}

const MediaImage: React.FC<MediaImageProps> = ({ data, content, index }) => {
  const [currentPosition, setCurrentPosition] = useState([0, 0])

  const [downPosition, setDownPosition] = useState([0, 0])

  const [originPosition, setOriginPosition] = useState([0, 0])

  const [isDrag, setIsDrag] = useState(false)

  const [percent, setPercent] = useState<number>(100)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

  const [fsIndex, setFsIndex] = useState<number>(index)

  const imgRef = useRef<HTMLImageElement>(null)

  const outoSizeHandler = () => {
    setCurrentPosition([0, 0])
    setPercent(100)
  }

  useEffect(() => {
    if (percent === 100) {
      outoSizeHandler()
    }
  }, [percent])

  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : `http://${window.location.host}/api`

  const handleUrl = `${baseUrl.upload}/Download/GetFileById`

  // let targetUrl = handleSM2Crypto(`http://172.2.48.22${handleUrl}`)

  const targetUrl = handleGetUrl(
    { fileId: data.filePath, securityKey: '1201332565548359680', token: data.authorization },
    handleUrl
  )

  const finalUrl = `${currentHost}/commonGet${targetUrl}`

  const downLoad = () => {
    const downLoadUrl = `${currentHost}/commonGet${handleGetUrl(
      { fileId: data.filePath, securityKey: '1201332565548359680', token: data.authorization },
      handleUrl
    )}`
    const a = document.createElement('a')

    a.setAttribute('href', downLoadUrl)

    a.setAttribute('download', 'preview')
    a.click()

    uploadAuditLog([
      {
        auditType: 1,
        eventType: 5,
        eventDetailType: '文件下载',
        executionResult: '成功',
        auditLevel: 2,
        serviceAdress: `${baseUrl.project}/Download/GetFileById`,
      },
    ])
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (percent !== 100) {
      setDownPosition([e.clientX, e.clientY])
      setOriginPosition([...currentPosition])
      setIsDrag(true)
    }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDrag) {
      setCurrentPosition([
        originPosition[0] + e.clientX - downPosition[0],
        originPosition[1] + e.clientY - downPosition[1],
      ])
    }
  }

  useUpdateEffect(() => {
    imgRef.current!.style.transform = `translate3d(${currentPosition[0]}px, ${
      currentPosition[1]
    }px, 0px) scale(${percent / 100})`
  }, [JSON.stringify(currentPosition), percent])

  useUpdateEffect(() => {
    setCurrentPosition([0, 0])
    setPercent(100)
  }, [index])

  const checkPreImg = () => {
    let index = fsIndex
    do {
      index--
      if (index < 0) {
        index = content.length - 1
      }
    } while (content[index]?.type === 2)
    setFsIndex(index)
  }

  const checkNextImg = () => {
    let index = fsIndex
    do {
      index++
      if (index === content.length) {
        index = 0
      }
    } while (content[index]?.type === 2)
    setFsIndex(index)
  }

  return (
    <>
      <div className={styles.imagWrap}>
        <div className={styles.overhidden}>
          <img
            alt=""
            draggable={false}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={() => setIsDrag(false)}
            onMouseLeave={() => setIsDrag(false)}
            ref={imgRef}
            className={classNames(
              styles.img,
              percent === 100 ? styles.imgUnsetPointer : styles.imgSetMove
            )}
            crossOrigin={''}
            src={`${finalUrl}`}
          />
        </div>
        <div className={styles.AreaButtons}>
          <InputPercentNumber value={percent} onChange={setPercent} />
          <Button onClick={outoSizeHandler}>
            <FullscreenExitOutlined />
            合适尺寸
          </Button>
          <Button onClick={() => setIsFullScreen(true)}>
            <FullscreenOutlined />
            全屏
          </Button>
          <Button onClick={downLoad}>
            <DownloadOutlined />
            下载
          </Button>
        </div>
      </div>
      <div>
        <Modal
          visible={isFullScreen}
          className={styles.fullScreen}
          onCancel={() => setIsFullScreen(false)}
          width="100%"
          title={null}
          destroyOnClose={true}
          footer={false}
          style={{ top: 0 }}
        >
          <div className={styles.controls}>
            <div className={styles.left} onClick={checkPreImg} title="点击切换上一张"></div>
            <div className={styles.right} onClick={checkNextImg} title="点击切换下一张"></div>
          </div>
          <div className={styles.content} id="img">
            {data.type === 1 && (
              <img
                alt=""
                key={uuid.v1()}
                style={{ maxHeight: window.innerHeight, maxWidth: window.innerWidth }}
                className={styles.fullScreenImg}
                crossOrigin={''}
                src={`${finalUrl}`}
              />
            )}
          </div>
        </Modal>
      </div>
      {/* <MediaImgFullScreen isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} data={data} preFullClick={preFullClick} nextFullClick={nextFullClick}/> */}
      {/* <MediaImgFullScreen isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} data={data} preFullClick={preFullClick} nextFullClick={nextFullClick} /> */}
    </>
  )
}

export default MediaImage
