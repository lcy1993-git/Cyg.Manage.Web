import React, { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useUpdateEffect } from 'ahooks';
import type { MediaData } from '../../getComponentsByData';

import { Button } from 'antd';
import InputPercentNumber from '@/components/input-percent-number';
import { DownloadOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'

import classNames from 'classnames';
import { baseUrl } from '@/services/common';

import styles from './index.less';

interface MediaImageProps {
  data: MediaData;
  index: number;
}

interface Position {
  x: number;
  y: number;
}

const MediaImage: React.FC<MediaImageProps> = ({
  data,
  index
}) => {

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDrag, setIsDrag] = useState<Boolean>(false);
  const [startPosition, setStartPostion] = useState<Position>({ x: 0, y: 0 })
  const [p, setP] = useState({ x: 0, y: 0 })
  const [percent, setPercent] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const outoSizeHandler = () => {
    setPosition({ x: 0, y: 0 })
    setPercent(100);
  }

  const downLoad = () => {
    const a = document.createElement("a");
    a.setAttribute("href", `${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`);
    a.setAttribute("download", "preview");
    a.click();
  }

  const onmouseMove = (e: MouseEvent) => {
    if (isDrag) {
      setPosition({
        x: (p.x + e.nativeEvent.offsetX - startPosition.x),
        y: (p.y + e.nativeEvent.offsetY - startPosition.y)
      })
    }
  }

  const onmouseUp = () => {
    setIsDrag(false)
  }

  const onmousedown = (e: MouseEvent) => {
    console.log('down');
    setStartPostion({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    setP({ ...position })
    setTimeout(() => {
      setIsDrag(true);
    }, 10)
  }

  useUpdateEffect(() => {
    imgRef.current!.style.left = 2 * position.x + "px";
    imgRef.current!.style.top = position.y + "px";
  }, [JSON.stringify(position)])

  useUpdateEffect(() => {
    imgRef.current!.style.transform = `scale(${percent / 100})`;
  }, [percent])

  useUpdateEffect(() => {
    setPosition({ x: 0, y: 0 })
    setPercent(100)
  }, [index])

  return (
    <>
      <div className={styles.imagWrap}>
        <div className={classNames(styles.overhidden, isDrag ? styles.isDrag : "")}
          onMouseMove={onmouseMove}
          onMouseUp={onmouseUp}
          onMouseDown={onmousedown}
          onMouseLeave={onmouseUp}
        >
          <img
            ref={imgRef}
            className={styles.img}
            crossOrigin={''}
            src={`${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
          />
        </div>

        <div className={styles.AreaButtons}>
          <InputPercentNumber value={percent} onChange={setPercent} />
          <Button onClick={outoSizeHandler}><FullscreenExitOutlined />合适尺寸</Button>
          <Button onClick={() => setIsFullScreen(true)}><FullscreenOutlined />全屏</Button>
          <Button onClick={downLoad}><DownloadOutlined />下载</Button>
        </div>
      </div>
      {
        isFullScreen && <div onClick={() => setIsFullScreen(false)} className={styles.fullScreen} style={{ width: window.innerWidth, height: window.innerHeight }}>
          <img
            className={styles.fullScreenImg}
            crossOrigin={''}
            src={`${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
          />
        </div>
      }
    </>
  );
}

export default MediaImage;