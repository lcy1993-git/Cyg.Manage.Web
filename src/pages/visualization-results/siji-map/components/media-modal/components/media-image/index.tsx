import React, { useState, useRef, useEffect } from 'react'
import { useUpdateEffect } from 'ahooks'
import type { MediaData } from '../../getComponentsByData'

import { Button, Modal } from 'antd'
import InputPercentNumber from '@/components/input-percent-number'
import { DownloadOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'

import classNames from 'classnames'
import { baseUrl } from '@/services/common'

import styles from './index.less'
import uuid from 'node-uuid'

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

  // let handleUrl = `${baseUrl.upload}`.slice(4)
  let handleUrl = `${baseUrl.upload}`
  // let targetUrl = encodeURIComponent(`https://srthkf2.gczhyun.com:21530${handleUrl}`)
  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)
  // let proxyUrl = `http://10.6.1.111:8082/commonGet?target_url=${targetUrl}`
  let proxyUrl = `http://11.188.90.191:21525/commonGet?target_url=${targetUrl}`

  const downLoad = () => {
    const a = document.createElement('a')

    a.setAttribute(
      'href',
      `${proxyUrl}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`
    )
    a.setAttribute('download', 'preview')
    a.click()
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
            src={`${proxyUrl}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
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
          <div className={styles.content}>
            {data.type === 1 && (
              <img
                key={uuid.v1()}
                style={{ maxHeight: window.innerHeight, maxWidth: window.innerWidth }}
                className={styles.fullScreenImg}
                crossOrigin={''}
                src={`${proxyUrl}/Download/GetFileById?fileId=${content[fsIndex].filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
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
